// Import types
import type { AppState } from "../type";

export const manifoldSelectors = {
  selectStatus(state: AppState) {
    return state.manifold.status;
  },
};
