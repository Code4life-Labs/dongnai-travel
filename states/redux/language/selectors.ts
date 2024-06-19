// Import types
import type { AppState } from "../type";

export const languageSelectors = {
  selectCode(state: AppState) {
    return state.language.code;
  },

  selectData(state: AppState) {
    return state.language.data;
  },
};
