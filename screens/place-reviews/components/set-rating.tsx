import { View, StyleSheet } from "react-native";
import React from "react";
import Ionicons from "react-native-vector-icons/Ionicons";

// Import types
import type { StyleProp, ViewStyle } from "react-native";

type StarsRatingProps = {
  rating: number;
  setRating(rating: number): void;
  style?: StyleProp<ViewStyle>;
};

export default function SetRating(props: StarsRatingProps) {
  // This array will contain our star tags. We will include this
  // array between the view tag.
  const stars = [];
  // Loop 5 times
  // eslint-disable-next-line no-plusplus
  for (let i = 1; i <= 5; i++) {
    // set the path to filled stars
    let name = "star";
    // If ratings is lower, set the path to unfilled stars
    if (i > props.rating) {
      name = "star-outline";
    }

    stars.push(
      <Ionicons
        name={name}
        size={24}
        style={styles.star}
        key={i}
        onPress={() => {
          props.setRating(i);
        }}
      />
    );
  }

  return <View style={[styles.container, props.style]}>{stars}</View>;
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  star: {
    color: "#F9BD06",
  },
});
