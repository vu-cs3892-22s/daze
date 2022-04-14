import React from "react";
import { Button, Dimensions, View } from "react-native";
import Map, { Marker} from 'react-native-maps';

import type { DefaultScreenNavigationProp } from "../types";

const { width, height } = Dimensions.get("window");
type NavigationProps = { navigation: DefaultScreenNavigationProp };

export default function MapView({ navigation }: NavigationProps) {
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
          coordinate={{ latitude : 36.14617723099077 , longitude : -86.8033166116821 }}
          description="Rand"
        />
      </Map>
    </View>
  );
}
