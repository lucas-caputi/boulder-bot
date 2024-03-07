from ultralytics import YOLO
from PIL import Image, ImageDraw
import cv2
import numpy as np
from flask import Flask, request
import base64

################## INSTANCE SEGMENTATION ##################

# Image and model paths
model_path = './last2000iterations.pt'

# Load a model
model = YOLO(model_path)

# Given an image opened with opencv, returns the annotated image in PIL format using YOLO instance segmentation
def predict_image(img):
    results = model.predict(img)  # return a list of Results objects
    
    # Outline the objects detected in image
    for result in results:
        masks = result.masks  # Masks object for segmentation masks outputs
        for mask in masks:
            polygon = mask.xy[0]                                            # Get polygon of mask
            img_pil = Image.fromarray(cv2.cvtColor(img, cv2.COLOR_BGR2RGB)) # Convert the image from OpenCV format (BGR) to Pillow format (RGB)
            draw = ImageDraw.Draw(img_pil)                                  # Create an ImageDraw object
            draw.polygon(polygon, outline=(0, 255, 0), width=5)             # Draw the polygon outline with given color and thickness
            img = cv2.cvtColor(np.array(img_pil), cv2.COLOR_RGB2BGR)        # Convert the modified image back to OpenCV format (BGR)
    img_pil = Image.fromarray(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))         # Convert the image from OpenCV format (BGR) to PIL format (RGB)  
    
    return img_pil

################## FLASK ##################

app = Flask(__name__)

@app.route('/segment', methods=['POST'])
def segment():
    print("Received request")

    # Get the image file from request form
    image_file = request.files['image']

    # Save the received image to file directory
    received_image_path = './received_image.jpg'
    image_file.save(received_image_path)

    # Read the image
    img = cv2.imread(received_image_path)
    
    # Perform instance segmentation
    segmented_image = predict_image(img)

    # Save the segmented image to a file
    segmented_image_path = './segmented_image.jpg'
    segmented_image.save(segmented_image_path)

    with open('./segmented_image.jpg', 'rb') as img_file:
        img_data = img_file.read()

    encoded_img = base64.b64encode(img_data).decode('utf-8')
    return {'image': encoded_img}

################## MAIN ##################

if __name__ == '__main__':  
    app.run(host='0.0.0.0', port=5000)