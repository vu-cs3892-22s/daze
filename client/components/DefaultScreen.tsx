import React from "react";
import { Button, View } from "react-native";
import type { DefaultScreenNavigationProp } from "../types";

type NavigationProps = { navigation: DefaultScreenNavigationProp };

export default function DefaultScreen({ navigation }: NavigationProps) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button onPress={() => navigation.goBack()} title="Go back home" />
    </View>
  );
}
