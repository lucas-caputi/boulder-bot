import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, Alert } from "react-native"; // Import Alert
import * as ImagePicker from "expo-image-picker";
import { styles } from "./Styles";

export function NewRouteScreen() {
  const [permission, requestPermission] = ImagePicker.useCameraPermissions();
  const [imageUri, setImageUri] = useState(null);

  const takeImage = async () => {
    let data = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!data.cancelled) {
      setImageUri(data.assets[0].uri);
      console.log(data.assets[0].uri);
    }
  };

  const pickImage = async () => {
    let data = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
    });
    if (!data.cancelled) {
      setImageUri(data.assets[0].uri);
      console.log(data.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        style={{ width: 300, height: 400 }}
        source={{
          uri: imageUri,
        }}
      />
      <Text></Text>
      <TouchableOpacity style={styles.button} onPress={takeImage}>
        <Text style={styles.buttonText}>Take an image</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Upload an image</Text>
      </TouchableOpacity>
    </View>
  );
}
