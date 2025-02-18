import type { AppState } from "../type";

const selectCurrentSetting = (state: AppState) => state.setting.currentSetting;

const selectNotificationSettings = (state: AppState) => state.setting.currentSetting.notification;

const selectDarkMode = (state: AppState) => state.setting.currentSetting.darkMode;

export const settingSelectors = {
  selectCurrentSetting,
  selectNotificationSettings,
  selectDarkMode
};