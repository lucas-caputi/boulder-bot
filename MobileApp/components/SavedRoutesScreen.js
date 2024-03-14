import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  Alert,
  TouchableWithoutFeedback,
  ActionSheetIOS,
  Platform,
} from "react-native";
import { styles } from "./Styles";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { useFocusEffect } from "@react-navigation/native";

export function SavedRoutesScreen() {
  const [imageList, setImageList] = useState([]);

  useFocusEffect(
    // Fetch images when the component mounts
    React.useCallback(() => {
      fetchImages();
    }, [])
  );

  useEffect(() => {
    // Request permission when the component mounts
    requestMediaLibraryPermission();
  }, []);

  const requestMediaLibraryPermission = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please grant permission to access the media library"
        );
      }
    } catch (error) {
      console.error("Error requesting media library permission:", error);
    }
  };

  const fetchImages = async () => {
    try {
      const directory = FileSystem.documentDirectory;
      const fileList = await FileSystem.readDirectoryAsync(directory);
      const imageFiles = fileList.filter((file) =>
        /\.(jpeg|jpg|png|gif)$/i.test(file)
      );

      const imageURIs = await Promise.all(
        imageFiles.map(async (file) => {
          const fileInfo = await FileSystem.getInfoAsync(directory + file);
          return { uri: fileInfo.uri, file: file };
        })
      );

      setImageList(imageURIs);
    } catch (error) {
      console.error("Error fetching images:", error);
      Alert.alert("Error", "Failed to fetch images");
    }
  };

  const deleteImage = async (fileName) => {
    const fileNameWithoutExtension = fileName.replace(/\.[^/.]+$/, ""); // Remove file extension
    Alert.alert(
      "Confirm Deletion",
      `Are you sure you want to delete ${fileNameWithoutExtension}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              const directory = FileSystem.documentDirectory;
              await FileSystem.deleteAsync(directory + fileName);
              fetchImages();
            } catch (error) {
              console.error("Error deleting image:", error);
              Alert.alert("Error", "Failed to delete image");
            }
          },
        },
      ]
    );
  };

  const handleImagePress = (fileName) => {
    const options = ["Delete", "Save to Camera Roll", "Cancel"];
    const destructiveButtonIndex = 0; // Index of Delete option
    const cancelButtonIndex = 2; // Index of Cancel option

    ActionSheetIOS.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            deleteImage(fileName);
            break;
          case 1:
            saveToCameraRoll(fileName);
            break;
          default:
            break;
        }
      }
    );
  };

  const saveToCameraRoll = async (fileName) => {
    try {
      const directory = FileSystem.documentDirectory;
      const fileUri = `${directory}${fileName}`;
      console.log(fileUri);
      await MediaLibrary.saveToLibraryAsync(fileUri);
      Alert.alert("Success", "Image saved to Camera Roll!");
    } catch (error) {
      console.error("Error saving image to Camera Roll:", error);
      Alert.alert("Error", "Failed to save image to Camera Roll");
    }
  };

  return (
    <View style={styles.savedRouteScreen}>
      {imageList.length === 0 ? (
        <View style={styles.container}>
          <Text style={styles.text}>
            You currently have no saved routes. {"\n"} Go to the New Route tab
            to create one!
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {imageList.map((item, index) => (
            <TouchableWithoutFeedback
              key={index}
              onPress={() => handleImagePress(item.file)}
            >
              <View style={styles.imageScrollContainer}>
                <Image source={{ uri: item.uri }} style={styles.image} />
                <Text style={styles.routeName}>
                  {item.file.replace(/\.[^/.]+$/, "")}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
