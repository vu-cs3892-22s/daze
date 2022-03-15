import React, { useEffect, useRef, useState } from "react";
import { Button, StyleSheet, View } from "react-native";
import ModalDropdown from "react-native-modal-dropdown";

import type { DefaultScreenNavigationProp } from "../types";

type NavigationProps = { navigation: DefaultScreenNavigationProp, route: any };

const locations = [
  "2301 Allergen Free",
  "Grins",
  "EBI",
  "Kissam Kitchen",
  "McTyeire",
  "Commons",
  "Rand",
  "Zeppos",
];

export default function Update({ route, navigation }: NavigationProps) {
  const { locationIndex } = route.params;
  const stationDropdownRef = useRef<ModalDropdown | null>(null);

  const [station, setStation] = useState<number>(-1);
  const [size, setSize] = useState<number>(-1);

  useEffect(() => {
    stationDropdownRef?.current?.select(locationIndex || -1);
    setStation(locationIndex || -1);
  }, []);

  return (
    <View style={styles.container}>
      <ModalDropdown
        ref={stationDropdownRef}
        onSelect={(idx) => setStation(Number(idx))}
        defaultValue={"Select Station"}
        options={locations}
      />
      <ModalDropdown
        onSelect={(idx) => setSize(Number(idx))}
        defaultValue={"Select Size"}
        options={["s", "m", "l"]}
      />
      <Button title={"Later"} onPress={() => alert("later")} />
      <Button
        title={"Update"}
        onPress={() => alert(`update: ${locations[station]} ${size}`)}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    alignItems: "center",
  },
});
