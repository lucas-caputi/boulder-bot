from ultralytics import YOLO
from PIL import Image, ImageDraw
import cv2
import numpy as np
from flask import Flask, request
import base64
import sqlite3
import json

# This is the local backend.
# It uses the Flask framework to handle requests from client.
# It uses a SQL database to store information about an image sent by client.


################## INSTANCE SEGMENTATION ##################


# Model path
model_path = './last2000iterations.pt'

# Load a model
model = YOLO(model_path)

# Given an image opened with opencv, runs YOLO instance segmentation and updates database with return data
def predict_image(img_name, img):
    results = model.predict(img)  # return a list of Results objects
    
    for result in results:
        # Convert ndarray to list for bounding boxes
        bounding_boxes_list = result.boxes.xyxy.tolist()

        # Convert ndarray to list for masks
        masks_list = [mask.xy[0].tolist() for mask in result.masks]

        # Initialize list of flags to keep track of selected holds
        selected_list = [0] * len(result.boxes)

        # Update the databse with the converted lists
        insert_data(img_name, bounding_boxes_list, masks_list, selected_list)


################## FLASK ##################


app = Flask(__name__)

# Route that performs image segmentation when image is initially uploaded on client
@app.route('/segment', methods=['POST'])
def segment():
    print("Received 'segment' route request")

    # Get the image file from request form
    image_file = request.files['image']

    # Save the received image to file directory
    image_path = './image.jpg'
    image_file.save(image_path)

    # Read the image
    img = cv2.imread(image_path)
    
    # Perform instance segmentation (this stores instance segmentation data about the image in the database)
    predict_image("cur_image", img)

    # Send the original image back to the client
    with open('./image.jpg', 'rb') as img_file:
        img_data = img_file.read()
    encoded_img = base64.b64encode(img_data).decode('utf-8')
    return {'image': encoded_img}

# Route that, given an image click, checks if a bounding box was clicked,
# and if so, either outlines or un-outlines that object
@app.route('/image_click', methods=['POST'])
def image_click():
    print("Received 'image_click' route request")

    # Get the image file from request form
    image_file = request.files['image']
    pixel_x = request.form.get('pixel_x')
    pixel_y = request.form.get('pixel_y')

    print("pixel value clicked = " + pixel_x + ", " + pixel_y)

    # Save the received image to file directory
    image_path = './image.jpg'
    image_file.save(image_path)

    # Read the image
    img = cv2.imread(image_path)

    # Get the information about the current image from the database
    data_list = get_all_data()
    for row in data_list:
        img_name = row[1]   
        bounding_boxes_list = row[2]
        masks_list = row[3]        
        selected_list = row[4]

    # Check if pixel clicked is within a bounding box, if so outline/un-outline the mask
    index = find_box_index(bounding_boxes_list, float(pixel_x), float(pixel_y))
    if(index):
        # TODO: check if mask is currently selected or not, then either outline or un-outline
        polygon = masks_list[index]                                                 # Get polygon of mask
        polygon_flat = [int(coord) for sublist in polygon for coord in sublist]     # Turn polygon flat
        img_pil = Image.fromarray(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))             # Convert the image from OpenCV format (BGR) to Pillow format (RGB)
        draw = ImageDraw.Draw(img_pil)                                              # Create an ImageDraw object
        draw.polygon(polygon_flat, outline=(0, 255, 0), width=5)                    # Draw the polygon outline with given color and thickness
        img = cv2.cvtColor(np.array(img_pil), cv2.COLOR_RGB2BGR)                    # Convert the modified image back to OpenCV format (BGR)
        img_pil = Image.fromarray(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))             # Convert the image from OpenCV format (BGR) to PIL format (RGB)  
        selected_list[index] = 1                                                    # Update flag for this object (to keep track of what objects are outlined)
        insert_data(img_name, bounding_boxes_list, masks_list, selected_list)       # Update database
        img_pil.save('./image.jpg')                                                 # Update image

    # Send the image back to the client
    with open('./image.jpg', 'rb') as img_file:
        img_data = img_file.read()
    encoded_img = base64.b64encode(img_data).decode('utf-8')
    return {'image': encoded_img}


################## FLASK HELPER FUNCTIONS ##################


# Finds index of the sublist containing the pixel location x, y. If not found, returns None.
def find_box_index(bounding_boxes_list, x, y):
    for index, box in enumerate(bounding_boxes_list):
        x1, y1, x2, y2 = box[:4]
        if x1 <= x <= x2 and y1 <= y <= y2:
            return index
    return None 


################## DATABASE (SQLITE3) ##################


# Create the database table
def create_table():
    conn = sqlite3.connect('image_data.db')
    c = conn.cursor()
    c.execute('''DROP TABLE IF EXISTS image_data''')  # Drop the existing table
    c.execute('''CREATE TABLE IF NOT EXISTS image_data
                 (id INTEGER PRIMARY KEY, img_name TEXT, bounding_boxes TEXT, masks_list TEXT, selected_list TEXT)''')
    conn.commit()
    conn.close()

# Function to insert data into the database
def insert_data(img_name, bounding_boxes_list, masks_list, selected_list):
    conn = sqlite3.connect('image_data.db')
    c = conn.cursor()
    c.execute("INSERT INTO image_data (img_name, bounding_boxes, masks_list, selected_list) VALUES (?, ?, ?, ?)",
              (img_name, json.dumps(bounding_boxes_list), json.dumps(masks_list), json.dumps(selected_list)))
    conn.commit()
    conn.close()

# Function to retrieve all data from the database
def get_all_data():
    conn = sqlite3.connect('image_data.db')
    c = conn.cursor()
    c.execute("SELECT * FROM image_data")
    data = c.fetchall()

    # Convert string data back to lists
    formatted_data = []
    for row in data:
        formatted_row = list(row)
        formatted_row[2] = json.loads(formatted_row[2])  # Convert bounding_boxes string to list
        formatted_row[3] = json.loads(formatted_row[3])  # Convert masks_list string to list
        formatted_row[4] = json.loads(formatted_row[4])  # Convert selected_list string to list
        formatted_data.append(tuple(formatted_row))

    conn.close()
    return formatted_data

################## MAIN ##################

if __name__ == '__main__':  
    create_table()
    app.run(host='0.0.0.0', port=5000)
