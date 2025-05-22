from flask import jsonify
from services.pdf_chunker import PDFProcessor
from services.image_processor import ImageProcessor

class FactChecker:
    def __init__(self):
        self.pdf_processor = PDFProcessor()
        self.image_processor = ImageProcessor()

    def analyze_files(self, files):
        results = {}
        for file in files:
            if file.filename.endswith('.pdf'):
                results[file.filename] = self.pdf_processor.process(file)
            elif file.filename.lower().endswith(('.png', '.jpg', '.jpeg')):
                results[file.filename] = self.image_processor.process(file)
            else:
                results[file.filename] = "Unsupported file type"
        return results

    def process_facts(self, analysis_results):
        # Implement fact processing logic here
        processed_results = {}
        for filename, result in analysis_results.items():
            processed_results[filename] = self._process_individual_fact(result)
        return processed_results

    def _process_individual_fact(self, result):
        # Placeholder for individual fact processing logic
        return {"status": "processed", "data": result}