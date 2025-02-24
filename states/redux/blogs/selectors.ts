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
   * Get current status of current brief blog
   * @param state
   * @returns
   */
  selectCurrentBlogsStatus(state: AppState) {
    return state.blogs.briefBlogListInformation.status;
  },

  /**
   * Get blog details in redux store by id
   * @param state
   * @returns
   */
  selectBlogDetails(state: AppState, blogId: string) {
    return state.blogs.blogDict[blogId];
  },

  /**
   * Get types of blog
   * @param state
   * @returns
   */
  selectBlogTypes(state: AppState) {
    return state.blogs.types;
  },

  /**
   * Get blog data which is prepared to publish
   * @param state
   * @returns
   */
  selectPreparedPublishBlog(state: AppState) {
    return state.blogs.preparedPublishBlog;
  },
};
