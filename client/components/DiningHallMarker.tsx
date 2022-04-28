import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Image, Text } from "react-native";
import { Callout, Marker } from "react-native-maps";
import { NavigationProp } from "types";

export default function DiningHallMarker({
  diningHallNames,
  length,
  longitude,
  latitude,
}) {
  const navigation: NavigationProp = useNavigation();

  const onCalloutPress = (name) => {
    navigation.navigate("Dining Hall", {
      name: name,
    });
  };

  let pin;
  if (length === "S") {
    pin = require("../assets/green-pin.png");
  } else if (length === "M") {
    pin = require("../assets/yellow-pin.png");
  } else if (length === "L") {
    pin = require("../assets/red-pin.png");
  } else {
    pin = require("../assets/gray-pin.png");
  }
  return (
    <Marker coordinate={{ latitude, longitude }} pointerEvents="auto">
      <Image source={pin} style={{ height: 30, width: 30 }} />
      <Callout style={{ width: 150, alignItems: "center" }}>
        {diningHallNames.map((diningHallName) => (
          <Text
            style={{ width: "auto", marginBottom: 5 }}
            key={diningHallName}
            onPress={() => onCalloutPress(diningHallName)}
          >
            {diningHallName.replace(/_/g, " ")}
          </Text>
        ))}
      </Callout>
    </Marker>
  );
}
