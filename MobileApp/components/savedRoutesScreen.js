import React from "react";
import { View, Text } from "react-native";
import { styles } from "./Styles.js";

export function SavedRoutesScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text
        style={{
          width: 300,
          textAlign: "center",
        }}
      >
        You currently have no saved routes. Go to the New Route tab to create
        one!
      </Text>
    </View>
  );
}
