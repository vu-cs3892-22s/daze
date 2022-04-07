import React from "react";
import { Button, View } from "react-native";
import type { DefaultScreenNavigationProp } from "../types";

type NavigationProps = { navigation: DefaultScreenNavigationProp };

export default function DiningHall({ navigation }: NavigationProps) {
  const signIn = async () => {

    try {
      const response = await fetch("http://localhost:8080/auth");

      const json = await response.json();
      const data = json.data;
      console.log("JSON",json.google)

    } catch (error) {
      console.error(error);
    }
  }

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button onPress={() => navigation.goBack()} title="Go back home" />

      <Button onPress={() => signIn()} title="dining hall in" />
    </View>
  );
}
