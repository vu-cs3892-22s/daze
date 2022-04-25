import React, { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  View,
  ScrollView,
  StyleSheet,
  Text,
  RefreshControl,
} from "react-native";
import type { DefaultScreenNavigationProp } from "../types";
import MiniCard from "./MiniCard";

type NavigationProps = { navigation: DefaultScreenNavigationProp };

const { width } = Dimensions.get("window");

const serverUrl = process.env.SERVER_URL;

export default function ListView({ navigation }: NavigationProps) {
  const [locations, setLocations] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const [currentDay, setCurrentDay] = useState(1);
  const [currentHour, setCurrentHour] = useState(7);

  useEffect(() => {
    const date = new Date();
    setCurrentDay(date.getDay());
    setCurrentHour(date.getHours() + date.getMinutes() / 60);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getAllLocations().then(() => setRefreshing(false));
  }, []);

  const getAllLocations = async () => {
    try {
      const response = await fetch(`${serverUrl}/api/v1/dining_halls`);
      const json = await response.json();
      const diningHalls = json.data;
      setLocations([]);
      for (const [key, value] of Object.entries(diningHalls)) {
        if (key === "Rand") {
          //handle superstation
          for (const [, subValue] of Object.entries(value)) {
            setLocations((prev) => [...prev, { ...subValue }]);
          }
        } else {
          setLocations((prev) => [...prev, value]);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    // TODO: some sort of automatic refresh or pull to refresh would be nice
    getAllLocations().then(() => postProcess());
    return () => setLocations([]);
  }, []);

  const postProcess = () => {
    if (locations.length > 19 && !refreshing) {
      const currentLocations = locations;
      for (const location of currentLocations) {
        if (
          location.schedule["Monday"][0][0] <= currentHour &&
          currentHour <= location.schedule["Monday"][0][1]
        ) {
          location["isOpen"] = true;
          location["openUntil"] = location.schedule["Monday"][0][1];
          location["nextMeal"] = "Lunch";
          location["nextMealStarts"] = location.schedule["Monday"][1][0];
        } else if (
          location.schedule["Monday"][1][0] <= currentHour &&
          currentHour <= location.schedule["Monday"][1][1]
        ) {
          location["isOpen"] = true;
          location["openUntil"] = location.schedule["Monday"][1][1];
          location["nextMeal"] = "Lunch";
          location["nextMealStarts"] = location.schedule["Monday"][2][0];
        } else if (
          location.schedule["Monday"][2][0] <= currentHour &&
          currentHour <= location.schedule["Monday"][2][1]
        ) {
          location["isOpen"] = true;
          location["openUntil"] = location.schedule["Monday"][2][1];
          location["nextMeal"] = "Breakfast";
          location["nextMealStarts"] = location.schedule["Monday"][0][0];
        } else {
          if (currentHour < location.schedule["Monday"][0][0]) {
            location["nextMeal"] = "Breakfast";
            location["nextMealStarts"] = location.schedule["Monday"][0][0];
          } else if (currentHour < location.schedule["Monday"][1][0]) {
            location["nextMeal"] = "Lunch";
            location["nextMealStarts"] = location.schedule["Monday"][1][0];
          } else {
            location["nextMeal"] = "Dinner";
            location["nextMealStarts"] = location.schedule["Monday"][2][0];
          }
          location["isOpen"] = false;
        }
      }
      setLocations(currentLocations);
    }
  };

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.scrollRoot}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {locations ? (
          locations.map((location) => (
            <MiniCard
              key={location.name}
              type={location.type}
              name={location.name}
              navigation={navigation}
              isOpen={location.isOpen}
              openUntil={location.openUntil}
              nextMeal={location.nextMeal}
              nextMealStart={location.nextMealStarts}
            />
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
