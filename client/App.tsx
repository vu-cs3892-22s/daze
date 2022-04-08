import React, { useEffect } from "react";
import { NativeBaseProvider } from "native-base";
import { NavigationContainer } from "@react-navigation/native";
import { Ionicons, AntDesign, Feather } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from "./components/Home";
import Update from "./components/Update";
import DefaultScreen from "./components/DefaultScreen";
import MapView from "./components/MapView";
import ListView from "./components/ListView";
import DiningHall from "./components/DiningHall";

const Tab = createBottomTabNavigator();


export default function App() {

  const getAllLocations = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/dining_halls");
      const json = await response.json();
      const diningHalls = json.data;
      console.log("Keys:", Object.keys(diningHalls))
      // console.log(diningHalls)

      // setLineLength(ebiLineLength)
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    getAllLocations()
  }, [])

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
                onPress={() => alert("Show login popup")}
                style={{ paddingRight: 5 }}
              />
            ),
          
          })}
        >
              <Tab.Screen name="List View" component={ListView} />
              <Tab.Screen name="Map View" component={MapView} />
              <Tab.Screen name="Dining Hall" component={DiningHall} options={{ tabBarButton: () => null }} />
        </Tab.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}
