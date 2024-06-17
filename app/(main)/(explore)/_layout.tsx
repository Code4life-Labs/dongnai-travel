import { Stack } from "expo-router";
import React from "react";

// Import from components
import { FC } from "@/components";

export default function ExploreStack() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Explore",
        }}
      />
    </Stack>
  );
}
