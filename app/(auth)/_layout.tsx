import React from "react";
import { SafeAreaView } from "react-native";
import { Stack } from "expo-router";

// Import from hooks
import { useTheme } from "@/hooks/useTheme";

export default function AuthLayout() {
  console.log("Render AuthLayout");
  const { theme } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="sign-up" />
        <Stack.Screen name="reset-password" />
        <Stack.Screen name="forgot-password" />
        <Stack.Screen name="otp" />
      </Stack>
    </SafeAreaView>
  );
}
