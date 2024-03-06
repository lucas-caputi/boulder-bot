import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, Alert } from "react-native"; // Import Alert
import * as ImagePicker from "expo-image-picker";
import { styles } from "./Styles";
import { classifyUsingMobilenet } from "./TensorFlowModel";

export function NewRouteScreen() {
  
  const [isTfReady, setIsTfReady] = useState(false);
  const [result, setResult] = useState('');

  const [permission, requestPermission] = ImagePicker.useCameraPermissions();
  const [imageUri, setImageUri] = useState(null);

  const takeImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.cancelled) {
      setImageUri(result.assets[0].uri);
      console.log(result.assets[0].uri);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
    });
    if (!result.cancelled) {
      setImageUri(result.assets[0].uri);
      console.log(result.assets[0].uri);
    }
  };



useEffect(() => {
    classifyUsingMobilenet(imageUri, setIsTfReady, setResult);
  }, [imageUri]);

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
      {isTfReady && <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Upload an image</Text>
      </TouchableOpacity>}
      {!isTfReady && (
        <Text style={{ width: 300, textAlign: "center" }}>
          Loading TFJS model...
        </Text>
      )}
      {isTfReady && result === "" && (
        <Text style={{ width: 300, textAlign: "center" }}>
          Select an image to classify
        </Text>
      )}
      {result !== "" && (
        <Text style={{ width: 300, textAlign: "center" }}>
          {result}
        </Text>
      )}
    </View>
  );
}
