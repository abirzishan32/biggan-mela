from birdnetlib import Recording
from birdnetlib.analyzer import Analyzer
from datetime import datetime
from flask import jsonify
import os

# Initialize the analyzer once
analyzer = Analyzer()

def analyze_bird_audio(audio_path, lat=None, lon=None, date=None, min_conf=0.25):
    """
    Analyze bird audio using BirdNET
    
    Args:
        audio_path (str): Path to the audio file
        lat (float, optional): Latitude of recording location
        lon (float, optional): Longitude of recording location
        date (datetime, optional): Date of recording
        min_conf (float, optional): Minimum confidence threshold
        
    Returns:
        list: List of detected birds with their details
    """
    try:
        # Create recording object
        recording = Recording(
            analyzer,
            audio_path,
            lat=lat,
            lon=lon,
            date=date or datetime.now(),
            min_conf=min_conf
        )
        
        # Analyze the recording
        recording.analyze()
        
        # Format the results to match the expected output
        formatted_results = []
        for detection in recording.detections:
            formatted_result = {
                'species': detection['common_name'],
                'confidence': detection['confidence'],
                'start_time': detection['start_time'],
                'end_time': detection['end_time'],
                'scientific_name': detection['scientific_name'],
                'label': detection['label']
            }
            formatted_results.append(formatted_result)
        
        return formatted_results
        
    except Exception as e:
        raise Exception(f"BirdNET analysis failed: {str(e)}")

def analyze_bird(request, upload_folder):
    """
    Handle the bird analysis request
    
    Args:
        request: Flask request object
        upload_folder: Path to the upload folder
        
    Returns:
        Flask response with analysis results
    """
    try:
        if 'audio' not in request.files:
            return jsonify({'error': 'No audio file provided'}), 400

        audio_file = request.files['audio']
        latitude = request.form.get('latitude')
        longitude = request.form.get('longitude')
        
        # Save the uploaded file temporarily
        temp_path = os.path.join(upload_folder, audio_file.filename)
        audio_file.save(temp_path)

        # Create recording object with current date
        recording = Recording(
            analyzer,
            temp_path,
            lat=float(latitude) if latitude else None,
            lon=float(longitude) if longitude else None,
            date=datetime.now(),
            min_conf=0.25
        )
        
        # Analyze the recording
        recording.analyze()
        
        # Clean up the temporary file
        os.remove(temp_path)

        # Return the detections directly as they match the expected format
        return jsonify(recording.detections)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

