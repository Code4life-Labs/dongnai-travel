// Import types
import type { AppState } from "../type";

export const manifoldSelectors = {
  selectCurrent(state: AppState) {
    return state.manifold.current;
  },
};
