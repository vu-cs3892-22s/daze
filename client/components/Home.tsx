import React from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import { Box } from "native-base";

import Card from "./Card";

export default function HomeScreen() {
  return (
    <View style={styles.baseView}>
      <ScrollView style={styles.scrollView}>
        <Box style={styles.drawerContainer}>
          <Box style={styles.drawerBox}>
            <Card
              name={"2301 Allergen Free"}
              idx={0}
              line="s"
              data={[20, 35, 75, 10, 45]}
              img={"https://i.ibb.co/p4kMnkZ/2301.png"}
            />
            <Card
              name={"Grins"}
              idx={1}
              line="m"
              img={"https://i.ibb.co/6bS28bP/grins.jpg"}
            />
            <Card
              name={"EBI"}
              idx={2}
              line="l"
              data={[90, 80, 70, 90, 50]}
              img={
                "https://www.simplyrecipes.com/thmb/NOwXpq1nenarGiJnOTV7o5Oe_Aw=/1777x1333/smart/filters:no_upscale()/__opt__aboutcom__coeus__resources__content_migration__simply_recipes__uploads__2019__04__Beef-Pho-LEAD-2-afc6b6a9144947fb9d72070d7ea8c95c.jpg"
              }
            />
            <Card name={"Kissam Kitchen"} idx={3} line="s" />
            <Card name={"McTyeire"} idx={4} line="s" />
            <Card name={"Commons"} idx={5} line="m" />
            <Card name={"Rand"} idx={6} line="l" />
            <Card name={"Zeppos"} idx={7} line="l" />

            {/* <Card name={"Alumni Cafe"} idx={8} line="s" />
            <Card name={"Holy Smokes"} idx={9} line="l" />
            <Card name={"Local Java"} idx={10} line="s" />
            <Card name={"Suzie's - Blair"} idx={11} line="m" />
            <Card name={"Suzie's - FGH"} idx={12} line="l" />
            <Card name={"Suzie's - MRB III"} idx={13} line="s" />
            <Card name={"Suzie's - Central Library"} idx={14} line="m" /> */}
          </Box>
        </Box>
      </ScrollView>
    </View>
  );
}

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
