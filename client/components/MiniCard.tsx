import React from "react";
import { Button, View, Text, StyleSheet } from "react-native";
import type { DefaultScreenNavigationProp } from "../types";

type NavigationProps = { navigation: DefaultScreenNavigationProp };

export default function MiniCard({ navigation }: NavigationProps) {
  return (
    <View style={styles.root}>
      <View style={styles.iconContainer}>
        <Text>Icon</Text>
      </View>
      <View style={styles.middleContainer}>
        <Text style={styles.diningHallName}>2301 Allergen Free</Text>
        <Text style={styles.subtitle}>Open until xx:xx</Text>
        <Text style={styles.subtitle}>Dinner starts xx:xx</Text>
      </View>
      <View style={styles.waitTimeContainer}>
        <View style={styles.waitTimeBlob}>
            <Text style={styles.waitTimeMinute}>7</Text>
            <Text>min</Text>
        </View>
      </View>
    </View>
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
    margin: "10px 20px"
  },
  iconContainer: {
    flexGrow: 4
  },
  middleContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    flexGrow: 5
  },
  waitTimeContainer: {
    flexGrow: 3,
    alignItems: "center"
  },
  diningHallName: {
    fontWeight: "700",
    fontSize: 20,
    marginBottom: 8
  },
  subtitle: {
    color: "#616265",
    fontSize: 12,
  },
  waitTimeBlob: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#B0DF63",
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
