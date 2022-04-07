import React from "react";
import { Button, View } from "react-native";
import type { DefaultScreenNavigationProp } from "../types";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import DiningHall from "./DiningHall";
import MapView from "./MapView";

type NavigationProps = { navigation: DefaultScreenNavigationProp };

const Tab = createBottomTabNavigator();
export default function ListView({ navigation }: NavigationProps) {
  const signIn = async () => {

    try {
      const response = await fetch("http://localhost:8080/auth");

      const json = await response.json();
      const data = json.data;
      console.log("JSON",json.google)

    } catch (error) {
      console.error(error);
    }
  }

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button onPress={() => navigation.navigate("Dining Hall")} title="Go to dining hall" />

      <Button onPress={() => signIn()} title="list" />
    </View>
  );
}
