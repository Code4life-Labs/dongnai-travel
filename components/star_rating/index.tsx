import { View, Text } from "react-native";
import React from "react";
import Ionicons from "react-native-vector-icons/Ionicons";

// Import styles
import { styles } from "./styles";

export default function StarRating({
  ratings,
  reviews = null,
  containerStyle,
  textRatingStyle,
  textReviewStyle,
  isHaveRatingText = true,
}: any) {
  // This array will contain our star tags. We will include this
  // array between the view tag.
  const stars = [];
  // Loop 5 times
  // eslint-disable-next-line no-plusplus
  for (let i = 1; i <= 5; i++) {
    // set the path to filled stars
    let name = "ios-star";
    // If ratings is lower, set the path to unfilled stars
    if (i > ratings) {
      name = "ios-star-outline";
    }

    stars.push(<Ionicons name={name} size={15} style={styles.star} key={i} />);
  }

  return (
    <View style={[styles.container, containerStyle]}>
      {isHaveRatingText ? (
        <Text style={[styles.textRatings, textRatingStyle]}>{ratings}</Text>
      ) : null}
      {stars}
      {reviews ? (
        <Text style={[styles.textReviews, textReviewStyle]}>({reviews})</Text>
      ) : null}
    </View>
  );
}
