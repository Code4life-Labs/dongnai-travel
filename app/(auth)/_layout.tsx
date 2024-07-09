import React from "react";
import { View, Text } from "react-native";
import { Stack } from "expo-router";

export default function AuthLayout() {
  console.log("Render AuthLayout");

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
