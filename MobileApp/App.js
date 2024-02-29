import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Button,
  TouchableOpacity,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const Tab = createBottomTabNavigator();
const styles = StyleSheet.create({
  header: {
    height: 100,
    backgroundColor: "#f4511e",
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginTop: 45,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    borderColor: "#f4511e",
    borderRadius: 15,
    borderWidth: 2,
    padding: 10,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 18,
    color: "black",
  },
});

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          bottom: 25,
          left: 20,
          right: 20,
          elevation: 0,
          backgroundColor: "#ffffff",
          borderRadius: 15,
          height: 90,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="New Route"
        component={NewRouteScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                top: 15,
                borderWidth: focused ? 2 : 0,
                borderColor: focused ? "#f4511e" : "transparent",
                borderRadius: 15,
                padding: 20,
              }}
            >
              <Image
                source={require("./assets/plus.png")}
                resizeMode="contain"
                style={{ width: 25, height: 25 }}
              ></Image>
              <Text style={{ marginTop: 5 }}>New Route</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Saved Routes"
        component={SavedRoutesScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                top: 15,
                borderWidth: focused ? 2 : 0,
                borderColor: focused ? "#f4511e" : "transparent",
                borderRadius: 15,
                padding: 20,
              }}
            >
              <Image
                source={require("./assets/hold.png")}
                resizeMode="contain"
                style={{ width: 25, height: 25 }}
              ></Image>
              <Text style={{ marginTop: 5 }}>Saved Routes</Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function SavedRoutesScreen() {
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

function NewRouteScreen() {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Take an image</Text>
      </TouchableOpacity>
      <Text></Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Upload an image</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Route Finder</Text>
      </View>
      <NavigationContainer>
        <MyTabs />
      </NavigationContainer>
    </View>
  );
}
