import React, { useEffect, useRef, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import ModalDropdown from "react-native-modal-dropdown";

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

export default function Update({ route, navigation }) {
  const { locationIndex } = route.params;
  const stationDropdownRef = useRef(null);

  const [station, setStation] = useState(-1);
  const [size, setSize] = useState(-1);

  useEffect(() => {
    stationDropdownRef?.current?.select(locationIndex || -1);
    setStation(locationIndex || -1);
  }, []);

  return (
    <View style={styles.container}>
      <ModalDropdown
        ref={stationDropdownRef}
        onSelect={(index) => setStation(index)}
        defaultValue={"Select Station"}
        options={locations}
      />
      <ModalDropdown
        onSelect={(index) => setSize(index)}
        defaultValue={"Select Size"}
        options={["s", "m", "l"]}
      />
      <Button title={"Later"} onPress={() => alert("later")} />
      <Button
        title={"Update"}
        onPress={() => alert(`update: ${station} ${size}`)}
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
