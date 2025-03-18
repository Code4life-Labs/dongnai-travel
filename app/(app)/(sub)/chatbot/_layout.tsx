import { Stack } from "expo-router";
import React from "react";

export default function ChatBotLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        // Đảm bảo modal hiển thị đè lên và ẩn bottom tab bar
        presentation: "modal",
        // Ẩn bottom tab bar khi màn hình này hiển thị
        animation: "slide_from_right",
      }}
    />
  );
} 