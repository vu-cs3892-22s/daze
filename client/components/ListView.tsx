import React, { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  View,
  ScrollView,
  StyleSheet,
  Text,
  RefreshControl,
} from "react-native";
import MiniCard from "./MiniCard";

const { width } = Dimensions.get("window");

const serverUrl = process.env.SERVER_URL;

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function ListView() {
  const [locations, setLocations] = useState<any[]>([]);
  const [sortedLocations, setSortedLocations] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const [currentDay, setCurrentDay] = useState(1);
  const [currentHour, setCurrentHour] = useState(7);

  const getAllLocations = async () => {
    setLocations([]);
    try {
      const response = await fetch(`${serverUrl}/api/v1/dining_halls`);
      const json = await response.json();
      const diningHalls = json.data;
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

  const addSchedule = () => {
    const locs = locations;
    for (const location of locs) {
      const [
        [breakfastOpen, breakfastClose],
        [lunchOpen, lunchClose],
        [dinnerOpen, dinnerClose],
      ] = location.schedule[days[currentDay]];
      location["isOpen"] = true;
      if (breakfastOpen <= currentHour && currentHour <= breakfastClose) {
        location["openUntil"] = breakfastClose;
        location["nextMeal"] = "Lunch";
        location["nextMealStarts"] = lunchOpen;
      } else if (lunchOpen <= currentHour && currentHour <= lunchClose) {
        location["openUntil"] = lunchClose;
        location["nextMeal"] = "Lunch";
        location["nextMealStarts"] = dinnerOpen;
      } else if (dinnerOpen <= currentHour && currentHour <= dinnerClose) {
        location["openUntil"] = dinnerClose;
        location["nextMeal"] = "Breakfast";
        location["nextMealStarts"] = breakfastOpen;
      } else {
        if (currentHour < breakfastOpen) {
          location["nextMeal"] = "Breakfast";
          location["nextMealStarts"] = breakfastOpen;
        } else if (currentHour < lunchOpen) {
          location["nextMeal"] = "Lunch";
          location["nextMealStarts"] = lunchOpen;
        } else {
          location["nextMeal"] = "Dinner";
          location["nextMealStarts"] = dinnerOpen;
        }
        location["isOpen"] = false;
      }
    }
    return locs;
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getAllLocations().then(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    const date = new Date();
    setCurrentDay(date.getDay());
    setCurrentHour(date.getHours() + date.getMinutes() / 60);
    (async () => {
      await getAllLocations();
    })();
    return () => setLocations([]);
  }, []);

  useEffect(() => {
    if (locations.length > 19) {
      const locationsWithSchedule = addSchedule();
      // Sort by open/closed
      locationsWithSchedule.sort((a, b) => Number(b.isOpen) - Number(a.isOpen));
      setSortedLocations(locationsWithSchedule);
    }
  }, [locations]);

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.scrollRoot}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {sortedLocations ? (
          sortedLocations.map((location) => (
            <MiniCard
              key={location.name}
              type={location.type}
              name={location.name}
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
