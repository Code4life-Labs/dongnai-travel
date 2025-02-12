// Import API
import { API } from "@/classes/API";

// Import types
import type { NewUser, UserDataForAuthentication } from "./type";

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
}
