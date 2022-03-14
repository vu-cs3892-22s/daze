import React from "react";
import { Button, View } from "react-native";
import { NativeBaseProvider, extendTheme } from "native-base";
import { createDrawerNavigator, DrawerNavigationOptions } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";

import HomeScreen from "./components/Home";

const theme = extendTheme({
  config: {
    initialColorMode: "dark",
  },
});

const Drawer = createDrawerNavigator();

const DefaultScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button onPress={() => navigation.goBack()} title="Go back home" />
    </View>
  );
}

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
    <NativeBaseProvider theme={theme}>
      <NavigationContainer>
        <Drawer.Navigator initialRouteName="My Profile" screenOptions={navigatorOptions}>
          <Drawer.Screen name="My Profile" component={HomeScreen} />
          <Drawer.Screen name="Dashboard" component={DefaultScreen} />
          <Drawer.Screen name="Log In" component={DefaultScreen} />
        </Drawer.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}
