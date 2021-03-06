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
import { ScheduledDiningHallInfo } from "types";

const { width } = Dimensions.get("window");

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
  const [locations, setLocations] = useState<ScheduledDiningHallInfo[]>([]);
  const [sortedLocations, setSortedLocations] = useState<
    ScheduledDiningHallInfo[]
  >([]);
  const [refreshing, setRefreshing] = useState(false);

  const [currentDay, setCurrentDay] = useState(1);
  const [currentHour, setCurrentHour] = useState(7);

  const [hist, setHist] = useState({});

  const serverUrl = process.env.SERVER_URL;

  const getAllLocations = async () => {
    setLocations([]);
    try {
      const response = await fetch(`${serverUrl}/api/v1/dining_halls`);
      const json = await response.json();
      const diningHalls = json.data;
      console.log(Object.values(diningHalls))
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

  const getAllHistData = async () => {
    try {
      const response = await fetch(`${serverUrl}/api/v1/historical_data`);
      const json = await response.json();
      const date = new Date();
      const currentHr = Math.floor(
        date.getHours() + date.getMinutes() / 60
      ).toString();
      const locToHist = {};
      for (const [key, value] of Object.entries(json)) {
        if (key === "Rand") {
          Object.assign(
            locToHist,
            { Rand_Bowls: value[currentHr] },
            { Rand_Randwich: value[currentHr] },
            { Rand_Fresh_Mex: value[currentHr] },
            { Rand_Mongolian: value[currentHr] },
            { Rand_Chicken_Shack: value[currentHr] }
          );
        } else if (key === "2301") {
          Object.assign(
            locToHist,
            { "2301_Bowls": value[currentHr] },
            { "2301_Smoothies": value[currentHr] }
          );
        } else {
          const myKey = key;
          locToHist[myKey] = value[currentHr];
        }
      }
      setHist(locToHist);
    } catch (error) {
      console.error(error);
    }
  };

  // I apologize for the logic below, scheduling is so weird
  const addSchedule = () => {
    const locs = locations;
    for (const location of locs) {
      const [
        [breakfastOpen, breakfastClose],
        [lunchOpen, lunchClose],
        [dinnerOpen, dinnerClose],
      ] = location.schedule[days[currentDay]];
      Object.assign(location, { isOpen: true });
      // Check whether it's breakfast/lunch/dinner session
      if (breakfastOpen <= currentHour && currentHour <= breakfastClose) {
        // If breakfast and lunch are back-to-back
        if (breakfastClose === lunchOpen) {
          // If breakfast, lunch, and dinner are back-to-back-to-back
          if (lunchClose === dinnerOpen) {
            Object.assign(location, { openUntil: dinnerClose });
          } else {
            // If there is break between breakfast/lunch and dinner
            Object.assign(
              location,
              { openUntil: lunchClose },
              { nextMeal: "Dinner" },
              { nextMealStarts: dinnerOpen }
            );
          }
        } else {
          // If there is break between breakfast and lunch
          Object.assign(
            location,
            { openUntil: breakfastClose },
            { nextMeal: "Lunch" },
            { nextMealStarts: lunchOpen }
          );
        }
      } else if (lunchOpen <= currentHour && currentHour <= lunchClose) {
        if (lunchClose === dinnerOpen) {
          // If lunch and dinner are back-to-back
          Object.assign(location, { openUntil: dinnerClose });
        } else {
          // If there is break between lunch and dinner
          Object.assign(
            location,
            { openUntil: lunchClose },
            { nextMeal: "Lunch" },
            { nextMealStarts: dinnerOpen }
          );
        }
      } else if (dinnerOpen <= currentHour && currentHour <= dinnerClose) {
        // Dinnertime!
        Object.assign(
          location,
          { openUntil: dinnerClose },
          { nextMeal: "Breakfast" },
          { nextMealStarts: breakfastOpen }
        );
      } else {
        // What is the next food session when closed
        if (currentHour - 24 < breakfastOpen) {
          Object.assign(
            location,
            { nextMeal: "Breakfast" },
            { nextMealStarts: breakfastOpen }
          );
        } else if (currentHour - 24 < lunchOpen) {
          Object.assign(
            location,
            { nextMeal: "Lunch" },
            { nextMealStarts: lunchOpen }
          );
        } else {
          Object.assign(
            location,
            { nextMeal: "Dinner" },
            { nextMealStarts: dinnerOpen }
          );
        }
        Object.assign(location, { isOpen: false });
      }
    }
    return locs;
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getAllLocations()
      .then(() => sortLocations())
      .then(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    const date = new Date();
    setCurrentDay(date.getDay());
    const hour = date.getHours() + date.getMinutes() / 60;
    setCurrentHour(hour);
    (async () => {
      await getAllHistData();
      await getAllLocations();
    })();
    return () => setLocations([]);
  }, []);

  const sortLocations = () => {
    const locationsWithSchedule = addSchedule();
    // Sort by ascending wait time
    locationsWithSchedule.sort((a, b) => a.waitTime - b.waitTime);
    // Sort by open/closed
    locationsWithSchedule.sort((a, b) => Number(b.isOpen) - Number(a.isOpen));
    // Move all unknown wait time locations to end
    locationsWithSchedule.sort((a, b) => (b.waitTime !== null ? 1 : -10));
    setSortedLocations(locationsWithSchedule);
  };

  useEffect(() => {
    // Once we have all locations, sort them
    locations.length > 19 && sortLocations();
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
              waitTimeProp={location.waitTime}
              historical={hist[location.name]}
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
  },
  scrollRoot: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    top: 20,
    paddingBottom: 20,
  },
});
