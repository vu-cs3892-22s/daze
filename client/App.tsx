import React from "react";
import { NativeBaseProvider } from "native-base";
import { createDrawerNavigator, DrawerNavigationOptions } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";

import HomeScreen from "./components/Home";
import Update from "./components/Update";
import DefaultScreen from "./components/DefaultScreen";

import type { RootDrawerParamList } from "./types";

const Drawer = createDrawerNavigator<RootDrawerParamList>();

const navigatorOptions: DrawerNavigationOptions = {
  headerStyle: {
    backgroundColor: "#E76666",
  },
  headerTintColor: "#fff",
  headerTitleStyle: {
    fontWeight: "bold",
  },
  headerTitle: "daze",
  headerRight: () => (
    <FontAwesome
      name="bell"
      size={24}
      color="white"
      onPress={() => alert("Show notifications")}
    />
  ),
};

export default function App() {
  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <Drawer.Navigator screenOptions={navigatorOptions}>
          <Drawer.Screen name="My Profile" component={HomeScreen} />
          <Drawer.Screen name="Update" component={Update} initialParams={{ locationIndex: -1 }} />
          <Drawer.Screen name="Dashboard" component={DefaultScreen} />
          <Drawer.Screen name="Log In" component={DefaultScreen} />
        </Drawer.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}
