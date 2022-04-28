import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import type { NavigationProp } from "../types";

type NavigationProps = {
  name: string;
  type: string;
  isOpen: boolean;
  openUntil: number;
  nextMeal: string;
  nextMealStart: number;
  waitTimeProp: number | null;
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
  waitTimeProp,
}: NavigationProps) {
  const [waitTime, setWaitTime] = useState("0");
  const navigation: NavigationProp = useNavigation();
  const onPress = () => {
    navigation.navigate("Dining Hall", {
      name: name,
      line: "m",
      data: [90, 80, 70, 90, 50],
    });
  };

  useEffect(() => {
    if (waitTimeProp) {
      setWaitTime(waitTimeProp.toString());
    }
  }, [waitTimeProp]);

  const getBgColor = (min: number) =>
    min < 15 ? "#B0DF63" : min < 40 ? "#FFFA76" : "#FF9B70";

  return (
    <TouchableOpacity
      onPress={onPress}
      style={isOpen ? [styles.root] : [styles.root, { opacity: 0.85 }]}
    >
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
        {waitTimeProp >= 60 && (
          <Text style={{ color: "#616265", fontSize: 10, bottom: 4 }}>
            more than
          </Text>
        )}
        <View
          style={[
            styles.waitTimeBlob,
            {
              backgroundColor: waitTimeProp
                ? getBgColor(parseInt(waitTime))
                : "#D3D3D3",
            },
          ]}
        >
          <Text style={styles.waitTimeMinute}>
            {waitTimeProp >= 60 ? "1" : waitTime === "0" ? "?" : waitTime}
          </Text>
          <Text>{waitTimeProp >= 60 ? "hr" : "min"}</Text>
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
    flexGrow: 4,
    alignItems: "center",
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
