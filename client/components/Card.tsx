import React, { useRef, useState } from "react";
import {
  Button,
  Image,
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { AspectRatio, Box, Center } from "native-base";
import CardFlip from "react-native-card-flip";
import { BarChart } from "react-native-chart-kit";
import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import ButtonToggleGroup from "react-native-button-toggle-group";
import Toast from "react-native-toast-message";

const { width } = Dimensions.get("window");

const locations = [
  "2301 Allergen Free",
  "Grins",
  "EBI",
  "Kissam Kitchen",
  "McTyeire",
  "Commons",
  "Rand",
  "Zeppos",
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

const getBackgroundColor = (line: string) => {
  switch (line) {
    case "s":
      return "#B0DF63";
    case "m":
      return "#FFFA76";
    case "l":
      return "#FF9B70";
    default:
      return "#E76666";
  }
};

interface CardProps {
  name: string;
  idx: number;
  line: string;
  img?: string;
  data?: number[];
  isOpen?: boolean;
}

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function Card(props: CardProps) {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  const cardRef = useRef<CardFlip | null>(null);
  const scrollRef = useRef<ScrollView | null>(null);

  const [currentDay, setCurrentDay] = useState(1);
  const [currentHour, setCurrentHour] = useState(7);

  const showToast = (message: string) => {
    Toast.show({
      type: "success",
      text1: message,
    });
  };
  const sendLineData = async (diningHallName: string, lineLength: string) => {
    try {
      const timestamp = new Date().getTime();
      const sampleBody = {
        vanderbiltEmail: "chuka@vanderbilt.edu",
        diningHallName: diningHallName,
        lineLength: lineLength,
        timestamp: timestamp,
      };

      const response = await fetch(
        "https://cf93-129-59-122-20.ngrok.io/api/v1/data/lines",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(sampleBody),
        }
      );
      const json = await response.json();
      const message = json.message;
      showToast(message);
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
    scrollRef?.current?.scrollTo({
      x: currentHour > 11 ? (currentHour > 15 ? 640 : 320) : 0,
      y: 0,
      animated: true,
    });
  }, [scrollRef, currentHour]);

  const [value, setValue] = useState("Medium");

  return (
    <CardFlip
      style={props.isOpen ? styles.cardContainer : styles.opacityCardContainer}
      ref={cardRef}
      flipDirection="y"
      duration={300}
    >
      <TouchableOpacity
        style={styles.frontCard}
        onPress={() => cardRef?.current?.flip()}
      >
        <Box
          borderRadius={20}
          minWidth={"100%"}
          maxWidth={"100%"}
          minHeight={340}
          bg={getBackgroundColor(props.line)}
          margin={0}
          marginBottom={0}
          flexDirection={"column"}
          overflow="hidden"
        >
          <Box>
            <AspectRatio w="100%" ratio={14 / 9}>
              {props.img ? (
                <Image
                  style={styles.stretch}
                  source={{
                    uri: props.img,
                  }}
                />
              ) : (
                <View />
              )}
            </AspectRatio>
          </Box>
          <View style={{ padding: 10, margin: 5 }}>
            <Text style={styles.cardNameText}>
              {props.name} {!props.isOpen && "- Closed"}
            </Text>
          </View>
        </Box>
      </TouchableOpacity>

      <TouchableWithoutFeedback onPress={() => cardRef?.current?.flip()}>
        <View style={styles.backCard}>
          <Text>
            Current Wait:{" "}
            {props.line === "l"
              ? "Approx 40 minutes"
              : props.line === "m"
              ? "Approx 20 minutes"
              : "Under 5 minutes"}{" "}
          </Text>
          <Text>Average Wait Times: {days[currentDay]}</Text>
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
                data={props.data ? customLunchData(props.data) : lunchData}
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
              return sendLineData(locations[props.idx], value[0]);
            }}
            title={"Update"}
            color={"#E76666"}
          />
        </View>
      </TouchableWithoutFeedback>
    </CardFlip>
  );
}
const styles = StyleSheet.create({
  cardContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "100%",
    minHeight: 340,
  },
  opacityCardContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "100%",
    minHeight: 300,
    opacity: 0.8,
  },
  frontCard: {
    backgroundColor: "#FFF",
    minWidth: "100%",
    width: width - 80,
    minHeight: 50,
    height: 340,
    borderRadius: 20,
    padding: 0,
    color: "#fff",
  },
  backCard: {
    backgroundColor: "#FFF",
    minWidth: "100%",
    width: width - 80,
    minHeight: 50,
    height: 340,
    borderRadius: 20,
    padding: 5,
    color: "#fff",
    display: "flex",
    alignItems: "center",
    shadowColor: "#171717",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
  },
  cardNameText: {
    fontSize: 25,
    color: "#616265",
    lineHeight: 30,
  },
  center: {
    display: "flex",
    alignItems: "center",
    width: width - 60,
  },
  stretch: {
    resizeMode: "stretch",
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
