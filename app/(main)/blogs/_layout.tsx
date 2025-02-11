import React from "react";
import { SafeAreaView } from "react-native";
import { Stack } from "expo-router";

// Import from hooks
import { useTheme } from "@/hooks/useTheme";

export default function BlogsLayout() {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
      </Stack>
    </SafeAreaView>
  );
}
