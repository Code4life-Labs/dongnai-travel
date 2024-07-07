// Import from bases
import { API } from "@/bases/API";

// Import from utils
import { RouteUtils } from "@/utils/route";

// Import types
import type { Place } from "./type";

export class PlaceAPI extends API {
  static Fields =
    "placeId;name;addressComponents;types;userRatingsTotal;rating;isRecommended;favoritesTotal;place_photos";

  constructor(root: string) {
    super(root + RouteUtils.getPath("v1", "map"));
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
        url = this.base + RouteUtils.getPath("places");
      let query = `limit=${limit}&skip=${skip}&filter=quality:${type}&fields=${PlaceAPI.Fields}`;

      if (requesterId) query += `&userId=${requesterId}`;

      const response = await fetch(RouteUtils.mergeQuery(url, query));

      return response.json() as Promise<Array<Place>>;
    } catch (error: any) {
      console.warn(error.message);
      return;
    }
  }
  async updatePlaceAynsc() {}
}
