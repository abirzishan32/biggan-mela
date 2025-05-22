import os
import mimetypes
from werkzeug.utils import secure_filename

class FileProcessor:
    def __init__(self):
        self.allowed_extensions = {'pdf', 'png', 'jpg', 'jpeg', 'gif'}
        self.max_file_size = 16 * 1024 * 1024  # 16MB
    
    def validate_file(self, file):
        """Validate uploaded file"""
        if not file or file.filename == '':
            return False, "No file selected"
        
        if not self.allowed_file(file.filename):
            return False, f"File type not allowed. Allowed: {', '.join(self.allowed_extensions)}"
        
        # Check file size (if possible)
        file.seek(0, 2)  # Seek to end
        size = file.tell()
        file.seek(0)  # Reset to beginning
        
        if size > self.max_file_size:
            return False, f"File too large. Max size: {self.max_file_size / (1024*1024):.1f}MB"
        
        return True, "Valid file"
    
    def allowed_file(self, filename):
        """Check if file extension is allowed"""
        return '.' in filename and filename.rsplit('.', 1)[1].lower() in self.allowed_extensions
    
    def get_file_type(self, filename):
        """Get file type from filename"""
        if not filename:
            return None
        ext = filename.rsplit('.', 1)[1].lower() if '.' in filename else None
        return ext
    
    def secure_save(self, file, upload_folder, custom_name=None):
        """Securely save uploaded file"""
        try:
            filename = secure_filename(file.filename)
            if custom_name:
                ext = filename.rsplit('.', 1)[1].lower() if '.' in filename else ''
                filename = f"{custom_name}.{ext}" if ext else custom_name
            
            filepath = os.path.join(upload_folder, filename)
            file.save(filepath)
            return filepath, filename
        except Exception as e:
            raise Exception(f"Failed to save file: {str(e)}")