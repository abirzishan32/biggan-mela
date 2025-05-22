from flask import Flask, request
from flask_cors import CORS
from flask_restx import Api, Resource, fields
from birdnet import analyze_bird, analyzer
from birdphoto import analyze_bird_photo
from banglaocr import perform_ocr
from flask_socketio import SocketIO, emit, join_room, leave_room
from factcheck import FactCheckChain
from asgiref.sync import async_to_sync
import os
import time
from werkzeug.utils import secure_filename
from services.file_processor import FileProcessor
from services.pdf_processor import PDFProcessor
from services.image_processor import ImageProcessor

app = Flask(__name__)
CORS(app)
api = Api(app, 
    title='BigGan Mela Analysis API',
    version='1.0',
    description='API for analyzing bird sounds, images, OCR, and fact-checking with file uploads',
    doc='/swagger'
)

# Configure SocketIO with proper CORS
socketio = SocketIO(
    app, 
    cors_allowed_origins="*",
    async_mode='threading',
    logger=True,
    engineio_logger=True
)

# Initialize processors
fact_checker = FactCheckChain(
    tavily_api_key=os.getenv('TAVILY_API_KEY'),
    google_api_key=os.getenv('GOOGLE_API_KEY')
)

file_processor = FileProcessor()
pdf_processor = PDFProcessor()
image_processor = ImageProcessor()

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg', 'gif', 'wav', 'mp3'}
MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_CONTENT_LENGTH

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Define the namespace
ns = api.namespace('api', description='Analysis operations')

# Define models
ocr_parser = api.parser()
ocr_parser.add_argument('image', location='files', type='FileStorage', required=True, help='Image file (JPG, PNG)')

ocr_response_model = api.model('OCRResponse', {
    'text': fields.String(description='Extracted Bengali text from the image'),
    'success': fields.Boolean(description='Whether the OCR was successful'),
    'error': fields.String(description='Error message if OCR failed')
})

upload_parser = api.parser()
upload_parser.add_argument('audio', location='files', type='FileStorage', required=True, help='Audio file (WAV or MP3)')
upload_parser.add_argument('latitude', location='form', type=float, required=False, help='Latitude of recording location')
upload_parser.add_argument('longitude', location='form', type=float, required=False, help='Longitude of recording location')

photo_parser = api.parser()
photo_parser.add_argument('image', location='files', type='FileStorage', required=True, help='Bird image file (JPG, PNG)')

# File upload parser
file_upload_parser = api.parser()
file_upload_parser.add_argument('files', location='files', type='FileStorage', action='append', required=True, help='Files to upload (PDF, images)')
file_upload_parser.add_argument('query', location='form', type=str, required=False, help='Additional query text')

detection_model = api.model('Detection', {
    'species': fields.String(description='Common name of the bird'),
    'confidence': fields.Float(description='Confidence score of the detection'),
    'start_time': fields.Float(description='Start time of the detection in seconds'),
    'end_time': fields.Float(description='End time of the detection in seconds'),
    'scientific_name': fields.String(description='Scientific name of the bird'),
    'label': fields.String(description='Full label of the detection')
})

photo_detection_model = api.model('PhotoDetection', {
    'species': fields.String(description='Bird species name'),
    'confidence': fields.Float(description='Confidence score of the detection'),
    'scientific_name': fields.String(description='Scientific name of the bird'),
    'start_time': fields.Float(description='Start time (always 0 for photos)'),
    'end_time': fields.Float(description='End time (always 0 for photos)')
})

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@ns.route('/analyze-bird')
class BirdAnalysis(Resource):
    @ns.expect(upload_parser)
    @ns.response(200, 'Success', [detection_model])
    @ns.response(400, 'Bad Request')
    @ns.response(500, 'Internal Server Error')
    def post(self):
        """Analyze bird sounds in an audio file"""
        if analyzer is None:
            return {'error': 'BirdNET analyzer is not properly initialized. Please check the server logs.'}, 500
        return analyze_bird(request, UPLOAD_FOLDER)

@ns.route('/analyze-bird-photo')
class BirdPhotoAnalysis(Resource):
    @ns.expect(photo_parser)
    @ns.response(200, 'Success', [photo_detection_model])
    @ns.response(400, 'Bad Request')
    @ns.response(500, 'Internal Server Error')
    def post(self):
        """Analyze bird species in a photo"""
        return analyze_bird_photo(request, UPLOAD_FOLDER)

@ns.route('/ocr')
class OCR(Resource):
    @ns.expect(ocr_parser)
    @ns.response(200, 'Success', ocr_response_model)
    @ns.response(400, 'Bad Request')
    @ns.response(500, 'Internal Server Error')
    def post(self):
        """Extract Bengali text from an image"""
        try:
            if 'image' not in request.files:
                return {'error': 'No image file provided', 'success': False}, 400
                
            image_file = request.files['image']
            if image_file.filename == '':
                return {'error': 'No selected file', 'success': False}, 400
                
            result = perform_ocr(image_file)
            return result, 200 if result['success'] else 500
            
        except Exception as e:
            return {'error': str(e), 'success': False}, 500

@ns.route('/factcheck')
class FactCheck(Resource):
    @ns.expect(api.model('FactCheckRequest', {
        'query': fields.String(required=True, description='The statement to fact check'),
        'socket_id': fields.String(description='Socket ID of the client')
    }))
    @ns.response(200, 'Success')
    @ns.response(400, 'Bad Request')
    @ns.response(500, 'Internal Server Error')
    def post(self):
        """Process a fact-checking request"""
        try:
            data = request.get_json()
            query = data.get('query')
            
            if not query:
                return {'error': 'Query is required'}, 400
            
            # Get socket ID from headers if available
            socket_id = request.headers.get('X-Socket-ID')
            print(f"Processing fact check for socket: {socket_id}")
            
            # Use async_to_sync to handle the coroutine
            verify_fact_sync = async_to_sync(fact_checker.verify_fact)
            result = verify_fact_sync(socketio, query, socket_id)
            
            return result
            
        except Exception as e:
            print(f"Error in fact check: {e}")
            return {'error': str(e)}, 500

@ns.route('/factcheck-files')
class FactCheckFiles(Resource):
    @ns.expect(file_upload_parser)
    @ns.response(200, 'Success')
    @ns.response(400, 'Bad Request')
    @ns.response(500, 'Internal Server Error')
    def post(self):
        """Process fact-checking with file uploads"""
        try:
            # Get socket ID from headers
            socket_id = request.headers.get('X-Socket-ID')
            print(f"Processing file fact check for socket: {socket_id}")
            
            # Get query text if provided
            query_text = request.form.get('query', '')
            
            # Check if files are provided
            if 'files' not in request.files:
                return {'error': 'No files provided'}, 400
            
            files = request.files.getlist('files')
            if not files or all(f.filename == '' for f in files):
                return {'error': 'No files selected'}, 400
            
            # Emit initial status
            if socket_id:
                socketio.emit('fact_check_update', {
                    'type': 'file_upload_start',
                    'message': f'Processing {len(files)} uploaded files...',
                    'status': 'processing_files'
                }, room=socket_id)
            
            # Process files
            extracted_content = []
            processed_files = []
            
            for file in files:
                if file and file.filename != '' and allowed_file(file.filename):
                    filename = secure_filename(file.filename)
                    timestamp = str(int(time.time()))
                    unique_filename = f"{timestamp}_{filename}"
                    filepath = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
                    file.save(filepath)
                    
                    # Process based on file type
                    file_ext = filename.rsplit('.', 1)[1].lower()
                    
                    if file_ext == 'pdf':
                        # Process PDF
                        if socket_id:
                            socketio.emit('fact_check_update', {
                                'type': 'file_processing',
                                'message': f'Extracting text from PDF: {filename}',
                                'status': 'processing_pdf'
                            }, room=socket_id)
                        
                        chunks, chunk_count = pdf_processor.process_pdf(filepath)
                        if chunks:
                            for chunk in chunks:
                                extracted_content.append({
                                    'type': 'pdf_text',
                                    'content': chunk.page_content,
                                    'source': filename,
                                    'metadata': chunk.metadata
                                })
                        
                    elif file_ext in ['png', 'jpg', 'jpeg', 'gif']:
                        # Process Image with OCR
                        if socket_id:
                            socketio.emit('fact_check_update', {
                                'type': 'file_processing',
                                'message': f'Extracting text from image: {filename}',
                                'status': 'processing_image'
                            }, room=socket_id)
                        
                        try:
                            with open(filepath, 'rb') as img_file:
                                ocr_result = perform_ocr(img_file)
                                if ocr_result.get('success') and ocr_result.get('text'):
                                    extracted_content.append({
                                        'type': 'image_text',
                                        'content': ocr_result['text'],
                                        'source': filename,
                                        'metadata': {'ocr_confidence': ocr_result.get('confidence', 0)}
                                    })
                        except Exception as e:
                            print(f"Error processing image {filename}: {e}")
                    
                    processed_files.append({
                        'filename': filename,
                        'type': file_ext,
                        'path': filepath
                    })
                    
                    # Clean up file after processing
                    try:
                        os.remove(filepath)
                    except:
                        pass
            
            if not extracted_content and not query_text:
                return {'error': 'No content could be extracted from files and no query provided'}, 400
            
            # Combine all content for fact-checking
            combined_content = ""
            if query_text:
                combined_content += f"Query: {query_text}\n\n"
            
            if extracted_content:
                combined_content += "Extracted Content:\n\n"
                for content_item in extracted_content:
                    combined_content += f"From {content_item['source']} ({content_item['type']}):\n"
                    combined_content += content_item['content'] + "\n\n"
            
            # Emit content processing complete
            if socket_id:
                socketio.emit('fact_check_update', {
                    'type': 'content_extracted',
                    'message': f'Successfully extracted content from {len(extracted_content)} sources',
                    'status': 'content_ready'
                }, room=socket_id)
            
            # Now perform fact-checking on the combined content
            verify_fact_sync = async_to_sync(fact_checker.verify_fact)
            result = verify_fact_sync(socketio, combined_content, socket_id)
            
            # Add file processing metadata to result
            result['file_metadata'] = {
                'processed_files': len(processed_files),
                'extracted_sources': len(extracted_content),
                'files_info': processed_files
            }
            
            return result
            
        except Exception as e:
            print(f"Error in file fact check: {e}")
            if socket_id:
                socketio.emit('fact_check_update', {
                    'type': 'error',
                    'message': f'Error processing files: {str(e)}',
                    'status': 'error'
                }, room=socket_id)
            return {'error': str(e)}, 500

# Socket.IO event handlers
@socketio.on('connect')
def handle_connect():
    print(f'Client connected: {request.sid}')
    emit('connected', {'data': 'Connected to BigGan Mela server'})

@socketio.on('disconnect')
def handle_disconnect():
    print(f'Client disconnected: {request.sid}')

@socketio.on('join_room')
def handle_join_room(data):
    room = data.get('room', request.sid)
    join_room(room)
    print(f'Client {request.sid} joined room {room}')
    emit('room_joined', {'room': room})

@socketio.on('leave_room')
def handle_leave_room(data):
    room = data.get('room', request.sid)
    leave_room(room)
    print(f'Client {request.sid} left room {room}')
    emit('room_left', {'room': room})

@socketio.on('chat_message')
def handle_message(data):
    print(f'Message from {request.sid}: {data}')
    emit('message', data, broadcast=True, include_self=False)

@socketio.on('typing')
def handle_typing(data):
    emit('typing', data, broadcast=True, include_self=False)

if __name__ == '__main__':
    # Check if BirdNET is properly initialized
    if analyzer is None:
        print("WARNING: BirdNET analyzer failed to initialize. Audio analysis will not be available.")
    
    print("Starting BigGan Mela server with Socket.IO and file upload support...")
    socketio.run(app, debug=True, host='0.0.0.0', port=5000, allow_unsafe_werkzeug=True)