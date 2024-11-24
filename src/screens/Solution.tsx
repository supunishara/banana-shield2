import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { useRoute } from "@react-navigation/native";

const Solution = () => {
  const route = useRoute();
  const { data } = route.params;

  console.log("data-----", data);
  return (
    <View style={styles.container}>
      <Text>{data.disease}</Text>
      <Text>{data.solution}</Text>
    </View>
  );
};

export default Solution;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});
