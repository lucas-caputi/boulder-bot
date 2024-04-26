import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  TouchableWithoutFeedback,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { styles } from "./Styles.js";
import * as MediaLibrary from "expo-media-library";
import PanPinchView from "react-native-pan-pinch-view";
import * as FileSystem from "expo-file-system";

export function NewRouteScreen() {
  const [imageUploaded, setImageUploaded] = useState(false);
  const [imageDone, setImageDone] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (imageUri) {
      Image.getSize(
        imageUri,
        (width, height) => {
          setImageSize({ width, height });
        },
        (error) => {
          console.error("Error getting image size:", error);
        }
      );
    }
  }, [imageUri]);

  /* sends request with image to backend and gets back the fully annotated image */
  const uploadImage = async (uri) => {
    try {
      let formData = new FormData();
      formData.append("image", {
        uri: uri,
        name: "image.jpg",
        type: "image/jpg",
      });

      const response = await axios.post(
        "http://192.168.1.65:5000/segment",
        formData
      );

      if (response.status === 200) {
        console.log("Succesfully received image back from server");
        const decodedImage = `data:image/jpeg;base64, ${response.data.image}`;
        setImageUri(decodedImage);
        setImageDone(true);
      } else {
        Alert.alert("Error", "Failed to receive image from server");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      Alert.alert("Error", "Failed to upload image");
    }
  };

  /* sends request to backend server with current image as well as x and y position of pixel clicked.
   * gets back image with click
   */
  const sendPixelClick = async (uri, x, y) => {
    try {
      let formData = new FormData();
      formData.append("image", {
        uri: uri,
        name: "image.jpg",
        type: "image/jpg",
      });
      formData.append("pixel_x", x.toString());
      formData.append("pixel_y", y.toString());

      const response = await axios.post(
        "http://192.168.1.65:5000/image_click",
        formData
      );

      if (response.status === 200) {
        console.log("Succesfully received image back from server");
        const decodedImage = `data:image/jpeg;base64, ${response.data.image}`;
        setImageUri(decodedImage);
        setImageDone(true);
      } else {
        Alert.alert("Error", "Failed to receive image from server");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      Alert.alert("Error", "Failed to upload image");
    }
  };

  /* takes image using phone camera and updates imageUri */
  const takeImage = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    let data = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!data.canceled) {
      setImageDone(false);
      setImageUploaded(true);
      setImageUri(data.assets[0].uri);
      uploadImage(data.assets[0].uri);
    }
  };

  /* picks image from phone image library and updates imageUri */
  const pickImage = async () => {
    let data = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
    });

    if (!data.canceled) {
      setImageDone(false);
      setImageUploaded(true);
      setImageUri(data.assets[0].uri);
      uploadImage(data.assets[0].uri);
    }
  };

  /* saves image to the 'Saved Routes' screen */
  const saveImage = async () => {
    if (imageUri) {
      try {
        const base64 = imageUri.split(",")[1];

        // Prompt the user for a filename
        Alert.prompt(
          "Save Route",
          "Enter the name of your route:",
          async (fileName) => {
            if (fileName) {
              await saveImageWithFilename(fileName, base64);
            } else {
              Alert.alert("Error", "Filename cannot be empty");
            }
          }
        );
      } catch (error) {
        console.error("Error saving image:", error);
        Alert.alert("Error", "Failed to save image");
      }
    } else {
      Alert.alert("Error", "No image to save");
    }
  };

  /* helper function to save image to the 'Saved Routes' screen with a filename given by the user */
  const saveImageWithFilename = async (fileName, base64) => {
    try {
      const fileUri = FileSystem.documentDirectory + fileName + ".jpg";

      await FileSystem.writeAsStringAsync(fileUri, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      console.log(fileUri);

      Alert.alert("Success", "Image saved to Saved Routes Tab!");
    } catch (error) {
      console.error("Error saving image:", error);
      Alert.alert("Error", "Failed to save image");
    }
  };

  /* handles image click by user, sends a request to backend with the click pixel location */
  const handleImagePress = (event) => {
    const { locationX, locationY } = event.nativeEvent;
    const { width, height } = imageSize;
    const relativeX = Math.floor((locationX / 300) * width);
    const relativeY = Math.floor((locationY / 400) * height);
    // need some var to check if it is okay to send image press?
    console.log("Image clicked at:", relativeX, relativeY);
    sendPixelClick(imageUri, relativeX, relativeY);
  };

  return (
    <View style={styles.container}>
      {!imageUploaded && (
        <View style={{ ...styles.textContainer }}>
          <Text style={{ textAlign: "center" }}>Upload an image to begin.</Text>
        </View>
      )}
      {imageUploaded && !imageDone && (
        <View style={{ ...styles.textContainer }}>
          <Text style={{ textAlign: "center" }}>
            Processing image with detection model. This may take some time,
            please wait...
          </Text>
        </View>
      )}
      {imageDone && (
        <View style={{ ...styles.textContainer }}>
          <Text style={{ textAlign: "center" }}>
            Image processing done!{"\n"}Create your route by tapping on the
            image.
          </Text>
        </View>
      )}
      <View style={{ marginTop: -90 }}>
        {imageUri && (
          <PanPinchView
            style={{ ...styles.imageContainer, marginTop: 20 }}
            minScale={1}
            initialScale={1}
            containerDimensions={{
              width: 300,
              height: 400,
            }}
            contentDimensions={{ width: 300, height: 400 }}
          >
            <TouchableWithoutFeedback onPress={handleImagePress}>
              <Image style={[styles.image]} source={{ uri: imageUri }} />
            </TouchableWithoutFeedback>
          </PanPinchView>
        )}
      </View>

      <View style={styles.buttonsContainer}>
        {imageDone && (
          <TouchableOpacity style={styles.button} onPress={saveImage}>
            <Image
              style={{ height: 50, width: 50 }}
              source={require("../assets/save.png")}
            />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.button} onPress={takeImage}>
          <Image
            style={{ height: 50, width: 50 }}
            source={require("../assets/camera.png")}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Image
            style={{ height: 50, width: 50 }}
            source={require("../assets/gallery.png")}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
