import { View, Text } from "react-native";
import React from "react";

// Import from components
import Skeleton from "../skeleton";

// Import from hooks
import { useTheme } from "@/hooks/useTheme";

// Import from styles
import { Styles } from "@/styles";

// Import from local
// Import styles
import { styles } from "./styles";

export default function HorizontalPlaceCardSkeleton() {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.subBackground, ...Styles.boxShadows.type_1 },
      ]}
    >
      {/* Column 1 - Image Container */}
      <Skeleton
        style={{
          ...styles.card_image_container,
          ...Styles.spacings.me_12,
          backgroundColor: theme.subOutline,
        }}
      />

      {/* Column 2 - Main Content */}
      <View style={styles.card_main_container}>
        <View style={styles.card_content_container}>
          <Skeleton
            style={{
              ...styles.card_skeleton_rectangle,
              ...Styles.spacings.mb_12,
              backgroundColor: theme.subOutline,
              height: 7,
            }}
          />
          <View>
            <Skeleton
              style={{
                ...styles.card_skeleton_rectangle,
                height: 18,
                ...Styles.spacings.mb_6,
                backgroundColor: theme.subOutline,
              }}
            />
            <Skeleton
              style={{
                ...styles.card_skeleton_rectangle,
                height: 12,
                ...Styles.spacings.mb_6,
                backgroundColor: theme.subOutline,
              }}
            />
          </View>
          <View style={styles.card_information_container}>
            <View
              style={{
                ...styles.card_information_col,
                ...Styles.spacings.me_12,
              }}
            >
              <Skeleton
                style={{
                  ...styles.card_skeleton_rectangle,
                  height: 12,
                  ...Styles.spacings.mb_6,
                  backgroundColor: theme.subOutline,
                }}
              />
              <Skeleton
                style={{
                  ...styles.card_skeleton_rectangle,
                  height: 12,
                  ...Styles.spacings.mb_6,
                  backgroundColor: theme.subOutline,
                }}
              />
            </View>
            <View style={styles.card_information_col}>
              <Skeleton
                style={{
                  ...styles.card_skeleton_rectangle,
                  height: 12,
                  ...Styles.spacings.mb_6,
                  backgroundColor: theme.subOutline,
                }}
              />
            </View>
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.card_buttons_container}>
          <Skeleton
            style={[
              Styles.spacings.me_8,
              {
                backgroundColor: theme.subOutline,
                width: 30,
                height: 30,
                borderRadius: 20,
              },
            ]}
          />
          <Skeleton
            style={[
              Styles.spacings.me_8,
              {
                backgroundColor: theme.subOutline,
                width: 30,
                height: 30,
                borderRadius: 20,
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
}
