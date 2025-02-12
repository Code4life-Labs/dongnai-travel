// Import from bases
import { API } from "@/classes/API";

// Import from utils
import { RouteUtils } from "@/utils/route";

const api = new API();

type GetSpeechAsyncData = {
  text: string;
  lang: string;
};

export class TextAPI {
  baseURL!: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  /**
   * Lấy speech từ text.
   * @param args
   * @returns
   */
  async getSpeechAsync(data: GetSpeechAsyncData) {
    try {
      const url = this.baseURL + RouteUtils.getPath("/speech");

      const response = await api.post(url, data);

      return response.data as Promise<Array<any>>;
    } catch (error: any) {
      console.warn(error.message);
      return null;
    }
  }
}
