import React, { useEffect, useState } from "react";
import { Button, Dimensions, View, ScrollView, StyleSheet } from "react-native";
import type { DefaultScreenNavigationProp } from "../types";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import DiningHall from "./DiningHall";
import MapView from "./MapView";
import MiniCard from "./MiniCard";

type NavigationProps = { navigation: DefaultScreenNavigationProp };


const { width } = Dimensions.get("window");

const Tab = createBottomTabNavigator();
export default function ListView({ navigation }: NavigationProps) {
  const [locations, setLocations] = useState<Object[]>([]);

  const getAllLocations = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/dining_halls");
      const json = await response.json();
      const diningHalls = json.data;

      setLocations(Object.keys(diningHalls));
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    getAllLocations()
  }, [])

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.scrollRoot}>
      {
        locations && locations.map(location => <MiniCard key={location} name={location} navigation={navigation}/> )
      }
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  root: {
    maxWidth: width,
    top: 20,
  },
  scrollRoot: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  }
});