// Import types
import type { AppState } from "../type";

export const mapSelectors = {
  selectCurrent(state: AppState) {
    return state.map.currentMap;
  },
};
