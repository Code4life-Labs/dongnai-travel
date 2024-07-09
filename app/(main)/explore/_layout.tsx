import { Stack } from "expo-router";
import React from "react";

// Import from components
import { FC } from "@/components";

// Import local

export default function ExploreStack() {
  return (
    <Stack
      screenOptions={{
        header: (props) => <FC.AppHeader {...props} />,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Explore",
        }}
      />
      <Stack.Screen
        name="details"
        options={{
          title: "Place",
        }}
      />
    </Stack>
  );
}
