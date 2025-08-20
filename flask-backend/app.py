from flask import Flask, request, jsonify
import torch
from PIL import Image, UnidentifiedImageError
import os

# Load your trained YOLOv5 model
model = torch.hub.load('ultralytics/yolov5', 'custom', path='runs/best.pt', force_reload=True)

app = Flask(__name__)

@app.route('/')
def home():
    return 'Food Detection API is running!'

@app.route('/detect', methods=['POST'])
def detect_food():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    file = request.files['image']

    # Optional: Save image for debugging
    file_path = "debug_upload.jpg"
    file.save(file_path)
    print("Saved image to:", file_path)

    # Step 1: Try to open the saved image
    try:
        img = Image.open(file_path)
        print("Image loaded:", img.format, img.size)
    except UnidentifiedImageError:
        print("Unidentified image error")
        return jsonify({'error': 'Could not identify image format'}), 400
    except Exception as e:
        print("Image loading error:", e)
        return jsonify({'error': str(e)}), 400

    # Step 2: Perform detection
    results = model(img)
    results.print()

    # Step 3: Parse results
    detected = results.pandas().xyxy[0]
    print("Raw detections:\n", detected)

    conf_threshold = 0.10
    filtered = detected[detected['confidence'] > conf_threshold]
    foods = filtered['name'].tolist()

    print("Detected foods:", foods)
    return jsonify({'foods': foods})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
