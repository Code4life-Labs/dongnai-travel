import React from "react";
import { SafeAreaView } from "react-native";
import { Stack } from "expo-router";

// Import components
import { FC } from "@/components";

// Import from hooks
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";

export default function SettingsLayout() {
  const { theme } = useTheme();
  const { language } = useLanguage();

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
            title: language.code === 'vi' ? "Cài đặt" : "Settings",
          }}
        />

        <Stack.Screen
          name="profile/[id]/index"
          options={{
            title: language.code === 'vi' ? "Trang cá nhân" : "Profile",
          }}
        />

        <Stack.Screen
          name="notifications"
          options={{
            title: language.code === 'vi' ? "Thông báo" : "Notifications",
          }}
        />

        <Stack.Screen
          name="reports"
          options={{
            title: language.code === 'vi' ? "Báo cáo" : "Reports",
          }}
        />

        <Stack.Screen
          name="about"
          options={{
            title: language.code === 'vi' ? "Giới thiệu" : "About",
          }}
        />

        <Stack.Screen
          name="help-support"
          options={{
            title: language.code === 'vi' ? "Hỗ trợ" : "Help & support",
          }}
        />

        <Stack.Screen
          name="profile/[id]/saved-places"
          options={{
            title: language.code === 'vi' ? "Địa điểm đã lưu" : "Saved places",
          }}
        />

        <Stack.Screen
          name="profile/[id]/saved-blogs"
          options={{
            title: language.code === 'vi' ? "Bài viết đã lưu" : "Saved blogs",
          }}
        />

        <Stack.Screen
          name="profile/[id]/edit-profile"
          options={{
            title: language.code === 'vi' ? "Chỉnh sửa hồ sơ" : "Edit Profile",
          }}
        />

        <Stack.Screen
          name="profile/[id]/create-post"
          options={{
            title: language.code === 'vi' ? "Tạo bài viết" : "Create Post",
          }}
        />

        <Stack.Screen
          name="view-stats"
          options={{
            title: language.code === 'vi' ? "Thống Kê" : "View Stats",
          }}
        />

        <Stack.Screen
          name="profile/[id]/create-blog"
          options={{
            title: language.code === 'vi' ? "Tạo bài viết" : "Create Blog",
            headerShown: false,
          }}
        />
      </Stack>
    </SafeAreaView>
  );
}