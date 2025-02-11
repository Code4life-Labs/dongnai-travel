import { View } from "react-native";
import React from "react";

// Import components
import CircleButton from "../buttons/CircleButton";

// Import hooks
import { useTheme } from "@/hooks/useTheme";

// Import styles
import { Styles } from "@/styles";
import styles from "./styles";

const HorizontalBlogCardSkeleton = () => {
  const { theme } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.subBackground }]}>
      {/* Cột đâu tiên - Image Container */}
      <View
        style={{
          ...styles.card_image_container,
          ...Styles.spacings.me_12,
          backgroundColor: theme.subOutline,
        }}
      ></View>

      {/* Cột thứ 2 - Main Container */}
      <View style={styles.card_main_container}>
        <View style={styles.card_content_container}>
          <View
            style={{
              ...styles.card_skeleton_rectangle,
              ...Styles.spacings.mb_12,
              height: 7,
              backgroundColor: theme.subOutline,
            }}
          ></View>
          <View>
            <View
              style={{
                ...styles.card_skeleton_rectangle,
                height: 18,
                ...Styles.spacings.mb_6,
                backgroundColor: theme.subOutline,
              }}
            ></View>
            <View
              style={{
                ...styles.card_skeleton_rectangle,
                height: 18,
                ...Styles.spacings.mb_6,
                backgroundColor: theme.subOutline,
              }}
            ></View>
          </View>
          <View style={styles.card_information_container}>
            <View
              style={{
                ...styles.card_information_col,
                ...Styles.spacings.me_12,
              }}
            >
              <View
                style={{
                  ...styles.card_skeleton_rectangle,
                  height: 12,
                  ...Styles.spacings.mb_6,
                  backgroundColor: theme.subOutline,
                }}
              ></View>
            </View>
            <View style={styles.card_information_col}>
              <View
                style={{
                  ...styles.card_skeleton_rectangle,
                  height: 12,
                  ...Styles.spacings.mb_6,
                  backgroundColor: theme.subOutline,
                }}
              ></View>
            </View>
          </View>
        </View>
        <View style={styles.card_buttons_container}>
          <CircleButton
            style={[
              Styles.spacings.me_8,
              { backgroundColor: theme.subOutline },
            ]}
            disabled={true}
          />
          <CircleButton
            style={[
              Styles.spacings.me_8,
              { backgroundColor: theme.subOutline },
            ]}
            disabled={true}
          />
        </View>
      </View>

      {/* Cột thứ 3 - Share Container */}
      <View style={styles.card_share_container}></View>
    </View>
  );
};

export default HorizontalBlogCardSkeleton;
