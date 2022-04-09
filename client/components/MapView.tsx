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
      //const longitude = data[diningHall].longitude;
      //const latitude = data[diningHall].latitude;
      setDiningHallData(data);
      //console.log("this is the data " + JSON.stringify(diningHallData));
      /*console.log(
        "this is the longitude" +
          JSON.stringify(diningHallData["EBI"].longitude)
      ); */
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
    /*
    console.log("this is the dining hall " + diningHall + typeof diningHall);
    console.log("this is the data " + JSON.stringify(diningHallData));
    console.log(JSON.stringify(diningHallData[diningHall]) !== "");*/

    //Right now it's saying that it's still null?
    let long = 0;
    let lat = 0;
    if (diningHallData !== null) {
      long = diningHallData[diningHall].longitude;
      lat = diningHallData[diningHall].latitude;
      //long = 36.1493254;
      //lat = -86.8018191;
    }
    console.log(long);
    console.log(lat);
    //console.log("this is the longitude " + long);

    let coordinate = { lat, long };
    return (
      <Marker
        coordinate={{
          latitude: lat,
          longitude: long,
        }}
        description={diningHall}
      />
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
          latitudeDelta: 0.00922,
          longitudeDelta: 0.00421,
        }}
        style={{ width: width, height: height }}
      >
        <DiningHallMarker diningHall={"EBI"} />
      </Map>
    </View>
  );
}
