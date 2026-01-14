import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { settingThunks } from "./settingThunks";
import { StateManager } from "@/screens/settings/state";

type NotificationSettings = {
  updateFromFollowing: boolean;
  comments: boolean;
  events: boolean;
};

type SettingState = {
  currentSetting: ReturnType<typeof StateManager.getInitialState>;
  isLoading: boolean;
  error: string | null;
}

const initialState: SettingState = {
  currentSetting: StateManager.getInitialState(),
  isLoading: false,
  error: null
};

export const settingSlice = createSlice({
  name: "setting",
  initialState,
  reducers: {
    updateNotification: (state, action: PayloadAction<NotificationSettings>) => {
      state.currentSetting.notification = action.payload;
    },
    updateDarkMode: (state, action: PayloadAction<boolean>) => {
      state.currentSetting.darkMode = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(settingThunks.fetchSettingAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(settingThunks.fetchSettingAsync.fulfilled, (state, action) => {
        state.currentSetting = action.payload;
        state.isLoading = false;
      })
      .addCase(settingThunks.fetchSettingAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(settingThunks.updateSettingAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(settingThunks.updateSettingAsync.fulfilled, (state, action) => {
        state.currentSetting = action.payload;
        state.isLoading = false;
      })
      .addCase(settingThunks.updateSettingAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const settingActions = settingSlice.actions;
export const settingReducer = settingSlice.reducer;