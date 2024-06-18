import { View, Text } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";

import { selectCurrentLanguage } from "../../redux/language/LanguageSlice";

import { AppHeader } from "components";
import SettingScreen from "screens/settings/SettingScreen";
import EditProfileScreen from "screens/edit_profile/EditProfileScreen";
import ProfileScreen from "screens/profile_screen/ProfileScreen";
import BlogsScreen from "screens/blogs/BlogsScreen";
import PlacesScreen from 'screens/places/PlacesScreen'
import Notifications from "screens/setting_notifications/SettingNotificationsScreen";
import NotificationsScreen from "screens/setting_notifications/SettingNotificationsScreen";
import AboutScreen from "screens/about/AboutScreen";
import HelpAndSupportScreen from "screens/help_and_support/HelpAndSupportScreen";
import ReportsScreen from "screens/reports/ReportsScreen";
import CreatePost from "screens/create_post/CreatePostScreen";
import BlogDetailScreen from "screens/blog_detail/BlogDetailScreen";
import ViewStatsScreen from "screens/view_stats/ViewStatsScreen";
import SavedBlogsScreen from "screens/saved_blogs/SavedBlogsScreen";
import SavedPlacesScreen from "screens/saved_places/SavedPlacesScreen";

const SettingStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

const SettingNavigator = () => {
  langCode = useSelector(selectCurrentLanguage).languageCode
  return (
    <SettingStack.Navigator
      initialRouteName="SettingScreen"
      screenOptions={{ header: AppHeader }}
    >
      <SettingStack.Screen
        name="Settings"
        options={{title: langCode === 'vi' ? "Cài đặt" : "Settings"}}
        component={SettingScreen}
      />

      <SettingStack.Screen
        name="Profile"
        options={{title: `${langCode === "vi" ? "Trang cá nhân" : "Profile" }`}}
        component={ProfileScreen}
      />

      <SettingStack.Screen
        name="Notifications"
        options={{ title: `${langCode === "vi" ? "Thông báo" : "Notifications"}` }}
        component={NotificationsScreen}
      />

      <SettingStack.Screen
        name="Reports"
        options={{title: `${langCode === "vi" ? "Báo cáo" : "Reports" }`}}
        component={ReportsScreen}
      />

      <SettingStack.Screen
        name="About"
        options={{title: `${langCode === "vi" ? "Giới thiệu" : "About" }`}}
        component={AboutScreen}
      />

      <SettingStack.Screen
        name="Help & Support"
        options={{title: `${langCode === "vi" ? "Hỗ trợ" : "Help & support" }`}}
        component={HelpAndSupportScreen}
      />

      <SettingStack.Screen
        name="SavedPlacesScreen"
        options={{title: `${langCode === "vi" ? "Địa điểm đã lưu" : "Saved places" }`}}
        component={SavedPlacesScreen}
      />

      <SettingStack.Screen
        name="SavedBlogsScreen"
        options={{title: `${langCode === "vi" ? "Bài viết đã lưu" : "Saved blogs" }`}}
        component={SavedBlogsScreen}
      />
      
      <ProfileStack.Screen
        name="EditProfileScreen"
        component={EditProfileScreen}
      />

      <ProfileStack.Screen 
        name="CreatePostScreen"
        options={{
          title: 'Create Post',
        }}
        component={CreatePost}
      />

      <ProfileStack.Screen 
        name="BlogDetailScreen"
        options={{
          title: `${langCode  === 'vi' ? 'Chi Tiết Bài Viết' : 'Blog Detail'}`,
        }}
        component={BlogDetailScreen}
      />

      <ProfileStack.Screen 
        name="ViewStatsScreen"
        options={{
          title:`${langCode  === 'vi' ? 'Thống Kê' : 'View Stats'}`,
        }}
        component={ViewStatsScreen}
      />
    </SettingStack.Navigator>
  );
};

export default SettingNavigator;