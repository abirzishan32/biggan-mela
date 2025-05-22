from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
import os
from services.file_processor import FileProcessor
from services.pdf_chunker import PDFProcessor

upload_bp = Blueprint('upload', __name__)

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@upload_bp.route('/upload', methods=['POST'])
def upload_files():
    if 'files' not in request.files:
        return jsonify({'error': 'No files part'}), 400

    files = request.files.getlist('files')
    if not files:
        return jsonify({'error': 'No selected files'}), 400

    uploaded_files = []
    for file in files:
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file_path = os.path.join(UPLOAD_FOLDER, filename)
            file.save(file_path)
            uploaded_files.append(file_path)

            if filename.endswith('.pdf'):
                pdf_processor = PDFProcessor(file_path)
                pdf_chunks = pdf_processor.chunk_pdf()
                # Process PDF chunks as needed

    return jsonify({'uploaded_files': uploaded_files}), 200