import React, { useEffect, useState } from "react";
import { Button, Dimensions, View, Image } from "react-native";
import Map, { Marker } from "react-native-maps";

import type { DefaultScreenNavigationProp } from "../types";
import DiningHall from "./DiningHall";

const { width, height } = Dimensions.get("window");
type NavigationProps = { navigation: DefaultScreenNavigationProp };

interface DiningHallDataBody {
  [key: string]: Number[];
}

export default function MapView({ navigation }: NavigationProps) {
  const [diningHallData, setDiningHallData] =
    useState<DiningHallDataBody | null>(null);
  const [locations, setLocations] = useState<Object[]>([]);


  const getDiningHallLongLat = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/dining_halls");
      const json = await response.json();
      const data = json.data;

      setDiningHallData(data);
    } catch (error) {
      console.error(error);
    }
  };

  type DiningHallMarkerProps = {
    diningHall: string;
    length: string;
  };

  const DiningHallMarker: React.FC<DiningHallMarkerProps> = ({
    diningHall,
    length,
  }) => {
    //Right now it's saying that it's still null?
    let long = 0;
    let lat = 0;
    if (diningHallData !== null) {
      long = diningHallData[diningHall].longitude;
      lat = diningHallData[diningHall].latitude;
    }

    let coord = {
      latitude: long,
      longitude: lat,
    };

    let pin = require("../assets/gray-pin.png");

    if (length === "short") {
      pin = require("../assets/green-pin.png");
    } else if (length === "medium") {
      pin = require("../assets/yellow-pin.png");
    } else if (length === "long") {
      pin = require("../assets/red-pin.png");
    }

    return (
      <Marker coordinate={coord} description={diningHall}>
        <Image source={pin} style={{ height: 60, width: 60 }} />
      </Marker>
    );
  };

  useEffect(() => {
    getDiningHallLongLat();
  }, []);
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Map
        initialRegion={{
          latitude: 36.1455971,
          longitude: -86.8042274,
          latitudeDelta: 0.016,
          longitudeDelta: 0.008,
        }}
        style={{ width: width, height: height }}
      >
        <DiningHallMarker diningHall={"EBI"} length={"short"} />
        <DiningHallMarker diningHall={"2301"} length={"medium"} />
        <DiningHallMarker diningHall={"Kissam"} length={"closed"} />
        <DiningHallMarker diningHall={"Zeppos"} length={"long"} />
      </Map>
    </View>
  );
}
