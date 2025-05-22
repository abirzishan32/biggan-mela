from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_restx import Api, Resource, fields
from birdnet import analyze_bird, analyzer
from birdphoto import analyze_bird_photo
from banglaocr import perform_ocr
import os

app = Flask(__name__)
CORS(app)
api = Api(app, 
    title='Bird Analysis API',
    version='1.0',
    description='API for analyzing bird sounds and images using BirdNET and HuggingFace',
    doc='/swagger'
)

# Define the namespace
ns = api.namespace('api', description='Bird analysis operations')

# Define the OCR request model
ocr_parser = api.parser()
ocr_parser.add_argument('image', location='files', type='FileStorage', required=True, help='Image file (JPG, PNG)')

# Define the OCR response model
ocr_response_model = api.model('OCRResponse', {
    'text': fields.String(description='Extracted Bengali text from the image'),
    'success': fields.Boolean(description='Whether the OCR was successful'),
    'error': fields.String(description='Error message if OCR failed')
})

# Define the audio request model
upload_parser = api.parser()
upload_parser.add_argument('audio', location='files', type='FileStorage', required=True, help='Audio file (WAV or MP3)')
upload_parser.add_argument('latitude', location='form', type=float, required=False, help='Latitude of recording location')
upload_parser.add_argument('longitude', location='form', type=float, required=False, help='Longitude of recording location')

# Define the photo request model
photo_parser = api.parser()
photo_parser.add_argument('image', location='files', type='FileStorage', required=True, help='Bird image file (JPG, PNG)')

# Define the audio response model
detection_model = api.model('Detection', {
    'species': fields.String(description='Common name of the bird'),
    'confidence': fields.Float(description='Confidence score of the detection'),
    'start_time': fields.Float(description='Start time of the detection in seconds'),
    'end_time': fields.Float(description='End time of the detection in seconds'),
    'scientific_name': fields.String(description='Scientific name of the bird'),
    'label': fields.String(description='Full label of the detection')
})

# Define the photo response model
photo_detection_model = api.model('PhotoDetection', {
    'species': fields.String(description='Bird species name'),
    'confidence': fields.Float(description='Confidence score of the detection'),
    'scientific_name': fields.String(description='Scientific name of the bird'),
    'start_time': fields.Float(description='Start time (always 0 for photos)'),
    'end_time': fields.Float(description='End time (always 0 for photos)')
})

UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

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

if __name__ == '__main__':
    # Check if BirdNET is properly initialized
    if analyzer is None:
        print("WARNING: BirdNET analyzer failed to initialize. Audio analysis will not be available.")
    app.run(debug=False, use_reloader=False, port=5000)