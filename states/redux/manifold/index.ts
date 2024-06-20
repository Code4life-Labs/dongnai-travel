import { createSlice } from "@reduxjs/toolkit";

export const manifoldSlice = createSlice({
  name: "manifold",
  initialState: {
    settings: {},
    status: {
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
    updateIsLoading(state, action) {
      state.status.isLoading = action.payload as boolean;
    },

    updateIsMaintaining(state, action) {
      state.status.isMaintaining = action.payload as boolean;
    },

    updateHasNetworkConnection(state, action) {
      state.status.hasNetworkConnection = action.payload as boolean;
    },
  },
});

export const manifoldActions = manifoldSlice.actions;
