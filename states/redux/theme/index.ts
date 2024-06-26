import { createSlice } from "@reduxjs/toolkit";

// Import from constants
import { theme } from "@/styles/theme";

// Import types
import type { UThemeSchemes } from "@/styles/theme";

export const themeSlice = createSlice({
  name: "theme",
  initialState: {
    currentScheme: "light" as UThemeSchemes,
    schemes: {
      light: theme.data.light,
      dark: theme.data.dark,
    },
  },
  reducers: {
    toggleThemeState(state) {
      state.currentScheme = state.currentScheme === "light" ? "dark" : "light";
    },
  },
});

export const themeActions = themeSlice.actions;
