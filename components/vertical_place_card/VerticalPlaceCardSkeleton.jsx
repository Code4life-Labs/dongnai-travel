import { View } from "react-native";
import React from "react";

import styles from "./VerticalPlaceCardStyles";
import { ComponentUtils } from "@/utils/component";

import { useTheme } from "@/hooks/useTheme";

import Skeleton from "@/components/skeleton";
import { Styles } from "@/styles";

/**
 * @param {ViewProps} props Props của component. Chình là props của View.
 * @returns
 */
const VerticalPlaceCardSkeleton = (props) => {
  const containerStyle = ComponentUtils.mergeStyle(styles.card, props.style);
  //theme
  const { theme } = useTheme();

  return (
    <View
      {...props}
      style={[containerStyle, { backgroundColor: theme.background }]}
    >
      {/* // <View {...props} style={[containerStyle, {backgroundColor: theme.background}]}>  */}
      {/* Image */}
      <Skeleton
        style={[styles.card_image, { backgroundColor: theme.outline }]}
        height={100}
      />
      {/* Button & Recommended tag */}
      <Skeleton
        skeletonStyle={[
          styles.card_mid,
          styles.card_ske_bg,
          Styles.shapes.rounded_4,
        ]}
        style={{
          marginBottom: 3,
        }}
        height={15}
        width={"50%"}
      />
      {/* Content */}
      <View style={styles.card_content_container}>
        <Skeleton
          skeletonStyle={[styles.card_ske_bg, Styles.shapes.rounded_4]}
          backgroundColor={theme.outline}
          height={59}
          width={"100%"}
          marginBottom={3}
        />

        {/* Sub-information */}
        {/* <View style={styles.card_content_sub_information_container}> */}
        {/* <Skeleton
            skeletonStyle={[styles.card_ske_bg, Styles.shapes.rounded_4]}
            style={{
              marginTop: 3,
              marginBottom: 5,
            }}
            backgroundColor={theme.outline}
            height={15}
            width={"70%"}
          /> */}
        {/* <Skeleton
            skeletonStyle={[styles.card_ske_bg, Styles.shapes.rounded_4, {
              marginTop: 3,
            }]}
            style={{
              marginTop: 3,
              marginBottom: 5,
            }}
            backgroundColor={theme.outline}
            height={15}
            width={"100%"}
          /> */}
        {/* </View> */}
      </View>
      {/* Like button
      // <View style={[styles.card_buttons_container, { paddingTop: 3 }]}>
      //   <Skeleton
      //     skeletonStyle={[styles.card_ske_bg, Styles.shapes.rounded_4]}
      //     backgroundColor={theme.outline}
      //     height={30}
      //     flex={0.48}
      //   /> */}
      {/* <View style={{ flex: 0.04 }}></View>
        <Skeleton
          skeletonStyle={[styles.card_ske_bg, Styles.shapes.rounded_4]}
          // backgroundColor={theme.outline}
          backgroundColor=""
          height={30}
          flex={0.48}
        /> */}
      {/* </View> */}
    </View>
  );
};

export default VerticalPlaceCardSkeleton;
