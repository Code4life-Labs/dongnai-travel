import { createSlice } from "@reduxjs/toolkit";

export const manifoldSlice = createSlice({
  name: "manifold",
  initialState: {
    current: {
      shownNotificationBottomSheet: false,
      contentNotificationBottomSheet: "",
      isLoading: false,
      privateKeys: null,
      hiddenStatusBar: false,
    },
  },

  reducers: {
    updateCurrentManifold(state, action) {
      const manifold = action.payload;
      state.current = manifold;
    },

    updateNotification(state, action) {
      state.current.shownNotificationBottomSheet =
        action.payload.shownNotificationBottomSheet;
      state.current.contentNotificationBottomSheet =
        action.payload.contentNotificationBottomSheet;
    },

    updateIsLoading(state, action) {
      state.current.isLoading = action.payload;
    },

    updatePrivateKeys(state, action) {
      state.current.privateKeys = action.payload;
    },

    updateStatusBar(state, action) {
      state.current.hiddenStatusBar = action.payload;
    },
  },
});

export const manifoldActions = manifoldSlice.actions;
