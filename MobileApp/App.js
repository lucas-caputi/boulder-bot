import React from "react";
import { View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { styles } from "./components/Styles.js";
import { MyTabs } from "./components/TabNavigator.js";

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Boulder Bot</Text>
      </View>
      <NavigationContainer>
        <MyTabs />
      </NavigationContainer>
    </View>
  );
}
