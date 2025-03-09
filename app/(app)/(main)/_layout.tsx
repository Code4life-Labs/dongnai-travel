import React from "react";
import { SafeAreaView } from "react-native";
import { Tabs, Redirect, useSegments } from "expo-router";

// Import from components
import { FC } from "@/components";

// Import from hooks
import { useTheme } from "@/hooks/useTheme";
import { useStatusActions } from "@/hooks/useStatus";
import { useAuth } from "@/hooks/useAuth";

// Import utils
import { StorageUtils } from "@/utils/storage";

export default function TabLayout() {
  const { theme } = useTheme();
  const statusDispatchers = useStatusActions();
  const segments = useSegments();

  React.useEffect(() => {
    let hide = true;
    let isBlogsScreen = hide && (segments as string[]).includes("blogs");
    let isPlacesScreen = hide && (segments as string[]).includes("places");

    let isCreateBlogScreen =
      isBlogsScreen && (segments as string[]).includes("create");
    if (isCreateBlogScreen) {
      statusDispatchers.setIsBottomTabShown(false);
      return;
    }

    let isPrepareToPublishBlogScreen =
      isBlogsScreen && (segments as string[]).includes("prepare-to-publish");
    if (isPrepareToPublishBlogScreen) {
      statusDispatchers.setIsBottomTabShown(false);
      return;
    }

    let isBlogCommentsScreen =
      isBlogsScreen && (segments as string[]).includes("comments");
    if (isBlogCommentsScreen) {
      statusDispatchers.setIsBottomTabShown(false);
      return;
    }

    let isPlaceDetailScreen =
      isPlacesScreen &&
      (segments as string[]).includes("[id]") &&
      (segments as string[]).includes("places");
    console.log("TabBarBottom Visibility:", isPlaceDetailScreen);
    if (isPlaceDetailScreen) {
      statusDispatchers.setIsBottomTabShown(false);
      return;
    }

    statusDispatchers.setIsBottomTabShown(true);
  }, [segments, segments.length]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
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
    </SafeAreaView>
  );
}
