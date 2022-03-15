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
import { AspectRatio, Box } from "native-base";
import CardFlip from "react-native-card-flip";
import { BarChart } from "react-native-chart-kit";
import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

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

const getBackgroundColor = (line: String) => {
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
  name: String;
  line: String;
  img?: string;
  data?: number[];
  navigation?: any;
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
  const navigation = useNavigation();
  const cardRef = useRef<CardFlip | null>(null);
  const scrollRef = useRef<ScrollView | null>(null);
  const [currentDay, setCurrentDay] = useState(1);
  const [currentHour, setCurrentHour] = useState(7);

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

  return (
    <CardFlip
      style={styles.cardContainer}
      ref={cardRef}
      flipDirection="y"
      duration={300}
    >
      <TouchableOpacity
        style={styles.card}
        onPress={() => cardRef?.current?.flip()}
      >
        <Box
          borderRadius={20}
          minWidth={"100%"}
          maxWidth={"100%"}
          bg={getBackgroundColor(props.line)}
          margin={0}
          marginBottom={0}
          flexDirection={"column"}
          overflow="hidden"
        >
          <Box>
            <AspectRatio w="100%" ratio={16 / 9}>
              <Image
                style={styles.logo}
                source={{
                  uri:
                    props.img ||
                    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg==",
                }}
              />
            </AspectRatio>
          </Box>
          <View style={{ padding: 10, margin: 5 }}>
            <Text style={styles.cardNameText}>{props.name}</Text>
          </View>
        </Box>
      </TouchableOpacity>
      <TouchableWithoutFeedback onPress={() => cardRef?.current?.flip()}>
        <View style={styles.back}>
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
            initialNumToRender={2}
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
                chartConfig={chartConfig}
                verticalLabelRotation={0}
                withHorizontalLabels={true}
                withInnerLines={false}
                fromZero={true}
              />
            </View>
          </ScrollView>
          <Button
            onPress={() => navigation.navigate("Update", { locationIndex: 4 })}
            title={"Update"}
            color={"#E76666"}
            accessibilityLabel="Learn more about this purple button"
          />
        </View>
      </TouchableWithoutFeedback>
    </CardFlip>
  );
}
const styles = StyleSheet.create({
  card: {
    backgroundColor: "pink",
    minWidth: "100%",
    minHeight: 50,
    height: 200,
    borderRadius: 20,
    padding: 0,
    color: "#fff",
  },
  innerCard: {
    overflow: "hidden",
  },
  cardNameText: {
    fontSize: 25,
    color: "#616265",
    lineHeight: 30,
  },
  back: {
    backgroundColor: "#FFF",
    minWidth: "100%",
    width: width - 80,
    minHeight: 50,
    height: 280,
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
  center: {
    display: "flex",
    alignItems: "center",
    width: width - 60,
  },
  cardContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "100%",
    minHeight: 300,
  },
  logo: {
    resizeMode: "stretch",
  },
});
