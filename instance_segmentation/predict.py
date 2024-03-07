from ultralytics import YOLO
from PIL import Image, ImageDraw
import cv2
import numpy as np

# Image and model paths
model_path = './last.pt'
image_path = './test_image.jpg'

# Read the image
img = cv2.imread(image_path)

# Load a model
model = YOLO(model_path)

# Run batched inference on image
results = model.predict(img)  # return a list of Results objects

# Process results list
for result in results:
    # OUTLINE OUTPUT
    masks = result.masks  # Masks object for segmentation masks outputs
    for mask in masks:
        polygon = mask.xy[0]                                            # Get polygon of mask
        img_pil = Image.fromarray(cv2.cvtColor(img, cv2.COLOR_BGR2RGB)) # Convert the image from OpenCV format (BGR) to Pillow format (RGB)
        draw = ImageDraw.Draw(img_pil)                                  # Create an ImageDraw object
        draw.polygon(polygon, outline=(0, 255, 0), width=5)             # Draw the polygon outline with given color and thickness
        img = cv2.cvtColor(np.array(img_pil), cv2.COLOR_RGB2BGR)        # Convert the modified image back to OpenCV format (BGR)
    img_pil = Image.fromarray(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))     # Convert the image from OpenCV format (BGR) to PIL format (RGB)
    output_image_path = './output_image.jpg'
    img_pil.save(output_image_path)    

    # NORMAL OUTPUT
    # boxes = result.boxes                        # Boxes object for bounding box outputs
    # masks = result.masks                        # Masks object for segmentation masks outputs
    # keypoints = result.keypoints                # Keypoints object for pose outputs
    # probs = result.probs                        # Probs object for classification outputs
    # result.show()                               # display to screen
    # result.save(filename='output_image.jpg')    # save to disk

