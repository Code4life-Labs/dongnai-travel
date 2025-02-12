import { BlogAPI } from "./api";
import { BlogValidator } from "./validator";
import { BlogStorage } from "./storage";

// Import types
import type { Blog } from "./type";

export class BlogManager {
  static Api = new BlogAPI(process.env.EXPO_DONGNAITRAVEL_API_URL!);
  static Validator = new BlogValidator();
  static Storage = new BlogStorage();

  private constructor() {}
}
