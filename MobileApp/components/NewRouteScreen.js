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
import ZoomableImage from "./ZoomableImage.js";

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

  const saveImage = async () => {
    // try {
    //   let data = await MediaLibrary.saveToLibraryAsync(imageUri);
    //   if (data) {
    //     Alert.alert("Success", "Image saved to library");
    //   }
    // } catch (error) {
    //   console.error("Error saving image:", error);
    //   Alert.alert("Error", "Failed to save image");
    // }
  };

  const handleImagePress = (event) => {
    const { locationX, locationY } = event.nativeEvent;
    const { width, height } = imageSize;
    const relativeX = Math.floor((locationX / 300) * width);
    const relativeY = Math.floor((locationY / 400) * height);
    console.log("Image clicked at:", relativeX, relativeY);
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
            Processing image with detection model. Please wait...
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
      {imageUri && (
        <TouchableWithoutFeedback onPress={handleImagePress}>
          <ZoomableImage imageUrl={imageUri} />
        </TouchableWithoutFeedback>
      )}
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
