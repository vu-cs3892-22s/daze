import React, { useRef } from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import CardFlip from "react-native-card-flip";
import { BarChart } from "react-native-chart-kit";

const data = {
  labels: ["January", "February", "March", "April", "May", "June"],
  datasets: [
    {
      data: [20, 45, 28, 80, 99, 43],
    },
  ],
};
const chartConfig = {
  backgroundGradientFrom: "#1E2923",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "#08130D",
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: false, // optional
};

export default function Card() {
  let cardRef = useRef<CardFlip | null>(null);
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
        <Text>Grins</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.back}
        onPress={() => cardRef?.current?.flip()}
      >
        <BarChart
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
          data={data}
          width={200}
          height={220}
          yAxisLabel="$"
          chartConfig={chartConfig}
          verticalLabelRotation={30}
        />
      </TouchableOpacity>
    </CardFlip>
  );
}
const styles = StyleSheet.create({
  card: {
    backgroundColor: "pink",
    minWidth: "100%",
    minHeight: 50,
    borderRadius: 20,
    padding: 5,
    color: "#fff",
  },
  back: {
    backgroundColor: "green",
    minWidth: "100%",
    minHeight: 50,
    borderRadius: 20,
    padding: 5,
    color: "#fff",
  },
  cardContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "100%",
    minHeight: 200,
  },
});
