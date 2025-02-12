import React from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";

// Import hooks
import { useTheme } from "@/hooks/useTheme";

// Import stlyes
import { styles } from "./styles";

// Import types
import type { ViewStyle } from "react-native";

type SkeletonProps = {
  width?: any;
  height?: any;
  style?: Array<ViewStyle> | ViewStyle;
};

export default function Skeleton({
  width = "100%",
  height = "100%",
  style,
}: SkeletonProps) {
  const { theme } = useTheme();

  const opacity = useSharedValue(1);

  // Pulse animation
  React.useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.5, { duration: 1000, easing: Easing.ease }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.skeleton,
        { width, height, backgroundColor: theme.outline },
        animatedStyle,
        style,
      ]}
    />
  );
}
