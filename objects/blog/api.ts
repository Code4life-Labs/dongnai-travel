// Import classes
import { API } from "@/classes/API";

// Import objects
import { UserManager } from "../user";

// Import utils
import { RouteUtils } from "@/utils/route";

// Import types
import type { AxiosRequestConfig } from "axios";
import type { Blog, BlogComment, CreateBlogComment, BlogType } from "./type";
import type { GetMultipleBaseOptions } from "@/types/api";

type GetBlogsAsyncOptions = {
  type?: string;
} & GetMultipleBaseOptions;

type GetBlogAsyncOptions = {
  id: string;
};

type GetBlogCommentsOptions = {
  blogId: string;
} & GetMultipleBaseOptions;

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
      const { limit = 10, skip = 0, type = "all" } = options;
      const url = RouteUtils.getPath("blogs");
      let query = `limit=${limit}&skip=${skip}&types=${type}`;
      let headers: Record<string, any> = API.addAuthorizationToHeader({});

      const response = await this.api.get(RouteUtils.mergeQuery(url, query), {
        headers,
      });

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
      const { id } = options;
      const url = RouteUtils.getPath("blogs", id);
      let headers: Record<string, any> = API.addAuthorizationToHeader({});

      const response = await this.api.get(url, {
        headers,
      });
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
   * Get blog's comments
   * @param options
   * @returns
   */
  async getBlogComments(options: GetBlogCommentsOptions) {
    try {
      const { limit = 10, skip = 0, blogId } = options;
      const url = RouteUtils.getPath("blogs", blogId, "comments");
      let query = `limit=${limit}&skip=${skip}`;

      const response = await this.api.get(RouteUtils.mergeQuery(url, query));

      return response.data.data as Array<BlogComment>;
    } catch (error: any) {
      console.warn(error.message);
      return null;
    }
  }

  /**
   * Mark `like` on a blog
   * @param userId
   * @param blogId
   * @returns
   */
  async postLikedBlogAsync(blogId: string) {
    try {
      const userId = API.getUser()?._id;
      const url = RouteUtils.getPath(
        "users",
        `${userId}`,
        "likes/blogs",
        `${blogId}`
      );

      await this.api.post(url, null, {
        headers: {
          Authorization: API.generateBearerToken() as string,
        },
      });

      return true;
    } catch (error: any) {
      console.warn(error.message);
      return false;
    }
  }

  /**
   * Delete blog
   * @param userId
   * @param blogId
   * @returns
   */
  async deleteLikedBlogAsync(blogId: string) {
    try {
      const userId = API.getUser()?._id;
      const url = RouteUtils.getPath(
        "users",
        `${userId}`,
        "likes/blogs",
        `${blogId}`
      );

      await this.api.delete(url, {
        headers: {
          Authorization: API.generateBearerToken() as string,
        },
      });

      return true;
    } catch (error: any) {
      console.warn(error.message);
      return false;
    }
  }

  /**
   * Get suggested titles
   * @param userId
   * @param blogId
   * @returns
   */
  async postToGetSuggestedTitles(data: any) {
    try {
      const url = RouteUtils.getPath("blogs", "content", "sugggested-titles");

      const response = await this.api.post(url, data);

      return response.data.data;
    } catch (error: any) {
      console.warn(error.message);
      return null;
    }
  }

  /**
   * Upload blog
   * @param data
   */
  async postBlog(data: FormData, configs?: AxiosRequestConfig) {
    try {
      const userId = API.getUser()?._id;

      if (!userId) throw new Error("Unauthenticated");

      const url = RouteUtils.getPath("users", userId, "blog");

      configs = Object.assign(
        {},
        {
          headers: {
            Authorization: API.generateBearerToken(),
          },
        },
        configs
      );

      const response = await this.api.post(url, data, configs);

      return response.data.data;
    } catch (error: any) {
      console.warn(error.message);
      return null;
    }
  }

  /**
   * Create new comment for blog
   * @param data
   * @returns
   */
  async postBlogComment(blogId: string, data: CreateBlogComment) {
    try {
      const userId = API.getUser()?._id;

      if (!userId) throw new Error("Unauthenticated");

      const url = RouteUtils.getPath(
        "users",
        userId,
        "comments",
        "blogs",
        blogId
      );

      const response = await this.api.post(url, data, {
        headers: {
          Authorization: API.generateBearerToken() as string,
        },
      });

      console.log("Data:", response.data.data);

      return response.data.data;
    } catch (error: any) {
      console.warn(error.message);
      return null;
    }
  }

  /**
   * Delete new comment for blog
   * @param data
   * @returns
   */
  async deleteBlogComment(blogId: string) {
    try {
      const userId = API.getUser()?._id;

      if (!userId) throw new Error("Unauthenticated");

      const url = RouteUtils.getPath(
        "users",
        userId,
        "comments",
        "blogs",
        blogId
      );

      const response = await this.api.delete(url, {
        headers: {
          Authorization: API.generateBearerToken() as string,
        },
      });

      return response.data.data;
    } catch (error: any) {
      console.warn(error.message);
      return null;
    }
  }

  /**
   * Update new comment for blog
   * @param data
   * @returns
   */
  async editBlogComment(blogId: string, data: CreateBlogComment) {
    try {
      const userId = API.getUser()?._id;

      if (!userId) throw new Error("Unauthenticated");

      const url = RouteUtils.getPath(
        "users",
        userId,
        "comments",
        "blogs",
        blogId
      );

      const response = await this.api.patch(url, data, {
        headers: {
          Authorization: API.generateBearerToken() as string,
        },
      });

      return response.data.data;
    } catch (error: any) {
      console.warn(error.message);
      return null;
    }
  }

  /**
   * Validate blog metadata before uploading
   * @param data
   * @returns
   */
  async validateBlogMetadata(data: Blog) {
    try {
      const userId = API.getUser()?._id;

      if (!userId) throw new Error("Unauthenticated");

      const url = RouteUtils.getPath("blog", "check");

      const response = await this.api.post(url, data, {
        headers: {
          Authorization: API.generateBearerToken() as string,
        },
      });

      return response.data.data;
    } catch (error: any) {
      console.warn(error.message);
      return null;
    }
  }
}
