from ultralytics import YOLO

# Load the pre-trained model
model = YOLO('turhancan97/yolov8-segment-trash-detection')

# Perform inference on an image
results = model.predict('image.png')

# Display results
results.show()
