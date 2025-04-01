import { createSlice } from "@reduxjs/toolkit";
import { settingThunks } from "./settingThunks";
import { StateManager } from "@/screens/settings/state";

// Lấy type từ state đã định nghĩa
type SettingState = {
  currentSetting: ReturnType<typeof StateManager.getInitialState>;
}

const initialState: SettingState = {
  currentSetting: StateManager.getInitialState()
};

export const settingSlice = createSlice({
  name: "setting",
  initialState,
  reducers: {
    updateNotification: (state, action) => {
      state.currentSetting.notification = action.payload;
    },
    updateDarkMode: (state, action) => {
      state.currentSetting.darkMode = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(settingThunks.fetchSettingAsync.fulfilled, (state, action) => {
      state.currentSetting = action.payload;
    });
  }
});

export const settingActions = settingSlice.actions;
export const settingReducer = settingSlice.reducer;