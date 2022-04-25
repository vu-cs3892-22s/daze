import React, { useState } from "react";
import { useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import type { DefaultScreenNavigationProp } from "../types";

type NavigationProps = {
  navigation: DefaultScreenNavigationProp;
  name: string;
  type: string;
};

export default function MiniCard({ navigation, name, type }: NavigationProps) {
  const [waitTime, setWaitTime] = useState("0");
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
        {type === "Residential Dining Hall" ? (
          <Image
            style={{ width: 40, height: 40 }}
            source={require("../assets/spoonfork.png")}
          />
        ) : (
          <Image
            style={{ width: 40, height: 40 }}
            source={require("../assets/coffee.png")}
          />
        )}
      </View>
      <View style={styles.middleContainer}>
        <Text style={styles.diningHallName}>{name.replace(/_/g, " ")}</Text>
        <Text style={styles.subtitle}>Open until 15:00</Text>
        <Text style={styles.subtitle}>Dinner starts 16:30</Text>
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
    flexGrow: 4,
    maxWidth: 60,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  middleContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    flexGrow: 5,
  },
  waitTimeContainer: {
    flexGrow: 3,
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
