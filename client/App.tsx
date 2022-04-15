import React, { useEffect } from "react";
import { NativeBaseProvider } from "native-base";
import { NavigationContainer } from "@react-navigation/native";
import { Ionicons, AntDesign, Feather } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";

import HomeScreen from "./components/Home";
import Update from "./components/Update";
import DefaultScreen from "./components/DefaultScreen";
import MapView from "./components/MapView";
import ListView from "./components/ListView";
import DiningHall from "./components/DiningHall";

const Tab = createBottomTabNavigator();

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  // Get all locations
  const getAllLocations = async () => {
    try {
      const response = await fetch(
        "https://cf93-129-59-122-20.ngrok.io/api/v1/dining_halls"
      );
      const json = await response.json();
      const diningHalls = json.data;

      // setLineLength(ebiLineLength)
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getAllLocations();
  }, []);

  // User login
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId:
      "918301654843-4c4em6250rlful1nam4divl5v4f5278a.apps.googleusercontent.com",
    iosClientId:
      "918301654843-4c4em6250rlful1nam4divl5v4f5278a.apps.googleusercontent.com",
    androidClientId:
      "918301654843-4c4em6250rlful1nam4divl5v4f5278a.apps.googleusercontent.com",
    webClientId:
      "918301654843-4c4em6250rlful1nam4divl5v4f5278a.apps.googleusercontent.com",
  });
  const [loggedIn, toggleLoggedIn] = React.useState(false);
  React.useEffect(() => {
    if (response?.type === "success") {
      // attemptLogin(response.authentication?.accessToken)
      //   .then(() => toggleLoggedIn(true))
      //   // TODO: handle error
      //   .catch(console.error);

      console.log("response:" + JSON.stringify(response, null, 2));
    }
  }, [response]);

  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName:
                | "list-circle-outline"
                | "list-circle"
                | "map"
                | "map-outline";

              if (route.name === "List View") {
                iconName = focused ? "list-circle" : "list-circle-outline";

                return <Ionicons name={iconName} size={24} color="#E76666" />;
              } else if (route.name === "Map View") {
                iconName = focused ? "map" : "map-outline";

                return <Ionicons name={iconName} size={24} color="#E76666" />;
              } else {
                <AntDesign name="question" size={24} color="#E76666" />;
              }
            },
            headerTitle: "daze",
            headerStyle: {
              backgroundColor: "#E76666",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
            tabBarActiveTintColor: "tomato",
            tabBarInactiveTintColor: "gray",
            headerRight: () => (
              <Ionicons
                name="person-circle"
                size={24}
                color="white"
                onPress={() => promptAsync()}
                style={{ paddingRight: 5 }}
              />
            ),
          })}
        >
          <Tab.Screen name="List View" component={ListView} />
          <Tab.Screen name="Map View" component={MapView} />
          <Tab.Screen
            name="Dining Hall"
            component={DiningHall}
            options={{ tabBarButton: () => null }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}
