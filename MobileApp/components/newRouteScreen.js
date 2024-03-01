import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "expo-camera";
import { styles } from "./Styles.js";
import { Button } from "react-native/Libraries/Components/Button.js";

export function NewRouteScreen() {
  const [cameraPermission, setCameraPermission] =
    ImagePicker.useCameraPermissions();

  if (permission?.status !== ImagePicker.PermissionStatus.GRANTED) {
    return (
      <View>
        <Text>Permission Not Granted = {permission?.status}</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Request Permissions</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const [imageUri, setImageUri] = useState(null);

  const takePicture = async () => {
    console.log("take in image");
    const data = await ImagePicker.takePictureAsync({
      allowsEditing: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Image,
      quality: 1,
    });

    if (!data.cancelled) {
      console.log(data.assets[0].uri);
    }
  };

  const pickImage = async () => {
    console.log("pick an image");
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.cancelled) {
      setImageUri(result.uri);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={takePicture}>
        <Text style={styles.buttonText}>Take an image</Text>
      </TouchableOpacity>
      <Text></Text>
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Upload an image</Text>
      </TouchableOpacity>
      {imageUri && (
        <Image source={{ uri: imageUri }} style={{ width: 200, height: 200 }} />
      )}
    </View>
  );
}
