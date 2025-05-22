def format_response(status, message, data=None):
    response = {
        "status": status,
        "message": message,
    }
    if data is not None:
        response["data"] = data
    return response

def handle_upload_response(success, uploaded_files):
    if success:
        return format_response("success", "Files uploaded successfully.", uploaded_files)
    else:
        return format_response("error", "File upload failed.")