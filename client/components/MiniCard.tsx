import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import type { NavigationProp } from "../types";

type NavigationProps = {
  name: string;
  type: string;
  isOpen: boolean;
  openUntil: string;
  nextMeal: string;
  nextMealStart: string;
};

const numberToTime = (num) => {
  const hours = Math.floor(Math.abs(num));
  const minutes = (num % 1) * 60;
  const timeString = Math.floor(minutes / 10)
    ? `${hours}:${minutes}`
    : `${hours}:0${minutes}`;
  return timeString;
};

export default function MiniCard({
  name,
  type,
  isOpen,
  openUntil,
  nextMeal,
  nextMealStart,
}: NavigationProps) {
  const [waitTime, setWaitTime] = useState("0");
  const navigation: NavigationProp = useNavigation();
  const onPress = () => {
    navigation.navigate("Dining Hall", {
      name: name,
      idx: 1,
      line: "m",
      data: [90, 80, 70, 90, 50],
    });
  };

  const rng = () => {
    return (Math.round((Math.random() * 40) / 5) * 5).toFixed();
  };

  useEffect(() => {
    setWaitTime(rng());
  }, []);

  const getBgColor = (min: number) =>
    min < 15 ? "#B0DF63" : min < 40 ? "#FFFA76" : "#FF9B70";

  return (
    <TouchableOpacity onPress={onPress} style={styles.root}>
      <View style={styles.iconContainer}>
        <Image
          style={{ width: 40, height: 40 }}
          source={
            type === "Residential Dining Hall"
              ? require("../assets/spoonfork.png")
              : require("../assets/coffee.png")
          }
        />
      </View>
      <View style={styles.middleContainer}>
        <Text style={styles.diningHallName}>{name.replace(/_/g, " ")}</Text>
        <Text style={styles.subtitle}>
          {isOpen ? `Open until ${numberToTime(openUntil)}` : "Closed"}
        </Text>
        {nextMealStart && (
          <Text style={styles.subtitle}>
            {`${nextMeal} starts ${numberToTime(nextMealStart)}`}
          </Text>
        )}
      </View>
      <View style={styles.waitTimeContainer}>
        <View
          style={[
            styles.waitTimeBlob,
            { backgroundColor: getBgColor(parseInt(waitTime)) },
          ]}
        >
          <Text style={styles.waitTimeMinute}>{waitTime}</Text>
          <Text>min</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  root: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "90%",
    minHeight: 94,
    backgroundColor: "#FFF",
    borderRadius: 25,
    padding: 5,
    marginBottom: 20,
  },
  iconContainer: {
    flexGrow: 3,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  middleContainer: {
    display: "flex",
    maxWidth: 164,
    flexDirection: "column",
    alignItems: "flex-start",
    flexShrink: 6,
    flexGrow: 15,
  },
  waitTimeContainer: {
    flexGrow: 2,
    alignItems: "flex-end",
    paddingRight: 12,
  },
  diningHallName: {
    fontWeight: "700",
    fontSize: 20,
    marginBottom: 8,
  },
  subtitle: {
    color: "#616265",
    fontSize: 12,
  },
  waitTimeBlob: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    height: 60,
    width: 60,
    padding: 10,
  },
  waitTimeMinute: {
    fontSize: 24,
    fontWeight: "700",
  },
});
