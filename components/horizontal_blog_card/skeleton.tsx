import { View } from "react-native";
import React from "react";

// Import components
import Skeleton from "../skeleton";

// Import hooks
import { useTheme } from "@/hooks/useTheme";

// Import styles
import { Styles } from "@/styles";
import styles from "./styles";

const HorizontalBlogCardSkeleton = () => {
  const { theme } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.subBackground }]}>
      {/* First Column - Image Container */}
      <View
        style={{
          ...styles.card_image_container,
          ...Styles.spacings.me_12,
        }}
      >
        <Skeleton
          width="100%"
          height="100%"
          style={{ backgroundColor: theme.subOutline }}
        />
      </View>

      {/* Second Column - Main Container */}
      <View style={styles.card_main_container}>
        <View style={styles.card_content_container}>
          {/* Skeleton for the first line */}
          <Skeleton
            width="100%"
            height={7}
            style={{
              ...Styles.spacings.mb_12,
              backgroundColor: theme.subOutline,
            }}
          />

          {/* Skeleton for the title */}
          <View>
            <Skeleton
              width="100%"
              height={18}
              style={{
                ...Styles.spacings.mb_6,
                backgroundColor: theme.subOutline,
              }}
            />
            <Skeleton
              width="100%"
              height={18}
              style={{
                ...Styles.spacings.mb_6,
                backgroundColor: theme.subOutline,
              }}
            />
          </View>

          {/* Skeleton for the information row */}
          <View style={styles.card_information_container}>
            <View
              style={{
                ...styles.card_information_col,
                ...Styles.spacings.me_12,
              }}
            >
              <Skeleton
                width="100%"
                height={12}
                style={{
                  ...Styles.spacings.mb_6,
                  backgroundColor: theme.subOutline,
                }}
              />
            </View>
            <View style={styles.card_information_col}>
              <Skeleton
                width="100%"
                height={12}
                style={{
                  ...Styles.spacings.mb_6,
                  backgroundColor: theme.subOutline,
                }}
              />
            </View>
          </View>
        </View>

        {/* Skeleton for the buttons */}
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

      {/* Third Column - Share Container */}
      <View style={styles.card_share_container}></View>
    </View>
  );
};

export default HorizontalBlogCardSkeleton;
