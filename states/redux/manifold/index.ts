import { createSlice } from "@reduxjs/toolkit";

export const manifoldSlice = createSlice({
  name: "manifold",
  initialState: {
    settings: {},
    status: {
      isBottomTabShown: true,
      isLoading: false,
      isMaintaining: false,
      hasNetworkConnection: false,
    },
    bottomSheet: {
      isShown: false,
      content: null,
    },
    statusBar: {
      isShown: false,
    },
  },

  reducers: {
    setIsLoading(state, action) {
      state.status.isLoading = Boolean(action.payload);
    },

    setIsMaintaining(state, action) {
      state.status.isMaintaining = Boolean(action.payload);
    },

    setIsBottomTabShown(state, action) {
      state.status.isBottomTabShown = Boolean(action.payload);
    },

    setHasNetworkConnection(state, action) {
      state.status.hasNetworkConnection = Boolean(action.payload);
    },

    setBottomSheetDisplayStatus(state, action) {
      state.bottomSheet.isShown = Boolean(action.payload);
    },

    setBottomSheetContent(state, action) {
      state.bottomSheet.content = action.payload;
    },

    setStatusBarDisplayStatus(state, action) {
      state.statusBar.isShown = Boolean(action.payload);
    },
  },
});

export const manifoldActions = manifoldSlice.actions;
