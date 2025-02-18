// Import classes
import { API } from "@/classes/API";

// Import utils
import { RouteUtils } from "@/utils/route";

// Import types
import type { Blog, BlogType } from "./type";

type GetBlogsAsyncOptions = {
  limit?: number | string;
  skip?: number | string;
  type?: string;
  userId?: string;
};

type GetBlogAsyncOptions = {
  id: string;
  userId?: string;
};

export class BlogAPI {
  static Fields = "";

  api!: API;

  constructor(baseURL: any) {
    this.api = new API({ baseURL });
  }

  /**
   * Get blogs from server
   * @param options
   * @returns
   */
  async getBlogsAsync(options: GetBlogsAsyncOptions) {
    try {
      const { limit = 10, skip = 0, type = "all", userId } = options;
      const url = RouteUtils.getPath("blogs");
      let query = `limit=${limit}&skip=${skip}&types=${type}`;

      if (userId) query += `&userId=${userId}`;

      const response = await this.api.get(RouteUtils.mergeQuery(url, query));

      return response.data.data as Array<Blog>;
    } catch (error: any) {
      console.warn(error.message);
      return null;
    }
  }

  /**
   * Get blog by id
   * @param options
   * @returns
   */
  async getBlogAsync(options: GetBlogAsyncOptions) {
    try {
      const { id, userId } = options;
      const url = RouteUtils.getPath("blogs", id);
      let params = new URLSearchParams();

      if (userId) params.append("userId", userId);

      const response = await this.api.get(url, { params });
      // const data = await import("@/assets/mock-data/blog/blog.json");

      return response.data.data as Blog;
    } catch (error: any) {
      console.warn(error.message);
      return null;
    }
  }

  /**
   * Get types of blogs
   * @returns
   */
  async getBlogTypes() {
    try {
      const url = RouteUtils.getPath("blogs", "types");

      const response = await this.api.get(url);

      return response.data.data as Array<BlogType>;
    } catch (error: any) {
      console.warn(error.message);
      return [];
    }
  }

  /**
   * Mark `like` on a blog
   * @param userId
   * @param blogId
   * @returns
   */
  async postLikedBlogAsync(userId: string, blogId: string) {
    try {
      const url = RouteUtils.getPath(
        "users",
        `${userId}`,
        "likes/blogs",
        `${blogId}`
      );

      await this.api.post(url, null);

      return true;
    } catch (error: any) {
      console.warn(error.message);
      return false;
    }
  }

  /**
   * Unmark `like` on a blog
   * @param userId
   * @param blogId
   * @returns
   */
  async deleteLikedBlogAsync(userId: string, blogId: string) {
    try {
      const url = RouteUtils.getPath(
        "users",
        `${userId}`,
        "likes/blogs",
        `${blogId}`
      );

      await this.api.delete(url);

      return true;
    } catch (error: any) {
      console.warn(error.message);
      return false;
    }
  }
}
