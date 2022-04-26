import React, { useEffect, useState } from "react";
import { Image, View, Alert } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { NativeBaseProvider } from "native-base";
import { NavigationContainer } from "@react-navigation/native";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import AsyncStorage from "@react-native-async-storage/async-storage";

import MapView from "./components/MapView";
import ListView from "./components/ListView";
import DiningHall from "./components/DiningHall";
import ModalPopup from "./components/ModalPopup";

type DazeUser = {
  secretKey: string;
  picture: string;
  email: string;
} | null;

const Tab = createBottomTabNavigator();

WebBrowser.maybeCompleteAuthSession();

const serverUrl = process.env.SERVER_URL;

const promptLogout = async (
  setUser: (user: DazeUser) => void,
  promptAsync: () => Promise<unknown>
) => {
  const attemptLogout = async () =>
    AsyncStorage.removeItem("userInfo", () => setUser(null));

  Alert.alert("Logout", "Are you sure you want to logout?", [
    {
      text: "Logout",
      onPress: attemptLogout,
    },
    {
      text: "Sign in as a new user",
      onPress: () => attemptLogout().then(promptAsync),
    },
    {
      text: "Cancel",
      style: "cancel",
    },
  ]);
};

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
    await fetch(`${serverUrl}/api/v1/user`, {
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
  // User login
  const [user, setUser] = React.useState<DazeUser>(null);

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("userInfo").then((userInfo) => {
      if (userInfo) {
        setUser(JSON.parse(userInfo));
      } else {
        setUser(null);
      }
    });
  }, []);

  const clientIds = process.env.GOOGLE_CLIENT_ID;
  const [, response, promptAsync] = Google.useAuthRequest({
    expoClientId: clientIds,
    iosClientId: clientIds,
    androidClientId: clientIds,
    webClientId: clientIds,
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
            tabBarIcon: ({ focused }) => {
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
                return <AntDesign name="question" size={24} color="#E76666" />;
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
                <TouchableWithoutFeedback
                  onPress={() =>
                    user === null
                      ? promptAsync()
                      : promptLogout(setUser, promptAsync)
                  }
                >
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
        </View>
      </ModalPopup>
    </NativeBaseProvider>
  );
}
