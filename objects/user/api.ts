// Import API
import { API } from "@/classes/API";

// Import utils
import { RouteUtils } from "@/utils/route";

// Import types
import type { User, NewUser, UserDataForAuthentication } from "./type";
import type { GetMultipleBaseOptions } from "@/types/api";

type GetUsersAsyncOptions = {
  name?: string;
} & GetMultipleBaseOptions;

export class UserAPI {
  api!: API;

  constructor(baseURL: string) {
    this.api = new API({ baseURL });
  }

  async signUp(data: NewUser) {
    try {
      const response = await this.api.post("/auth/sign-up", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async signIn(data: UserDataForAuthentication) {
    try {
      const response = await this.api.post("/auth/sign-in", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getUsersAsync(options: GetUsersAsyncOptions) {
    try {
      const { limit = 10, skip = 0, name } = options;
      const url = RouteUtils.getPath("users");
      let query = `limit=${limit}&skip=${skip}`;
      let headers: Record<string, any> = API.addAuthorizationToHeader({});

      if (name) query += `&name=${name}`;

      // Set type
      query += "&type=user";

      const response = await this.api.get(RouteUtils.mergeQuery(url, query), {
        headers,
      });

      return response.data.data as Array<User>;
    } catch (error: any) {
      console.warn(error.message);
      return null;
    }
  }

  /**
   * Update user profile
   * @param userId User ID
   * @param profileData Profile data to update
   * @param token Authentication token
   * @returns Updated user data
   */
  async updateProfile(userId: string, profileData: FormData, token: string) {
    try {
      const response = await this.api.patch(`/users/${userId}`, profileData, {
        headers: {
          Authorization: API.generateBearerToken() as string,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  }
}
