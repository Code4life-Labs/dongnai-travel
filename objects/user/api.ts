// Import API
import { API } from "@/classes/API";

const url = process.env.EXPO_DONGNAITRAVEL_API_URL!;
const api = new API({
  baseURL: url,
});

export class UserAPI {
  async signUp(data: any) {
    try {
      const response = await api.post("/auth/sign-up", {});
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async signIn(data: any) {
    try {
      const response = await api.post("/auth/sign-in", {});
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
