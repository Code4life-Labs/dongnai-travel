import React from "react";
import { SafeAreaView } from "react-native";
import { Stack } from "expo-router";

// Import from hooks
import { useTheme } from "@/hooks/useTheme";
import { FC } from "@/components";

export default function HomeLayout() {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <Stack
        screenOptions={{
          header: (props) => <FC.AppHeader {...props} />,
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: "Home",
          }}
        />
        <Stack.Screen
          name="weather"
          options={{
            title: "Weather",
          }}
        />
      </Stack>
    </SafeAreaView>
  );
}
