import React, { useEffect, useRef, useState } from "react";
import { Button, StyleSheet, View } from "react-native";
import ModalDropdown from "react-native-modal-dropdown";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

import type { DefaultScreenNavigationProp } from "../types";

type NavigationProps = {
  navigation: DefaultScreenNavigationProp;
  route: { params: { locationIndex: number } };
};

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

const sizes = ["S", "M", "L"];

export default function Update({ route, navigation }: NavigationProps) {
  const { locationIndex } = route.params;
  const stationDropdownRef = useRef<ModalDropdown | null>(null);
  const sizeDropdownRef = useRef<ModalDropdown | null>(null);

  const [station, setStation] = useState<number>(-1);
  const [size, setSize] = useState<number>(-1);

  const showToast = (message: string) => {
    Toast.show({
      type: "success",
      text1: message,
    });
  };

  const sendLineData = async (diningHallName: string, lineLength: string) => {
    try {
      const timestamp = new Date().getTime();
      const sampleBody = {
        vanderbiltEmail: "chuka@vanderbilt.edu",
        diningHallName: diningHallName,
        lineLength: lineLength,
        timestamp: timestamp,
      };

      // TODO: Big hack to circumvent React Native cookies thing. Will need to fix this for real.
      const authSession = await AsyncStorage.getItem("authSession");
      console.log("authSession", authSession);

      const response = await fetch("http://localhost:8080/api/v1/data/lines", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          credentials: "include",
          "Set-Cookie": authSession as string,
        },
        body: JSON.stringify(sampleBody),
      });
      console.log("hey response:", response);
      const json = await response.json();
      const message = json.message;
      showToast(message);
    } catch (error) {
      console.error(error);
    }
  };

  const goBack = () => {
    setStation(-1);
    setSize(-1);
    navigation.goBack();

    stationDropdownRef?.current?.select(-1);
    sizeDropdownRef?.current?.select(-1);
  };

  useEffect(() => {
    stationDropdownRef?.current?.select(locationIndex || -1);
    setStation(locationIndex || -1);
    return () => {
      setStation(-1);
      setSize(-1);
    };
  }, []);

  // const getLocData = async () => {
  //   try {
  //     const sampleBody = {
  //       vanderbiltEmail: "xx",
  //       diningHallName: "aa",
  //       timestamp: "ss",
  //       lineLength: "dd",
  //     };
  //     const response = await fetch(
  //       "http://localhost:8080/api/v1/location/EBI",
  //       {
  //         method: "GET",
  //       }
  //     );
  //     const json = await response.json();
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };
  // useEffect(() => {
  //   getLocData();
  // }, []);

  return (
    <View style={styles.container}>
      <View style={styles.dropdownContainer}>
        <ModalDropdown
          ref={stationDropdownRef}
          onSelect={(idx) => setStation(Number(idx))}
          defaultValue={"Select Station..."}
          options={locations}
          textStyle={{
            fontSize: 24,
            color: "#fff",
          }}
          style={{
            backgroundColor: "#E76666",
            borderRadius: 15,
            padding: 15,
            alignItems: "center",
            width: 200,
          }}
        />
        <ModalDropdown
          ref={sizeDropdownRef}
          onSelect={(idx) => setSize(Number(idx))}
          defaultValue={"Select Size..."}
          options={["S", "M", "L"]}
          textStyle={{
            fontSize: 24,
            color: "#fff",
            alignContent: "center",
          }}
          style={{
            backgroundColor: "#E76666",
            borderRadius: 15,
            padding: 15,
            alignItems: "center",
            width: 200,
          }}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button title={"Go back"} onPress={() => goBack()} />
        <Button
          title={"Update"}
          onPress={() => sendLineData(locations[station], sizes[size])}
        />
      </View>
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    alignItems: "center",
  },
  dropdownContainer: {
    display: "flex",
    flexDirection: "column",
    height: 140,
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    paddingTop: 20,
  },
});
function nodeFetch(nodeFetch: any) {
  throw new Error("Function not implemented.");
}
