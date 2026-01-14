import { View, ScrollView } from "react-native";
import React, { useCallback, useMemo } from "react";
import { 
  Ionicons, 
  Entypo, 
  AntDesign, 
  Feather, 
  Foundation
} from "@expo/vector-icons";
import { router } from "expo-router";

// Import components
import { FC } from "@/components";

// Import hooks and utils
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";

// Import styles
import { styles } from "@/screens/settings/styles";

export default function SettingsScreen() {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const { user, authDispatchers } = useAuth();

  const handleSignOut = useCallback(async () => {
    try {
      await authDispatchers.signOut();
      router.replace('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }, [authDispatchers]);

  const handleSignIn = useCallback(() => {
    router.replace('/');
  }, []);

  const handleProfilePress = useCallback(() => {
    if (user?._id) {
      router.push(`/settings/profile/${user._id}`);
    } else {
      router.replace('/');
    }
  }, [user?._id]);

  const handleSavedPlacesPress = useCallback(() => {
    if (user?._id) {
      router.push(`/settings/profile/${user._id}/saved-places`);
    } else {
      router.replace('/');
    }
  }, [user?._id]);

  const handleSavedBlogsPress = useCallback(() => {
    if (user?._id) {
      router.push(`/settings/profile/${user._id}/saved-blogs`);
    } else {
      router.replace('/');
    }
  }, [user?._id]);

  const settingLabels = useMemo(() => language.data.settingScreen, [language.data.settingScreen]);

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background }]}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 130 }}
    >
      {/* Account Section */}
      <View style={styles.setting_genre}>
        <View style={styles.genre_title_block}>
          <FC.AppText weight="bolder" size="body1">
            {settingLabels.account[language.code]}
          </FC.AppText>
        </View>
        <View style={styles.genre_main}>
          <View style={styles.genre_content}>
            <FC.DropDown
              name={settingLabels.ac_profile[language.code]}
              icon={<Ionicons name="person-circle-outline" size={25} />}
              isDrop={false}
              handlePressButton={handleProfilePress}
            />
          </View>
        </View>
      </View>

      {/* Archive Section */}
      <View style={[styles.setting_genre, styles.pt_22]}>
        <View style={styles.genre_title_block}>
          <FC.AppText weight="bolder" size="body1">
            {settingLabels.archive[language.code]}
          </FC.AppText>
        </View>
        <View style={styles.genre_main}>
          <View style={[styles.genre_content, styles.flexDirection]}>
            <FC.RectangleButton
              type="none"
              isTransparent={false}
              style={[styles.option_setting, { backgroundColor: theme.subBackground }]}
              defaultColor="type_1"
              onPress={handleSavedPlacesPress}
            >
              {(_isActive: boolean, _textStyle: any) => (
                <View style={styles.rectangle_button_container}>
                  <Foundation
                    name="mountains"
                    color={theme.onSubBackground}
                    size={35}
                  />
                  <FC.AppText style={[styles.option_setting_name, { color: theme.onSubBackground }]}>
                    {settingLabels.archive_place[language.code]}
                  </FC.AppText>
                </View>
              )}
            </FC.RectangleButton>

            <FC.RectangleButton
              type="none"
              isTransparent={false}
              style={[styles.option_setting, { backgroundColor: theme.subBackground }]}
              defaultColor="type_1"
              onPress={handleSavedBlogsPress}
            >
              {(_isActive: boolean, _textStyle: any) => (
                <View style={styles.rectangle_button_container}>
                  <Entypo
                    name="text-document"
                    style={styles.avatar}
                    color={theme.onSubBackground}
                    size={35}
                  />
                  <FC.AppText style={[styles.option_setting_name, { color: theme.onSubBackground }]}>
                    {settingLabels.archive_blog[language.code]}
                  </FC.AppText>
                </View>
              )}
            </FC.RectangleButton>
          </View>
        </View>
      </View>

      {/* Settings Section */}
      <View style={[styles.setting_genre, styles.pt_22]}>
        <View style={styles.genre_title_block}>
          <FC.AppText weight="bolder" size="body1">
            {settingLabels.setting[language.code]}
          </FC.AppText>
        </View>

        {/* Dark Mode */}
        <View style={styles.genre_main}>
          <View style={styles.genre_content}>
            <FC.DropDown 
              icon={<Entypo name="light-up" size={25} />}
              isMode={true}
              name={settingLabels.setting_darkmode[language.code]}
              idOption='DARK_MODE'
            />
          </View>
        </View>

        {/* Notifications */}
        <View style={styles.genre_main}>
          <View style={styles.genre_content}>
            <FC.DropDown 
              icon={<Ionicons name="notifications-outline" size={25} />}
              name={settingLabels.setting_notification[language.code]}
              isDrop={false}
              handlePressButton={() => router.push("/settings/notifications")}
              idOption='UPDATE_FROM_FOLLOWING'
            />
          </View>
        </View>

        {/* Reports */}
        <View style={styles.genre_main}>
          <View style={styles.genre_content}>
            <FC.DropDown 
              icon={<Feather name="alert-octagon" size={25} />}
              name={settingLabels.setting_report[language.code]}
              isDrop={false}
              handlePressButton={() => router.push("/settings/reports")}
            />
          </View>
        </View>

        {/* About */}
        <View style={styles.genre_main}>
          <View style={styles.genre_content}>
            <FC.DropDown 
              icon={<AntDesign name="exclamationcircleo" size={25} />}
              name={settingLabels.setting_about[language.code]}
              isDrop={false}
              handlePressButton={() => router.push("/settings/about")}
            />
          </View>
        </View>

        {/* Help & Support */}
        <View style={styles.genre_main}>
          <View style={styles.genre_content}>
            <FC.DropDown 
              icon={<Feather name="help-circle" size={25} />}
              name={settingLabels.setting_help_support[language.code]}
              isDrop={false}
              handlePressButton={() => router.push("/settings/help-support")}
            />
          </View>
        </View>

        {/* Login/Logout */}
        <View style={styles.genre_main}>
          <View style={styles.genre_content}>
            <FC.DropDown 
              icon={<Entypo name={user ? "log-out" : "login"} size={25} />}
              name={user 
                ? settingLabels.logout[language.code] 
                : settingLabels.login[language.code]}
              isDrop={false}
              handlePressButton={user ? handleSignOut : handleSignIn}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}