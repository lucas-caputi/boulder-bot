import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { styles } from "./Styles";
import * as MediaLibrary from "expo-media-library";

export function NewRouteScreen() {
  const [imageDone, setImageDone] = useState(false);
  const [imageUri, setImageUri] = useState(null);

  const uploadImage = async (uri) => {
    try {
      let formData = new FormData();
      formData.append("image", {
        uri: uri,
        name: "image.jpg",
        type: "image/jpg",
      });

      const response = await axios.post(
        "http://192.168.1.222:2222/segment",
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

    if (!data.cancelled) {
      setImageUri(data.assets[0].uri);
      uploadImage(data.assets[0].uri);
    }
  };

  const pickImage = async () => {
    let data = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
    });

    if (!data.cancelled) {
      setImageDone(false);
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
  }

  return (
    <View style={styles.container}>
      {imageUri && (
        <Image style={{ width: 300, height: 400 }} source={{ uri: imageUri }} />
      )}
      <Text></Text>
      {imageDone && <TouchableOpacity style={styles.button} onPress={saveImage}>
        <Text style={styles.buttonText}>Save image</Text>
      </TouchableOpacity>}
      <TouchableOpacity style={styles.button} onPress={takeImage}>
        <Text style={styles.buttonText}>Take an image</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Upload an image</Text>
      </TouchableOpacity>
    </View>
  );
}
