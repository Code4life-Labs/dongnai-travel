import { BlogAPI } from "./api";

// Import types
import type { Blog } from "./type";

export class BlogManager {
  static Api = new BlogAPI();

  private constructor() {}
}
