import { debounce } from "lodash";

// Import utils
import { StringUtils } from "@/utils/string";

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
   * Toggle like a blog
   * @param blog
   * @param likeBlog
   * @param unlikeBlog
   */
  static toggleLike = debounce(function (
    blog: Blog,
    likeBlog: (blogId: string) => void,
    unlikeBlog: (blogId: string) => void
  ) {
    if (blog.isLiked) {
      unlikeBlog(blog._id);
    } else {
      likeBlog(blog._id);
    }
  }, parseInt(process.env.EXPO_PUBLIC_BUTTON_DEBOUNCE_TIME!));
}
