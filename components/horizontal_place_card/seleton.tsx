import { View, Text } from "react-native";
import React from "react";

// Import from components
import { CircleButton } from "../buttons";

// Import from hooks
import { useTheme } from "@/hooks/useTheme";

// Import from styles
import { Styles } from "@/styles";

// Import from local
// Import styles
import { styles } from "./styles";

const HorizontalPlaceCardSkeleton = () => {
  console.log("Horizontal Card Skeleton Render");
  //theme
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.subBackground, ...Styles.boxShadows.type_1 },
      ]}
    >
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
              ...styles.car_skeleton_rectangle,
              ...Styles.spacings.mb_12,
              backgroundColor: theme.subOutline,
              height: 7,
            }}
          ></View>
          <View>
            <View
              style={{
                ...styles.car_skeleton_rectangle,
                height: 18,
                ...Styles.spacings.mb_6,
                backgroundColor: theme.subOutline,
              }}
            ></View>
            <View
              style={{
                ...styles.car_skeleton_rectangle,
                height: 12,
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
                  ...styles.car_skeleton_rectangle,
                  height: 12,
                  ...Styles.spacings.mb_6,
                  backgroundColor: theme.subOutline,
                }}
              ></View>
              <View
                style={{
                  ...styles.car_skeleton_rectangle,
                  height: 12,
                  ...Styles.spacings.mb_6,
                  backgroundColor: theme.subOutline,
                }}
              ></View>
            </View>
            <View style={styles.card_information_col}>
              <View
                style={{
                  ...styles.car_skeleton_rectangle,
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
            type="highlight"
          />
          <CircleButton
            style={[
              Styles.spacings.me_8,
              { backgroundColor: theme.subOutline },
            ]}
            type="highlight"
          />
        </View>
      </View>

      {/* Cột thứ 3 - Share Container */}
      <View style={styles.card_share_container}></View>
    </View>
  );
};

export default HorizontalPlaceCardSkeleton;
