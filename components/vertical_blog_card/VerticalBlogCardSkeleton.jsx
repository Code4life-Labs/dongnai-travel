import { View } from "react-native";
import React from "react";

import styles from "./VerticalBlogCardStyles";

// import { ViewProps } from 'types/index.d'

import { Styles } from "@/styles";
import { FC } from "..";
import { useTheme } from "@/hooks/useTheme";

/**
 * @param {ViewProps} props Props của component. Chình là props của View.
 * @returns
 */
const VerticalBlogCardSkeleton = ({ ...props }) => {
  // const containerStyle = ComponentUtility.mergeStyle(styles.card, props.style);

  const theme = useTheme();
  return (
    <View
      {...props}
      style={[styles.card, props.style, { backgroundColor: theme.background }]}
    >
      {/* Image */}
      <FC.Skeleton skeletonStyle={styles.card_image} />
      {/* Button & Recommended tag */}
      <FC.Skeleton
        skeletonStyle={[
          styles.card_mid,
          styles.card_ske_bg,
          Styles.shapes.rounded_4,
          {
            height: 12,
            width: "50%",
            backgroundColor: theme.primary,
            marginBottom: 5,
          },
        ]}
      />

      {/* Content */}
      <View style={styles.card_content_container}>
        <FC.Skeleton
          skeletonStyle={[
            styles.card_ske_bg,
            Styles.spacings.mb_6,
            Styles.shapes.rounded_4,
            { height: 38, width: "100%", backgroundColor: theme.primary },
          ]}
        />

        {/* Sub-information */}
        <View style={styles.card_content_sub_information_container}>
          <FC.Skeleton
            skeletonStyle={[
              styles.card_ske_bg,
              Styles.shapes.rounded_4,
              { height: 14.5, flex: 0.48, backgroundColor: theme.primary },
            ]}
          />
          <View style={{ flex: 0.04 }}></View>
          <FC.Skeleton
            skeletonStyle={[
              styles.card_ske_bg,
              Styles.shapes.rounded_4,
              { height: 14.5, flex: 0.48, backgroundColor: theme.primary },
            ]}
          />
        </View>
      </View>

      {/* Like button */}
      <View
        style={[styles.card_buttons_container, { paddingTop: 3, marginTop: 3 }]}
      >
        <FC.Skeleton
          skeletonStyle={[
            styles.card_ske_bg,
            Styles.shapes.rounded_4,
            { height: 30, flex: 0.48, backgroundColor: theme.primary },
          ]}
        />
        <View style={{ flex: 0.04 }}></View>
        <FC.Skeleton
          skeletonStyle={[
            styles.card_ske_bg,
            Styles.shapes.rounded_4,
            { height: 30, flex: 0.48, backgroundColor: theme.primary },
          ]}
        />
      </View>
    </View>
  );
};

export default VerticalBlogCardSkeleton;
