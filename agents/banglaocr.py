import pytesseract
from PIL import Image
import os

def perform_ocr(image_file):
    try:
        # Configure Tesseract path and data path
        tesseract_path = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
        tessdata_path = r'C:\Program Files\Tesseract-OCR\tessdata'
        
        # Set environment variables
        os.environ['TESSDATA_PREFIX'] = tessdata_path
        pytesseract.pytesseract.tesseract_cmd = tesseract_path
        
        # Open and process the image
        image = Image.open(image_file)
        
        # Extract Bengali text
        text = pytesseract.image_to_string(image, lang='ben+eng')
        
        return {
            'text': text.strip(),
            'success': True
        }
        
    except Exception as e:
        return {
            'error': str(e),
            'success': False
        }
