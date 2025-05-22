from flask import Blueprint, request, jsonify
from services.file_processor import FileProcessor
from services.pdf_chunker import PDFProcessor
from services.image_processor import ImageProcessor

fact_check_bp = Blueprint('fact_check', __name__)

@fact_check_bp.route('/fact-check', methods=['POST'])
def fact_check():
    uploaded_files = request.files.getlist('files')
    results = []

    for file in uploaded_files:
        if file.filename.endswith('.pdf'):
            pdf_processor = PDFProcessor(file)
            chunks = pdf_processor.chunk()
            results.append({'file': file.filename, 'chunks': chunks})
        elif file.filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            image_processor = ImageProcessor(file)
            analysis_result = image_processor.process()
            results.append({'file': file.filename, 'analysis': analysis_result})
        else:
            return jsonify({'error': 'Unsupported file type'}), 400

    return jsonify({'results': results}), 200