def validate_file(file):
    allowed_extensions = {'pdf', 'jpg', 'jpeg', 'png'}
    max_file_size = 5 * 1024 * 1024  # 5 MB

    if file.filename == '':
        return False, "No selected file"

    file_extension = file.filename.rsplit('.', 1)[1].lower()
    if file_extension not in allowed_extensions:
        return False, "File type not allowed"

    if file.content_length > max_file_size:
        return False, "File size exceeds the limit"

    return True, "File is valid"