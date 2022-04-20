import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  Dimensions,
  View,
  ScrollView,
  StyleSheet,
  Text,
  RefreshControl
} from "react-native";
import type { DefaultScreenNavigationProp } from "../types";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import DiningHall from "./DiningHall";
import MapView from "./MapView";
import MiniCard from "./MiniCard";

type NavigationProps = { navigation: DefaultScreenNavigationProp };

const { width } = Dimensions.get("window");

const Tab = createBottomTabNavigator();
export default function ListView({ navigation }: NavigationProps) {
  const [locations, setLocations] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getAllLocations().then(() => setRefreshing(false));
  }, []);

  const getAllLocations = async () => {
    try {
      const response = await fetch(
        "https://cf93-129-59-122-20.ngrok.io/api/v1/dining_halls"
      );
      const json = await response.json();
      const diningHalls = json.data;
      setLocations([]);
      for (const [key, value] of Object.entries(diningHalls)) {
        if (key === "Rand") {
          //handle superstation
          for (const [subKey, subValue] of Object.entries(value)) {
            setLocations(prev => [...prev, { ...subValue }])
          }
        } else {
          setLocations(prev => [...prev, { ...value }]);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    // TODO: some sort of automatic refresh or pull to refresh would be nice
    getAllLocations();
    return () => setLocations([]);
  }, []);
  
  return (
    <View style={styles.root}>
      <ScrollView 
        contentContainerStyle={styles.scrollRoot}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        {locations ? (
          locations.map((location) => (
            <MiniCard key={location.name} type={location.type} name={location.name} navigation={navigation} />
          ))
        ) : (
          <View>
            <Text>
              There was an issue getting dining hall locations. Please try again
              later!
            </Text>
          </View>
        )}
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
    alignItems: "center",
  },
});
