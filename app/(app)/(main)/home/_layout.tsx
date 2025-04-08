import React from "react";
import { SafeAreaView } from "react-native";
import { Stack, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// Import from hooks
import { useTheme } from "@/hooks/useTheme";
import { FC } from "@/components";

export default function HomeLayout() {
  const { theme } = useTheme();

  // Custom left part function to add the robot icon
  const renderLeftPart = () => {
    return (
      <FC.CircleButton
        defaultColor="type_5"
        boxShadowType="type_1"
        type="opacity"
        onPress={() => router.push("/chatbot")}
        setIcon={(isActive, currentLabelStyle) => (
          <Ionicons
            name="chatbox-ellipses-outline"
            size={18}
            style={currentLabelStyle}
          />
        )}
      />
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <Stack
        screenOptions={{
          header: (props) => <FC.AppHeader {...props} setLeftPart={renderLeftPart} />,
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
