import { createSlice } from "@reduxjs/toolkit";

// Import from constants
import { theme } from "@/styles/themes";

// Import types
import type { UThemeSchemes } from "@/styles/themes";

export const themeSlice = createSlice({
  name: "theme",
  initialState: {
    mode: "light" as UThemeSchemes,
    schemes: {
      light: theme.data.light,
      dark: theme.data.dark,
    },
  },
  reducers: {
    toggleThemeState(state) {
      return {
        ...state,
        mode: state.mode === "light" ? "dark" : "light",
      };
    },
  },
});

export const themeActions = themeSlice.actions;
