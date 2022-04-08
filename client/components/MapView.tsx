import React, { useEffect, useState } from "react";
import { Button, Dimensions, View } from "react-native";
import Map, { Marker } from "react-native-maps";

import type { DefaultScreenNavigationProp } from "../types";
import DiningHall from "./DiningHall";

const { width, height } = Dimensions.get("window");
type NavigationProps = { navigation: DefaultScreenNavigationProp };

export default function MapView({ navigation }: NavigationProps) {
  const [diningHallData, setDiningHallData] = useState(null);

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
    const long = diningHallData[diningHall].longitude;
    const lat = diningHallData[diningHall].latitude;

    //console.log("this is the longitude " + long);

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
        <Marker
          coordinate={{
            latitude: 36.14617723099077,
            longitude: -86.8033166116821,
          }}
          description="Rand"
        />
        <DiningHallMarker diningHall={"EBI"}></DiningHallMarker>
      </Map>
    </View>
  );
}
