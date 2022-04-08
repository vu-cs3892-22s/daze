import React, { useEffect } from "react";
import { Button, View, StyleSheet } from "react-native";
import type { DefaultScreenNavigationProp } from "../types";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import DiningHall from "./DiningHall";
import MapView from "./MapView";
import MiniCard from "./MiniCard";

type NavigationProps = { navigation: DefaultScreenNavigationProp };

const Tab = createBottomTabNavigator();
export default function ListView({ navigation }: NavigationProps) {

  const getAllLocations = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/dining_halls");
      const json = await response.json();
      const diningHalls = json.data;

      console.log(diningHalls)

      // setLineLength(ebiLineLength)
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    getAllLocations()
  }, [])

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
    <View style={styles.root}>
      <MiniCard navigation={navigation} />
      <MiniCard navigation={navigation} />
      <MiniCard navigation={navigation} />
      <MiniCard navigation={navigation} />
      {/* <Button onPress={() => navigation.navigate("Dining Hall")} title="Go to dining hall" />

      <Button onPress={() => signIn()} title="list" /> */}
    </View>
  );
}


const styles = StyleSheet.create({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
  },
});