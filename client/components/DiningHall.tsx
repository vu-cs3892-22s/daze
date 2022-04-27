// TODO: I left some unused variables in here because @Chuka I think you might be using them later?

import React, { useEffect, useState, useRef } from "react";
import {
  Button,
  ScrollView,
  Dimensions,
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import ParallaxScrollView from "react-native-parallax-scroll-view";
import { BarChart } from "react-native-chart-kit";
import ButtonToggleGroup from "react-native-button-toggle-group";

import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface DiningHallProps {
  route: {
    params: {
      name: string;
      line: string;
      data: number[];
    };
  };
}

const serverUrl = process.env.SERVER_URL;

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const breakfastData = {
  labels: ["7am", "8am", "9am", "10am", "11am"],
  datasets: [
    {
      data: [20, 35, 75, 40, 99],
    },
  ],
  legend: ["Breakfast"],
};

const lunchData = {
  labels: ["11am", "12pm", "1pm", "2pm", "3pm"],
  datasets: [
    {
      data: [50, 50, 80, 40, 99],
    },
  ],
  legend: ["Lunch"],
};

const customLunchData = (data: number[]) => {
  return {
    labels: ["11am", "12pm", "1pm", "2pm", "3pm"],
    datasets: [
      {
        data: data,
      },
    ],
    legend: ["Lunch"],
  };
};

const dinnerData = {
  labels: ["4pm", "5pm", "6pm", "7pm", "8pm"],
  datasets: [
    {
      data: [90, 80, 70, 60, 50],
    },
  ],
  legend: ["Dinner"],
};

const chartConfig = {
  backgroundGradientFrom: "#fff",
  backgroundGradientFromOpacity: 1,
  backgroundGradientTo: "#fff",
  backgroundGradientToOpacity: 1,
  color: () => `rgba(0, 0, 0, 1)`,
  strokeWidth: 0,
  barPercentage: 0.5,
  useShadowColorFromDataset: false,
  innerWidth: 300,
  innerHeight: 80,
  decimalPlaces: 0,
};

const { width, height } = Dimensions.get("window");

const showToast = (message: string) => {
  Alert.alert(message);
};

const sendLineData = async (diningHallName: string, lineLength: string) => {
  const user = JSON.parse(await AsyncStorage.getItem("userInfo"));

  try {
    const body = {
      email: user?.email,
      secretKey: user?.secretKey,
      diningHallName: diningHallName,
      lineLength: lineLength,
      timestamp: new Date().getTime(),
    };
    const response = await fetch(`${serverUrl}/api/v1/data/lines`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (response.status === 401) {
      showToast("Please login to save your line length");
      return;
    }
    const json = await response.json();
    const message = json.message;
    console.log("json.message", message);
    showToast(message);
  } catch (error) {
    console.error(error);
  }
};

export default function DiningHall({ route }: DiningHallProps) {
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<ScrollView | null>(null);
  const [value, setValue] = useState("Medium");
  const [bgImage, setBgImage] = useState("");

  const [currentDay, setCurrentDay] = useState(1);
  const [currentHour, setCurrentHour] = useState(7);
  const { name, line, data } = route.params;

  const getDiningHall = async () => {
    try {
      const response = await fetch(`${serverUrl}/api/v1/dining_halls/${name}`);

      const json = await response.json();
      const data = json.data;
      console.log(data);
      setBgImage(data.image);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const date = new Date();
    setCurrentDay(date.getDay());
    setCurrentHour(date.getHours());
  }, []);

  useEffect(() => {
    getDiningHall();
    return () => setLoading(true);
  }, [route.params]);

  return (
    <ParallaxScrollView
      contentBackgroundColor="#FFF"
      parallaxHeaderHeight={200}
      fadeOutForeground={false}
      renderForeground={() =>
        loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <Image
            style={{ width: width, height: 200, resizeMode: "cover" }}
            source={{
              uri: bgImage.length
                ? bgImage
                : "https://i.ibb.co/6bS28bP/grins.jpg",
            }}
          />
        )
      }
    >
      {loading ? (
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: height - 300,
          }}
        >
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <View style={styles.content}>
          <Text style={styles.title}>{name.replace(/_/g, " ")}</Text>

          <View style={styles.center}>
            <Text>
              Current Wait:{" "}
              {line === "l"
                ? "Approx 40 minutes"
                : line === "m"
                ? "Approx 20 minutes"
                : "Under 5 minutes"}{" "}
            </Text>
            <Text>Average Wait Times: {days[currentDay]}</Text>
          </View>
          <ScrollView
            ref={scrollRef}
            horizontal={true}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            decelerationRate={0}
            snapToInterval={320}
            snapToAlignment={"center"}
            contentInset={{
              left: 0,
              right: 0,
            }}
          >
            <View style={styles.center} onStartShouldSetResponder={() => true}>
              <Text>Breakfast</Text>
              <BarChart
                style={{
                  marginVertical: 0,
                  borderRadius: 16,
                  padding: 0,
                  marginRight: 10,
                }}
                data={breakfastData}
                width={width - 100}
                height={180}
                yAxisLabel=""
                yAxisSuffix=""
                chartConfig={chartConfig}
                verticalLabelRotation={0}
                withHorizontalLabels={true}
                withInnerLines={false}
                fromZero={true}
              />
            </View>
            <View style={styles.center} onStartShouldSetResponder={() => true}>
              <Text>Lunch</Text>
              <BarChart
                style={{
                  marginVertical: 0,
                  borderRadius: 16,
                }}
                data={data ? customLunchData(data) : lunchData}
                width={width - 100}
                height={180}
                yAxisLabel=""
                yAxisSuffix=""
                chartConfig={chartConfig}
                verticalLabelRotation={0}
                withHorizontalLabels={true}
                withInnerLines={false}
                fromZero={true}
              />
            </View>
            <View style={styles.center} onStartShouldSetResponder={() => true}>
              <Text>Dinner</Text>
              <BarChart
                style={{
                  marginVertical: 0,
                  borderRadius: 16,
                }}
                data={dinnerData}
                width={width - 100}
                height={180}
                yAxisLabel=""
                yAxisSuffix=""
                chartConfig={chartConfig}
                verticalLabelRotation={0}
                withHorizontalLabels={true}
                withInnerLines={false}
                fromZero={true}
              />
            </View>
          </ScrollView>
          <View style={styles.toggleButtonContainer}>
            <ButtonToggleGroup
              highlightBackgroundColor={"#E76666"}
              highlightTextColor={"white"}
              inactiveBackgroundColor={"transparent"}
              inactiveTextColor={"#000"}
              values={["Short", "Medium", "Long"]}
              value={value}
              onSelect={(val) => setValue(val)}
              style={{
                height: 40,
                width: 300,
              }}
            />
            <Text style={styles.subtitle}>
              Line not medium right now? Be sure to...
            </Text>
          </View>
          <Button
            onPress={() => {
              return sendLineData(name, value[0]);
            }}
            title={"Update"}
            color={"#E76666"}
          />
        </View>
      )}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#FFF",
  },
  content: {
    padding: 20,
    borderRadius: 25,
    backgroundColor: "#fff",
    top: -20,
  },
  title: {
    fontWeight: "700",
    fontSize: 36,
    marginBottom: 12,
  },
  center: {
    display: "flex",
    alignItems: "center",
    width: width - 60,
  },
  toggleButtonContainer: {
    width: width - 60,
    height: 60,
    padding: 0,
  },
  subtitle: {
    color: "#616265",
    fontSize: 10,
    alignSelf: "center",
    paddingTop: 3,
    paddingBottom: 3,
  },
});
