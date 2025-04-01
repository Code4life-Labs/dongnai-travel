// Import from bases
import { API } from "@/classes/API";

// Import from utils
import { RouteUtils } from "@/utils/route";

// Import types
import type { Banner } from "./type";
import type { GetMultipleBaseOptions } from "@/types/api";

type GetBannersAsyncOptions = {} & GetMultipleBaseOptions;
type GetBannerAttributesOptions = {} & GetMultipleBaseOptions;
type GetBannerAsyncOptions = {
  id: string;
};

export class BannerAPI {
  api!: API;

  constructor(baseURL: string) {
    this.api = new API({ baseURL });
  }

  /**
   * Get banners
   * @param options
   * @returns
   */
  async getBannersAsync(options: GetBannersAsyncOptions) {
    try {
      const { limit = 10, skip = 0 } = options;
      const url = RouteUtils.getPath("banners");
      let query = `limit=${limit}&skip=${skip}`;
      let headers: Record<string, any> = API.addAuthorizationToHeader({});

      const response = await this.api.get(RouteUtils.mergeQuery(url, query), {
        headers,
      });

      return response.data.data as Array<Banner>;
    } catch (error: any) {
      console.warn(error.message);
      return null;
    }
  }
}
