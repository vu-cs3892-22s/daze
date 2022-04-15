import React, { useEffect, useState } from "react";
import { StyleSheet, ScrollView, View, Text } from "react-native";
import { Box } from "native-base";
import ModalDropdown from "react-native-modal-dropdown";
import { GoogleSigninButton } from '@react-native-google-signin/google-signin';

import Card from "./Card";

interface HomeScreenProps {
  navigation?: Object;
}

interface DiningHallData {
  diningHallName: string,
  lineLength: string,
  timestamp: number
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [lineLength, setLineLength] = useState<string>("m");

  const getAllLocations = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/dining_halls");
      const json = await response.json();
      const data = json.data;
      alert(data)

      // setLineLength(ebiLineLength)
    } catch (error) {
      console.error(error);
    }
  }

  const getLocData = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/location/EBI");
      const json = await response.json();
      const data = json.data;
      const ebiLineLength = data["lineLength"][0].toLowerCase();

      setLineLength(ebiLineLength)
    } catch (error) {
      console.error(error);
    }
  };

  const sortByWait = (locations: DiningHallData[]) => {
    return locations.sort((x, y) => {
      if (x.lineLength === "s" && y.lineLength === "m") {
        return -1
      }
      if (x.lineLength === "m" && y.lineLength === "l") {
        return 1
      }
      return 0
      //not tested
    })
  }

  useEffect(() => {
    getAllLocations()
  }, [])
  return (
    <View style={styles.baseView}>
      <ScrollView style={styles.scrollView}>
        <Box style={styles.drawerContainer}>
          <Box style={styles.drawerBox}>
            <View style={styles.sortContainer}>
              <Text style={styles.sortText}>Sort by: </Text>
              <ModalDropdown
                options={["Wait time", "Distance", "Favorites"]}
                textStyle={{
                  fontSize: 16,
                }}
              />
            </View>
            <View>
              
            </View>
            <Card
              name={"2301 Allergen Free"}
              idx={0}
              line="s"
              data={[20, 35, 75, 10, 45]}
              img={"https://i.ibb.co/p4kMnkZ/2301.png"}
              isOpen
            />
            <Card
              name={"Grins"}
              idx={1}
              line="m"
              img={"https://i.ibb.co/6bS28bP/grins.jpg"}
              isOpen
            />
            <Card
              name={"EBI"}
              idx={2}
              line={lineLength}
              data={[90, 80, 70, 90, 50]}
              img={
                "https://www.simplyrecipes.com/thmb/NOwXpq1nenarGiJnOTV7o5Oe_Aw=/1777x1333/smart/filters:no_upscale()/__opt__aboutcom__coeus__resources__content_migration__simply_recipes__uploads__2019__04__Beef-Pho-LEAD-2-afc6b6a9144947fb9d72070d7ea8c95c.jpg"
              }
              isOpen
            />
            <Card isOpen name={"Kissam Kitchen"} idx={3} line="s" img={"https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3474&q=80"} />
            <Card isOpen={false} name={"McTyeire"} idx={4} line="s" img={"https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3474&q=80"}/>
            <Card isOpen name={"Commons"} idx={5} line="m" img={"https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3474&q=80"}/>
            <Card isOpen name={"Rand"} idx={6} line="l" img={"https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3474&q=80"}/>
            <Card isOpen name={"Zeppos"} idx={7} line="l" img={"https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3474&q=80"}/>

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
    minWidth: "100%",
  },
  drawerContainer: {
    flex: 1,
    backgroundColor: "#E76666",
    minWidth: "100%",
    margin: 0,
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
  sortContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingBottom: 10,
    paddingRight: 6,
  },
  sortText: {
    fontSize: 16,
    fontWeight: 'bold',
  }
});
