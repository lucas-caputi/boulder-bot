import { View, Text, Image } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NewRouteScreen } from "./NewRouteScreen.js";
import { SavedRoutesScreen } from "./SavedRoutesScreen.js";

const Tab = createBottomTabNavigator();

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
                source={require("../assets/plus.png")}
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
                source={require("../assets/hold.png")}
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
