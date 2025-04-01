// Import types
import type { AppState } from "../type";
import type { UThemeSchemes } from "@/styles/theme";

export const themeSelectors = {
  selectSelf(state: AppState, themeName: UThemeSchemes) {
    return state.theme.schemes[themeName];
  },

  selectMode(state: AppState) {
    return state.theme.currentScheme;
  },

  selectCurrentScheme(state: AppState) {
    return state.theme.schemes[state.theme.currentScheme];
  },
};
