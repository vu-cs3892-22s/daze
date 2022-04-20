import React from "react";
import { Modal, View, StyleSheet, Text } from "react-native";

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
          <Text>Medium Line: &lt;10 mins</Text>
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

export default function ModalPopup({ visible, children }) {
  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View style={styles.modalBackground}>
        <View style={[styles.modalContent]}>
          {children}
          <LineExplanation></LineExplanation>
        </View>
      </View>
    </Modal>
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
