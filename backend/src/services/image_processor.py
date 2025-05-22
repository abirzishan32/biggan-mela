from PIL import Image
import io
import os
from banglaocr import perform_ocr

class ImageProcessor:
    def __init__(self):
        self.supported_formats = ['PNG', 'JPEG', 'JPG', 'GIF', 'BMP']
        self.max_size = (2048, 2048)  # Maximum image size for processing
    
    def process_image(self, file_path):
        """Process a single image file"""
        try:
            # Open and validate image
            with Image.open(file_path) as image:
                # Convert to RGB if necessary
                if image.mode != 'RGB':
                    image = image.convert('RGB')
                
                # Resize if too large
                if image.size[0] > self.max_size[0] or image.size[1] > self.max_size[1]:
                    image.thumbnail(self.max_size, Image.Resampling.LANCZOS)
                
                # Save processed image temporarily
                temp_path = file_path.replace('.', '_processed.')
                image.save(temp_path, 'JPEG', quality=85)
                
                return temp_path, {
                    'original_size': image.size,
                    'format': image.format,
                    'mode': image.mode
                }
        except Exception as e:
            print(f"Error processing image {file_path}: {str(e)}")
            return None, {}
    
    def extract_text(self, file_path):
        """Extract text from image using OCR"""
        try:
            with open(file_path, 'rb') as img_file:
                result = perform_ocr(img_file)
                return result
        except Exception as e:
            print(f"Error extracting text from image: {str(e)}")
            return {'success': False, 'error': str(e)}
    
    def validate_image(self, file_path):
        """Validate if file is a proper image"""
        try:
            with Image.open(file_path) as img:
                img.verify()
            return True
        except Exception:
            return False
    
    def get_image_info(self, file_path):
        """Get basic image information"""
        try:
            with Image.open(file_path) as img:
                return {
                    'format': img.format,
                    'mode': img.mode,
                    'size': img.size,
                    'has_transparency': img.mode in ('RGBA', 'LA') or 'transparency' in img.info
                }
        except Exception as e:
            return {'error': str(e)}