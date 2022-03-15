import React from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import { Box } from "native-base";

import Card from "./Card";

const styles = StyleSheet.create({
  baseView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    backgroundColor: "#E76666",
  },
  drawerContainer: {
    flex: 1,
    backgroundColor: "#E76666",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  drawerBox: {
    width: "100%",
    minHeight: "50%",
    flex: 1,
    top: "2%",
    backgroundColor: "#FFF",
    alignSelf: "flex-end",
    justifyContent: "space-between",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    padding: 20,
    paddingTop: 50,
    paddingBottom: 70,
  },
});

interface HomeScreenProps {
  navigation?: Object;
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  return (
    <View style={styles.baseView}>
      <ScrollView style={styles.scrollView}>
        <Box style={styles.drawerContainer}>
          <Box style={styles.drawerBox}>
            {/* resident dining halls */}
            <Card
              name={"2301 Allergen Free"}
              line="s"
              data={[20, 35, 75, 10, 45]}
              img={"https://i.ibb.co/p4kMnkZ/2301.png"}
            />
            <Card
              name={"Grins"}
              line="m"
              img={"https://i.ibb.co/6bS28bP/grins.jpg"}
            />
            <Card
              name={"EBI"}
              line="l"
              data={[90, 80, 70, 90, 50]}
              img={
                "https://www.simplyrecipes.com/thmb/NOwXpq1nenarGiJnOTV7o5Oe_Aw=/1777x1333/smart/filters:no_upscale()/__opt__aboutcom__coeus__resources__content_migration__simply_recipes__uploads__2019__04__Beef-Pho-LEAD-2-afc6b6a9144947fb9d72070d7ea8c95c.jpg"
              }
            />
            <Card name={"Kissam Kitchen"} line="s" />
            <Card name={"McTyeire"} line="s" />
            <Card name={"Commons"} line="m" />
            <Card name={"Rand"} line="l" />
            <Card name={"Zeppos"} line="l" />
            {/* cafes */}
            <Card name={"Alumni Cafe"} line="s" />
            <Card name={"Holy Smokes"} line="l" />
            <Card name={"Local Java"} line="s" />
            <Card name={"Suzie's - Blair"} line="m" />
            <Card name={"Suzie's - FGH"} line="l" />
            <Card name={"Suzie's - MRB III"} line="s" />
            <Card name={"Suzie's - Central Library"} line="m" />
          </Box>
        </Box>
      </ScrollView>
    </View>
  );
}
