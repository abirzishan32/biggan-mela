document.addEventListener('DOMContentLoaded', function() {
    const uploadForm = document.getElementById('upload-form');
    const fileInput = document.getElementById('file-input');
    const progressBar = document.getElementById('progress-bar');
    const resultContainer = document.getElementById('result-container');

    uploadForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const files = fileInput.files;

        if (files.length === 0) {
            alert('Please select at least one file to upload.');
            return;
        }

        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }

        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/upload', true);

        xhr.upload.addEventListener('progress', function(e) {
            if (e.lengthComputable) {
                const percentComplete = (e.loaded / e.total) * 100;
                progressBar.style.width = percentComplete + '%';
                progressBar.innerText = Math.round(percentComplete) + '%';
            }
        });

        xhr.onload = function() {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                displayResults(response);
            } else {
                alert('An error occurred during the upload. Please try again.');
            }
        };

        xhr.send(formData);
    });

    function displayResults(response) {
        resultContainer.innerHTML = '';
        if (response.success) {
            resultContainer.innerHTML = '<h3>Upload Successful!</h3>';
            response.results.forEach(result => {
                const resultItem = document.createElement('div');
                resultItem.innerText = result;
                resultContainer.appendChild(resultItem);
            });
        } else {
            resultContainer.innerHTML = '<h3>Upload Failed!</h3>';
            const errorItem = document.createElement('div');
            errorItem.innerText = response.error;
            resultContainer.appendChild(errorItem);
        }
    }
});