import { View, Text, Image, Dimensions } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NewRouteScreen } from "./NewRouteScreen.js";
import { SavedRoutesScreen } from "./SavedRoutesScreen.js";

const Tab = createBottomTabNavigator();
const { width, height } = Dimensions.get("window");

export function MyTabs() {
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
          height: height * 0.12, // Adjust height based on screen height
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
                top: height * 0.02, // Adjust top based on screen width
                borderWidth: focused ? 2 : 0,
                borderColor: focused ? "#f4511e" : "transparent",
                borderRadius: 15,
                padding: width * 0.05, // Adjust padding based on screen width
              }}
            >
              <Image
                source={require("../assets/plus.png")}
                resizeMode="contain"
                style={{ width: width * 0.06, height: width * 0.06 }} // Adjust icon size based on screen width
              ></Image>
              <Text style={{ marginTop: height * 0.01 }}>New Route</Text>
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
                top: height * 0.02, // Adjust top based on screen width
                borderWidth: focused ? 2 : 0,
                borderColor: focused ? "#f4511e" : "transparent",
                borderRadius: 15,
                padding: width * 0.05, // Adjust padding based on screen width
              }}
            >
              <Image
                source={require("../assets/hold.png")}
                resizeMode="contain"
                style={{ width: width * 0.06, height: width * 0.06 }} // Adjust icon size based on screen width
              ></Image>
              <Text style={{ marginTop: height * 0.01 }}>Saved Routes</Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}
