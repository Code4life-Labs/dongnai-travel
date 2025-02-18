// Import types
import type { AppState } from "../type";

export const blogsSelectors = {
  /**
   * Get current blogs in store
   * @param state
   * @param typeOfBriefBlogs
   * @returns
   */
  selectCurrentBlogs(state: AppState) {
    return state.blogs.briefBlogListInformation.data;
  },

  /**
   * Get blog details in redux store by id
   * @param state
   * @returns
   */
  selectBlogDetails(state: AppState, blogId: string) {
    return state.blogs.blogDict[blogId];
  },

  selectBlogTypes(state: AppState) {
    return state.blogs.types;
  },
};
