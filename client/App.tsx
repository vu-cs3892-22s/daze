import React from "react";
import { NativeBaseProvider } from "native-base";
import {
  createDrawerNavigator,
  DrawerNavigationOptions,
} from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";

import HomeScreen from "./components/Home";
import Update from "./components/Update";
import DefaultScreen from "./components/DefaultScreen";
import Login from "./components/Login";

import type { RootDrawerParamList } from "./types";

import * as Linking from "expo-linking";
import { Text, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const prefix = Linking.createURL("/");

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
  const linking = {
    prefixes: [prefix],
  };

  // TODO: extreme hack, only works for web view
  const authSession = window.location.search;
  if (authSession) {
    AsyncStorage.setItem("authSession", authSession.substring(8)).then(() => {
      Linking.openURL("http://localhost:19006/My%20Profile");
    });
  }

  return (
    <NativeBaseProvider>
      <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
        <Drawer.Navigator screenOptions={navigatorOptions}>
          <Drawer.Screen name="My Profile" component={HomeScreen} />
          <Drawer.Screen
            name="Update"
            component={Update}
            initialParams={{ locationIndex: -1 }}
          />
          <Drawer.Screen name="Dashboard" component={DefaultScreen} />
          <Drawer.Screen name="Log In" component={Login} />
        </Drawer.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}
