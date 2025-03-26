import { View } from "react-native";
import React from "react";

import styles from "./styles";

// import { ViewProps } from 'types/index.d'

import { Styles } from "@/styles";
import { FC } from "..";
import { useTheme } from "@/hooks/useTheme";
import { ComponentUtils } from "@/utils/component";

/**
 * @param {ViewProps} props Props của component. Chình là props của View.
 * @returns
 */
const VerticalBlogCardSkeleton = ({ ...props }) => {
  const containerStyle = ComponentUtils.mergeStyle(styles.card, props.style);

  const theme = useTheme();
  return (
    <View
      {...props}
      style={[containerStyle, { backgroundColor: theme.theme.onSecondary }]}
    >
      {/* Image */}
      <FC.Skeleton
        height={100}
        style={[styles.card_image, { backgroundColor: theme.theme.outline }]}
      />
      {/* Button & Recommended tag */}
      <FC.Skeleton
        style={[
          styles.card_mid,
          styles.card_ske_bg,
          Styles.shapes.rounded_4,
          {
            height: 12,
            width: "50%",
            backgroundColor: theme.theme.outline,
            marginBottom: 5,
          },
        ]}
      />
      {/* Content */}
      <View style={styles.card_content_container}>
        <FC.Skeleton
          style={[
            styles.card_ske_bg,
            Styles.spacings.mb_6,
            Styles.shapes.rounded_4,
            { height: 38, width: "100%", backgroundColor: theme.theme.outline },
          ]}
        />
      </View>
    </View>
  );
};

export default VerticalBlogCardSkeleton;
