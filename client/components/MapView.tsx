import React, { useEffect, useState } from "react";
import { Button, Dimensions, View } from "react-native";
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
  const [locations, setLocations] = useState<string[] | null>(null);

  const signIn = async () => {
    try {
      const response = await fetch("http://localhost:8080/auth");

      const json = await response.json();
      const data = json.data;
      console.log("JSON", json.google);
    } catch (error) {
      console.error(error);
    }
  };

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
  };

  const DiningHallMarker: React.FC<DiningHallMarkerProps> = ({
    diningHall,
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
    return <Marker coordinate={coord} description={diningHall} />;
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
          latitudeDelta: 0.00922,
          longitudeDelta: 0.00421,
        }}
        style={{ width: width, height: height }}
      >
        <DiningHallMarker diningHall={"EBI"} />
        <DiningHallMarker diningHall={"2301"} />
        <DiningHallMarker diningHall={"Zeppos"} />
      </Map>
    </View>
  );
}
