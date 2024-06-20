import { BlogAPI } from "./api";
import { BlogValidator } from "./validator";

// Import types
import type { Blog } from "./type";

export class BlogManager {
  static Api = new BlogAPI();
  static Validator = new BlogValidator();

  private constructor() {}
}
