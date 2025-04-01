import React from "react";
import { View, Text, Pressable, Platform } from "react-native";
import AnimatedCheckbox from "react-native-checkbox-reanimated";

// Import components
import AppText from "../app_text";

// Import hooks
import { useTheme } from "@/hooks/useTheme";

// Import styles
import { styles } from "./styles";

// Import types
import type { CheckBoxTextProps } from "./type";

export default function CheckBoxText({
  label,
  onPress,
  isChecked = false,
}: CheckBoxTextProps) {
  const { theme } = useTheme();

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={styles.checkbox}>
        <AnimatedCheckbox
          checked={isChecked}
          highlightColor={isChecked ? theme.onBackground : theme.background}
          checkmarkColor={
            Platform.OS === "ios" ? theme.background : "transparent"
          }
          boxOutlineColor={isChecked ? theme.outline : "#808080"}
        />
      </View>
      <AppText
        style={[
          {
            color: isChecked ? theme.onBackground : theme.outline,
          },
        ]}
      >
        {label}
      </AppText>
    </Pressable>
  );
}
