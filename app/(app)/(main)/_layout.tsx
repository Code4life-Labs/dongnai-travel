import React from "react";
import { SafeAreaView, View } from "react-native";
import { Tabs, Redirect, useSegments } from "expo-router";

// Import from components
import { FC } from "@/components";

// Import from hooks
import { useTheme } from "@/hooks/useTheme";
import { useStatusActions } from "@/hooks/useStatus";
import { useAuth } from "@/hooks/useAuth";
import { useSafeAreaConfig } from "@/hooks/useSafeArea";

// Import utils
import { StorageUtils } from "@/utils/storage";

export default function TabLayout() {
  const { theme } = useTheme();
  const statusDispatchers = useStatusActions();
  const segments = useSegments();
  const { useSafeArea } = useSafeAreaConfig();

  let hide = (segments as string[]).includes("blogs");

  React.useEffect(() => {
    if (
      ((segments as string[]).includes("create") && hide) ||
      ((segments as string[]).includes("prepare-to-publish") && hide)
    ) {
      statusDispatchers.setIsBottomTabShown(false);
    } else {
      statusDispatchers.setIsBottomTabShown(true);
    }
  }, [segments, segments.length]);

  // Kiểm tra xem có nên sử dụng SafeAreaView hay không
  const Container = useSafeArea ? SafeAreaView : View;

  return (
    <Container style={{ flex: 1, backgroundColor: theme.background }}>
      <Tabs
        tabBar={(props) => <FC.BottomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused }) => (
              <FC.TabBarIcon
                name={focused ? "home" : "home-outline"}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: "Explore",
          }}
        />
        <Tabs.Screen
          name="map"
          options={{
            title: "Map",
          }}
        />
        <Tabs.Screen
          name="blogs"
          options={{
            title: "Blogs",
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
          }}
        />
      </Tabs>
    </Container>
  );
}
