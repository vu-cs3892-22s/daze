import React, { useEffect, useState } from "react";
import { Dimensions, View } from "react-native";
import MapComponent from "react-native-maps";

import DiningHallMarker from "./DiningHallMarker";

import { DiningHallInfo, NavigationProps } from "../types";

const { width, height } = Dimensions.get("window");

export default function MapView({ navigation }: NavigationProps) {
  const [nodes, setNodes] = useState<any[]>([]);

  const getAllLocations = async () => {
    const locations = [];
    try {
      const response = await fetch("https://cf93-129-59-122-20.ngrok.io/api/v1/dining_halls");
      const json = await response.json();
      const diningHalls = json.data;
      for (const [key, value] of Object.entries(diningHalls)) {
        if (key === "Rand") {
          //handle superstation
          for (const [subKey, subValue] of Object.entries(value)) {
            locations.push({ ...subValue });
          }
        } else {
          locations.push(value);
        }
      }
    } catch (error) {
      console.error(error);
    }
    return locations;
  };

  const mapCoordsToLocations = (locations: DiningHallInfo[]) => {
    const hashMap = {};
    for (const location of locations) {
      const curCoordStr = [location.latitude, location.longitude].toString();
      if (!hashMap[curCoordStr]) {
        hashMap[curCoordStr] = [];
      }
      hashMap[curCoordStr].push(location);
    }
    return hashMap;
  };

  useEffect(() => {
    (async () => {
      // Fetch all locations/dining halls,
      const locs = await getAllLocations();
      const coords = mapCoordsToLocations(locs);
      const nodes = [];
      // create a one-to-many mapping of coordinates to locations,
      // i.e [x, y] => [{ Rand_1 }, { Rand_2 }, ...]
      Object.entries(coords).forEach(([k, v]: [string, DiningHallInfo[]]) => {
        const numCoords = k.split(",").map((e) => parseFloat(e));
        nodes.push(
          <DiningHallMarker
            key={v[0].name}
            diningHallNames={v.map((s) => s.name)}
            length={v[0].lineLength}
            longitude={numCoords[0]}
            latitude={numCoords[1]}
            navigation={navigation}
          />
        );
      });
      // and update state to an array of DiningHallMarkers
      await setNodes(nodes);
    })();
  }, []);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <MapComponent
        initialRegion={{
          latitude: 36.1455971,
          longitude: -86.8042274,
          latitudeDelta: 0.012,
          longitudeDelta: 0.006,
        }}
        style={{ width: width, height: height }}
        children={nodes}
      />
    </View>
  );
}
