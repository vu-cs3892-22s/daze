// TODO: unused file, remove!

// import React from "react";
// import { Button, View } from "react-native";
// import type { DefaultScreenNavigationProp } from "../types";

// type NavigationProps = { navigation: DefaultScreenNavigationProp };

// export default function DefaultScreen({ navigation }: NavigationProps) {
//   const signIn = async () => {
//     try {
//       const response = await fetch("https://cf93-129-59-122-20.ngrok.io/auth");

//       const json = await response.json();
//       const data = json.data;
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
//       <Button onPress={() => navigation.goBack()} title="Go back home" />

//       <Button onPress={() => signIn()} title="Sign in" />
//     </View>
//   );
// }
