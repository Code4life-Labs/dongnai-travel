import { View, Text, ScrollView } from "react-native";
import React from "react";
import { 
  Ionicons, 
  Entypo, 
  AntDesign, 
  Feather, 
  Foundation
} from "@expo/vector-icons";
import { useRouter, router } from "expo-router";
import { useDispatch } from 'react-redux';

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
  // const { authDispatchers } = useAuth();

  // const handleSignOut = async () => {
  //   await signOut();
  //   router.replace('/auth/signin');
  // };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={{ paddingBottom: 130 }}>
        {/* Account Section */}
        <View style={[styles.setting_genre]}>
          <View style={[styles.genre_title_block]}>
            <FC.AppText weight="bolder" size="body1">
              {language.data.settingScreen.account[language.code]}
            </FC.AppText>
          </View>
          <View style={styles.genre_main}>
            <View style={styles.genre_content}>
              <FC.DropDown
                name={language.data.settingScreen.ac_profile[language.code]}
                icon={<Ionicons name="person-circle-outline" size={25} />}
                isDrop={false}
                handlePressButton={() => router.push("/settings/profile/[id]")}
              />
            </View>
          </View>
        </View>

        {/* Archive Section */}
        <View style={[styles.setting_genre, styles.pt_22]}>
          <View style={styles.genre_title_block}>
            <FC.AppText weight="bolder" size="body1">
              {language.data.settingScreen.archive[language.code]}
            </FC.AppText>
          </View>
          <View style={styles.genre_main}>
            <View style={[styles.genre_content, styles.flexDirection]}>
              <FC.RectangleButton
                type="none"
                isTransparent={false}
                style={[styles.option_setting, { backgroundColor: theme.subBackground }]}
                defaultColor="type_1"
                onPress={() => router.push("/settings/profile/[id]/saved-places")}
              >
                {(isActive, textStyle) => (
                  <View style={styles.rectangle_button_container}>
                    <Foundation
                      name="mountains"
                      // style={styles.avatar}
                      color={theme.onSubBackground}
                      size={35}
                    />
                    <FC.AppText style={[styles.option_setting_name, { color: theme.onSubBackground }]}>
                      {language.data.settingScreen.archive_place[language.code]}
                    </FC.AppText>
                  </View>
                )}
              </FC.RectangleButton>

              <FC.RectangleButton
                type="none"
                isTransparent={false}
                style={[styles.option_setting, { backgroundColor: theme.subBackground }]}
                defaultColor="type_1"
                onPress={() => router.push("/settings/profile/[id]/saved-blogs")}
              >
                {(isActive, textStyle) => (
                  <View style={styles.rectangle_button_container}>
                    <Entypo
                      name="text-document"
                      style={styles.avatar}
                      color={theme.onSubBackground}
                      size={35}
                    />
                    <FC.AppText style={[styles.option_setting_name, { color: theme.onSubBackground }]}>
                      {language.data.settingScreen.archive_blog[language.code]}
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
              {language.data.settingScreen.setting[language.code]}
            </FC.AppText>
          </View>

          {/* Dark Mode */}
          <View style={styles.genre_main}>
            <View style={styles.genre_content}>
              <FC.DropDown 
                icon={<Entypo name="light-up" size={25} />}
                isMode={true}
                name={language.data.settingScreen.setting_darkmode[language.code]}
                idOption='DARK_MODE'
              />
            </View>
          </View>

          {/* Notifications */}
          <View style={styles.genre_main}>
            <View style={styles.genre_content}>
              <FC.DropDown 
                icon={<Ionicons name="notifications-outline" size={25} />}
                name={language.data.settingScreen.setting_notification[language.code]}
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
                name={language.data.settingScreen.setting_report[language.code]}
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
                name={language.data.settingScreen.setting_about[language.code]}
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
                name={language.data.settingScreen.setting_help_support[language.code]}
                isDrop={false}
                handlePressButton={() => router.push("/settings/help-support")}
              />
            </View>
          </View>

          {/* Logout */}
          {/* <View style={styles.genre_main}>
            <View style={styles.genre_content}>
              <DropDown 
                icon={<Entypo name="log-out" size={25} />}
                name={language.data.settingScreen.logout[language.code]}
                isDrop={false}
                handlePressButton={handleSignOut}
              />
            </View>
          </View> */}
        </View>
      </View>
    </ScrollView>
  );
}