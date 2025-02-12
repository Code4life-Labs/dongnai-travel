// Import classes
import { API } from "@/classes/API";

// Import utils
import { RouteUtils } from "@/utils/route";

// Import types
import type { Blog } from "./type";

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
      let query = `limit=${limit}&skip=${skip}&type=${type}&fields=${BlogAPI.Fields}`;

      if (userId) query += `&userId=${userId}`;

      const response = await this.api.get(RouteUtils.mergeQuery(url, query));

      return response.data as Promise<Array<Blog>>;
    } catch (error: any) {
      console.warn(error.message);
      return [];
    }
  }
  async getBlogAsync() {}
  async updateBlogAsync() {}
}
