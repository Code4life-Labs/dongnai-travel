// Import types
import type { AppState } from "..";
import type { UThemeSchemes } from "@/constants/themes";

export const themeSelectors = {
  selectSelf(state: AppState, themeName: UThemeSchemes) {
    return state.theme.schemes[themeName];
  },

  selectMode(state: AppState) {
    return state.theme.mode;
  },

  selectCurrentScheme(state: AppState) {
    return state.theme.schemes[state.theme.mode];
  },
};
