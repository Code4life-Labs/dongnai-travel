import React from "react";
import { SafeAreaView } from "react-native";
import { Stack } from "expo-router";

// Import components
import { FC } from "@/components";

// Import from hooks
import { useTheme } from "@/hooks/useTheme";

export default function BlogsLayout() {
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
            title: "Blogs",
          }}
        />

        <Stack.Screen
          name="[id]/index"
          options={{
            title: "Blogs",
          }}
        />

        <Stack.Screen
          name="[id]/comments"
          options={{
            title: "Blog Comments",
          }}
        />

        <Stack.Screen
          name="create"
          options={{
            title: "Blog Editor",
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="prepare-to-publish"
          options={{
            title: "Prepare to publish",
          }}
        />
      </Stack>
    </SafeAreaView>
  );
}
