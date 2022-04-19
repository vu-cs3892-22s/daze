import React, { useEffect, useState } from "react";
import { Button, NativeBaseProvider } from "native-base";
import { NavigationContainer } from "@react-navigation/native";
import { Ionicons, AntDesign, Feather } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import AsyncStorage from "@react-native-async-storage/async-storage";

import HomeScreen from "./components/Home";
import Update from "./components/Update";
import DefaultScreen from "./components/DefaultScreen";
import MapView from "./components/MapView";
import ListView from "./components/ListView";
import DiningHall from "./components/DiningHall";
import { Image, Modal, View, StyleSheet, Text } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

const Tab = createBottomTabNavigator();

WebBrowser.maybeCompleteAuthSession();

interface lengthBody {
  Color: String;
  Explanation: String;
}

const attemptLogin = async (accessToken: string | undefined) => {
  // Should only be called when user tries to log in
  // Stores secret key in local storage and creates user on server side if not already created

  const { id, email, picture } = await (
    await fetch("https://www.googleapis.com/userinfo/v2/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Length": "0",
      },
    })
  ).json();

  // TODO: no hardcode salt
  const secretKey = id + email; //PBKDF2(id + email, "daze-secret-key");
  // TODO: no hardcode
  try {
    await fetch("http://localhost:8080/api/v1/user", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        secretKey,
      }),
    });
  } catch (e: unknown) {
    // TODO: handle error
    throw Error(e as string);
  }

  // Save picture to local storage
  try {
    const userInfo = { secretKey, picture, email };
    await AsyncStorage.setItem("userInfo", JSON.stringify(userInfo));
    return userInfo;
  } catch (e: unknown) {
    throw Error(e as string);
  }
};

export default function App() {
  // Get all locations
  const getAllLocations = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/dining_halls");
      const json = await response.json();
      const diningHalls = json.data;

      // setLineLength(ebiLineLength)
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getAllLocations();
  }, []);

  // User login
  const [user, setUser] = React.useState<{
    picture: string;
    email: string;
    secretKey: string;
  } | null>(null);

  const [visible, setVisible] = useState(false);

  const ModalPopup = ({ visible, children }) => {
    return (
      <Modal visible={visible} animationType="slide">
        <View style={styles.modalBackground}>
          <View style={[styles.modalContent]}>{children}</View>
        </View>
      </Modal>
    );
  };

  const LineExplanation = () => {
    return (
      <View>
        <View style={styles.LineExplanation}>
          <View style={styles.waitTimeContainer}>
            <View style={[styles.waitTimeBlob, { backgroundColor: "#B0DF63" }]}>
              <Text style={styles.waitTimeMinute}>X</Text>
              <Text>min</Text>
            </View>
          </View>
          <View style={styles.textContainer}>
            <Text>Short Line: &lt;5 mins</Text>
          </View>
        </View>
        <View style={styles.LineExplanation}>
          <View style={styles.waitTimeContainer}>
            <View style={[styles.waitTimeBlob, { backgroundColor: "#FFFA76" }]}>
              <Text style={styles.waitTimeMinute}>X</Text>
              <Text>min</Text>
            </View>
          </View>
          <View style={styles.textContainer}>
            <Text>Medium Line: &lt;5 mins</Text>
          </View>
        </View>
        <View style={styles.LineExplanation}>
          <View style={styles.waitTimeContainer}>
            <View style={[styles.waitTimeBlob, { backgroundColor: "#FF9B70" }]}>
              <Text style={styles.waitTimeMinute}>X</Text>
              <Text>min</Text>
            </View>
          </View>
          <View style={styles.textContainer}>
            <Text>Long Line: &lt;15 mins</Text>
          </View>
        </View>
        <View style={styles.LineExplanation}>
          <View style={styles.waitTimeContainer}>
            <View
              style={[styles.waitTimeBlob, { backgroundColor: "#CACACA" }]}
            ></View>
          </View>
          <View style={styles.textContainer}>
            <Text>Dining hall is closed</Text>
          </View>
        </View>
      </View>
    );
  };

  useEffect(() => {
    AsyncStorage.getItem("userInfo").then((userInfo) => {
      if (userInfo) {
        setUser(JSON.parse(userInfo));
      } else {
        setUser(null);
      }
    });
  }, []);

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId:
      "918301654843-4c4em6250rlful1nam4divl5v4f5278a.apps.googleusercontent.com",
    iosClientId:
      "918301654843-4c4em6250rlful1nam4divl5v4f5278a.apps.googleusercontent.com",
    androidClientId:
      "918301654843-4c4em6250rlful1nam4divl5v4f5278a.apps.googleusercontent.com",
    webClientId:
      "918301654843-4c4em6250rlful1nam4divl5v4f5278a.apps.googleusercontent.com",
  });

  useEffect(() => {
    if (response?.type === "success") {
      attemptLogin(response.authentication?.accessToken)
        .then(async (userInfo) => {
          setUser(userInfo);
        })
        // TODO: handle error
        .catch(console.error);

      console.log("response:" + JSON.stringify(response, null, 2));
    }
  }, [response]);

  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName:
                | "list-circle-outline"
                | "list-circle"
                | "map"
                | "map-outline";

              if (route.name === "List View") {
                iconName = focused ? "list-circle" : "list-circle-outline";

                return <Ionicons name={iconName} size={24} color="#E76666" />;
              } else if (route.name === "Map View") {
                iconName = focused ? "map" : "map-outline";

                return <Ionicons name={iconName} size={24} color="#E76666" />;
              } else {
                <AntDesign name="question" size={24} color="#E76666" />;
              }
            },
            headerTitle: "daze",
            headerStyle: {
              backgroundColor: "#E76666",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
            tabBarActiveTintColor: "tomato",
            tabBarInactiveTintColor: "gray",
            headerRight: () =>
              user ? (
                <TouchableWithoutFeedback onPress={() => promptAsync()}>
                  <Image
                    source={{
                      uri: user.picture,
                    }}
                    style={{
                      width: 24,
                      height: 24,
                      marginRight: 8,
                      borderRadius: 12,
                    }}
                  />
                </TouchableWithoutFeedback>
              ) : (
                <Ionicons
                  name="person-circle"
                  size={24}
                  color="white"
                  onPress={() => promptAsync()}
                  style={{ paddingRight: 5 }}
                />
              ),
            headerLeft: () => (
              <Ionicons
                name="information-circle-outline"
                size={24}
                color="white"
                onPress={() => setVisible(true)}
                style={{ paddingLeft: 5 }}
              />
            ),
          })}
        >
          <Tab.Screen name="List View" component={ListView} />
          <Tab.Screen name="Map View" component={MapView} />
          <Tab.Screen
            name="Dining Hall"
            component={DiningHall}
            options={{ tabBarButton: () => null }}
          />
        </Tab.Navigator>
      </NavigationContainer>
      <ModalPopup visible={visible}>
        <View>
          <Ionicons
            name="close-outline"
            size={24}
            color="black"
            onPress={() => setVisible(false)}
            style={{}}
          />
          <LineExplanation></LineExplanation>
        </View>
      </ModalPopup>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  LineExplanation: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "90%",
    minHeight: 94,
    backgroundColor: "#EFEFEF",
    borderRadius: 25,
    padding: 5,
    marginBottom: 20,
    marginLeft: 10,
  },
  textContainer: {
    display: "flex",
    flexGrow: 5,
    marginLeft: 60,
  },
  waitTimeContainer: {
    flex: 1,
    flexDirection: "row",
    flexGrow: 3,
    marginLeft: 10,
  },
  waitTimeBlob: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    height: 60,
    width: 60,
    padding: 10,
  },
  waitTimeMinute: {
    fontSize: 24,
    fontWeight: "700",
  },
  modalToggle: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#f2f2f2",
    padding: 10,
    borderRadius: 10,
    alignSelf: "center",
  },
  modalClose: {
    marginTop: 20,
    marginBottom: 0,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 10,
    elevation: 10,
  },
});
