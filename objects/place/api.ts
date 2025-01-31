// Import from bases
import { API } from "@/classes/API";

// Import from utils
import { RouteUtils } from "@/utils/route";

// Import types
import type { Place } from "./type";

const api = new API();

export class PlaceAPI {
  static Fields =
    "placeId;name;addressComponents;types;userRatingsTotal;rating;isRecommended;favoritesTotal;place_photos";

  baseURL!: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  async getPlaceAsync(id: string) {}
  /**
   * Get places' information from server. Receive various number of args:
   *   - __args0__: is `limit`
   *   - __args1__: is `skip`
   *   - __args2__ (optional): is `type` of places
   *   - __args3__ (optional): is `id` of requester (user's id)
   * @param args
   * @returns
   */
  async getPlacesAsync(
    ...args: [string | number, string | number, string?, string?]
  ) {
    try {
      const [limit, skip, type = "all", requesterId] = args,
        url = this.baseURL + RouteUtils.getPath("places");
      let query = `limit=${limit}&skip=${skip}&filter=quality:${type}&fields=${PlaceAPI.Fields}`;

      if (requesterId) query += `&userId=${requesterId}`;

      const response = await api.get(RouteUtils.mergeQuery(url, query));

      return response.data as Promise<Array<Place>>;
    } catch (error: any) {
      console.warn(error.message);
      throw error;
    }
  }
  async updatePlaceAynsc() {}
}
