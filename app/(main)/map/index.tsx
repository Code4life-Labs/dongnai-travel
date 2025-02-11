import React from "react";
import { View } from "react-native";

// Import from components
import { FC } from "@/components";

// Import from hooks
import { useTheme } from "@/hooks/useTheme";

export default function MapScreen() {
  const { theme } = useTheme();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.background,
      }}
    >
      <FC.AppText>Map Screen</FC.AppText>
    </View>
  );
}
