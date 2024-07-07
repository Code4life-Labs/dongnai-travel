import { createSlice } from "@reduxjs/toolkit";

export const languageSlice = createSlice({
  name: "language",
  initialState: {
    code: "en",
    data: {} as any,
  },
  reducers: {
    updateCode: (state, action) => {
      const code = action.payload;
      state.code = code;
    },
    updateData: (state, action) => {
      const data = action.payload;
      state.data = data;
    },
  },
});

export const languageActions = languageSlice.actions;
