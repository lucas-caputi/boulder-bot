# Boulder Bot (CPE Senior Project)

**NOTE: This project is still in progress, expected finish date is early June 2024.** \
\
This repository contains a mobile app built with React Native and a backend built with Python using the Flask framework and a SQL database. \
\
The app allows climbers to create custom bouldering routes using pre-existing climbing holds and routes in a climbing gym.
Our backend leverages a YOLOv8 instance segmentation model trained on a custom dataset, which can detect and outline climbing holds in an image.

## Demo

Please note this demo represents the current stage of development and not the finished project.

![Alt Text](https://github.com/lucas-caputi/boulder-bot/blob/main/assets/app_demo.gif)

## TODO

- [ ] Determine if instance_segmentation/requirements.txt needs to be updated
- [ ] Add ability to deselect holds
- [ ] Add ability to change color of hold outlines and/or mark start and finish holds
- [ ] Add draw feature so users can manually outline holds or draw on the image
- [ ] Move backend from running on local machine to a cloud service like firebase
- [ ] Add a profile feature where users can log in and save routes to there profile
- [ ] When a user saves a photo to camera roll, place the route name somewhere in the photo

## Authors

- Lucas Caputi
- Noah Masten
