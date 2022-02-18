import { StyleSheet, ScrollView, Button, View, Text } from "react-native";
import { Box } from "native-base";

import VenueCard from "./VenueCard";
import Card from "./Card";

import React from "react";

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: "#E76666",
  },
});

interface HomeScreenProps {
  navigation?: Object
}


export default function HomeScreen({ navigation }: HomeScreenProps) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <ScrollView style={styles.scrollView}>
        <Box
          flex={1}
          bg="#E76666"
          alignItems="center"
          justifyContent="flex-end"
        >
          <Box
            bg="#FFF"
            flex={1}
            justifyContent={"space-between"}
            borderTopRadius={50}
            padding={8}
            width={"100%"}
            minHeight={"50%"}
            alignSelf={"flex-end"}
          >
            <VenueCard name={"2301 Bowls"} line="s" />
            <VenueCard name={"EBI Pho"} line="m" />
            <VenueCard name={"Grins"} line="l" />
            <Card />
          </Box>
        </Box>
      </ScrollView>
    </View>
  );
}
