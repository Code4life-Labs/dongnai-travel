// Import types
import type { AppState } from "../type";

export const manifoldSelectors = {
  settingsSelector(state: AppState) {
    return state.manifold.settings;
  },

  statusSelector(state: AppState) {
    return state.manifold.status;
  },

  bottomSheetSelector(state: AppState) {
    return state.manifold.bottomSheet;
  },

  statusBarSelector(state: AppState) {
    return state.manifold.statusBar;
  },
};
