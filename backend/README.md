# Fact Checker Application

## Overview
The Fact Checker Application allows users to upload multiple files, including images and PDFs, for analysis and fact processing. The application processes the uploaded files and provides results based on the content analyzed.

## Features
- Upload multiple files (images and PDFs).
- Process and analyze uploaded files for fact-checking.
- Chunk PDF files into manageable pieces for analysis.
- User-friendly interface for file uploads and results display.

## Project Structure
```
fact-checker-app
├── src
│   ├── app.py
│   ├── config
│   │   └── settings.py
│   ├── models
│   │   ├── __init__.py
│   │   └── fact_checker.py
│   ├── services
│   │   ├── __init__.py
│   │   ├── file_processor.py
│   │   ├── pdf_chunker.py
│   │   └── image_processor.py
│   ├── routes
│   │   ├── __init__.py
│   │   ├── upload.py
│   │   └── fact_check.py
│   ├── utils
│   │   ├── __init__.py
│   │   ├── file_validator.py
│   │   └── response_handler.py
│   └── templates
│       ├── index.html
│       ├── upload.html
│       └── results.html
├── static
│   ├── css
│   │   └── style.css
│   └── js
│       └── upload.js
├── uploads
│   └── .gitkeep
├── requirements.txt
├── config.py
└── README.md
```

## Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd fact-checker-app
   ```
3. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

## Usage
1. Start the application:
   ```
   python src/app.py
   ```
2. Open your web browser and go to `http://localhost:5000` to access the application.
3. Use the upload page to select and upload multiple files for analysis.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.