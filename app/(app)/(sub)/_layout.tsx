import { Stack } from "expo-router";
import React from "react";

export default function SubLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        presentation: "modal",
        animation: "slide_from_right",
        contentStyle: {
          backgroundColor: '#fff',
        },
      }}
    />
  );
} 