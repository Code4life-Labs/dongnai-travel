import { createSlice } from "@reduxjs/toolkit";

// Import from assets
import LanguageData from "@/assets/json/language.json";

export type ULanguageCode = "en" | "vi";

export const languageSlice = createSlice({
  name: "language",
  initialState: {
    code: "en" as ULanguageCode,
    data: LanguageData,
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
