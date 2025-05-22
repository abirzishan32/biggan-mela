import os
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

API_URL = "https://router.huggingface.co/hf-inference/models/chriamue/bird-species-classifier"
headers = {
    "Authorization": f"Bearer {os.getenv('HF_TOKEN')}",
}

def analyze_bird_photo(request, upload_folder):
    """
    Analyze a bird photo using HuggingFace's bird species classifier model.
    
    Args:
        request: Flask request object containing the image file
        upload_folder: Directory to temporarily store uploaded files
    
    Returns:
        List of dictionaries containing bird species detection results
    """
    try:
        if 'image' not in request.files:
            return {'error': 'No image file provided'}, 400
        
        file = request.files['image']
        if file.filename == '':
            return {'error': 'No selected file'}, 400
        
        # Save the uploaded file temporarily
        filepath = os.path.join(upload_folder, file.filename)
        file.save(filepath)
        
        # Query the HuggingFace API
        with open(filepath, "rb") as f:
            data = f.read()
        
        response = requests.post(
            API_URL,
            headers={"Content-Type": "image/jpeg", **headers},
            data=data
        )
        
        # Clean up the temporary file
        os.remove(filepath)
        
        if response.status_code != 200:
            return {'error': f'Failed to analyze image: {response.text}'}, 500
        
        results = response.json()
        
        # Format the response to match the expected model
        formatted_results = []
        for result in results:
            formatted_results.append({
                'species': result['label'],
                'confidence': float(result['score']),
                'scientific_name': result['label'],  # You might want to add a mapping for scientific names
                'start_time': 0.0,  # Photos don't have time information
                'end_time': 0.0
            })
        
        return formatted_results
        
    except Exception as e:
        return {'error': str(e)}, 500
