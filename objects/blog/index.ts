import { debounce } from "lodash";

import { BlogAPI } from "./api";
import { BlogValidator } from "./validator";
import { BlogStorage } from "./storage";

// Import types
import type { Blog } from "./type";

export class BlogManager {
  static Api = new BlogAPI(process.env.EXPO_PUBLIC_DONGNAITRAVEL_API_URL!);
  static Validator = new BlogValidator();
  static Storage = new BlogStorage();

  private constructor() {}

  /**
   * Toggle favorite a blog
   * @param blog
   * @param favoritePlace
   * @param unfavoritePlace
   */
  static toggleLike = debounce(function (
    blog: Blog,
    favoriteBlog: (blogId: string) => void,
    unfavoriteBlog: (blogId: string) => void
  ) {
    if (blog.isLiked) {
      unfavoriteBlog(blog._id);
    } else {
      favoriteBlog(blog._id);
    }
  }, parseInt(process.env.EXPO_PUBLIC_BUTTON_DEBOUNCE_TIME!));
}
