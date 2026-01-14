import type { AppState } from "../type";

const selectCurrentSetting = (state: AppState) => state.setting.currentSetting;

const selectNotificationSettings = (state: AppState) => state.setting.currentSetting.notification;

const selectDarkMode = (state: AppState) => state.setting.currentSetting.darkMode;

const selectSettingLoading = (state: AppState) => state.setting.isLoading;

const selectSettingError = (state: AppState) => state.setting.error;

export const settingSelectors = {
  selectCurrentSetting,
  selectNotificationSettings,
  selectDarkMode,
  selectSettingLoading,
  selectSettingError
};