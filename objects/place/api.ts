// Import from bases
import { API } from "@/classes/API";

// Import from utils
import { RouteUtils } from "@/utils/route";

// Import types
import type { Place } from "./type";

const api = new API();

type GetPlacesAsyncOptions = {
  limit?: number | string;
  skip?: number | string;
  type?: string;
  userId?: string;
};

export class PlaceAPI {
  static Fields =
    "placeId;name;addressComponents;types;userRatingsTotal;rating;isRecommended;userFavoritesTotal;photos";

  baseURL!: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  /**
   * Get places' information from server. Receive various number of args:
   *   - __args0__: is `limit`
   *   - __args1__: is `skip`
   *   - __args2__ (optional): is `type` of places
   *   - __args3__ (optional): is `id` of requester (user's id)
   * @param args
   * @returns
   */
  async getPlacesAsync(options: GetPlacesAsyncOptions) {
    try {
      const { limit = 10, skip = 0, type = "all", userId } = options,
        url = this.baseURL + RouteUtils.getPath("places");
      let query = `limit=${limit}&skip=${skip}&filter=quality:${type}&fields=${PlaceAPI.Fields}`;

      if (userId) query += `&userId=${userId}`;

      const response = await api.get(RouteUtils.mergeQuery(url, query));

      return response.data as Promise<Array<Place>>;
    } catch (error: any) {
      console.warn(error.message);
      return [];
    }
  }

  async getPlaceAsync(id: string) {}
  async updatePlaceAynsc() {}
}
