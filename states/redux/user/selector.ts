// Import types
import type { AppState } from "../type";

export const UserSelectors = {
  /**
   * Trả về dữ liệu hiện tại của người dùng trong App.
   * @param state
   * @returns
   */
  selectUser(state: AppState) {
    return state.user.user;
  },
  /**
   * Trả về dữ liệu của user slice
   * @param state
   * @returns
   */
  selectAll(state: AppState) {
    return state.user;
  },
};
