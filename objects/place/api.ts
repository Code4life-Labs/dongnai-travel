// Import from bases
import { API } from "@/classes/API";

// Import from utils
import { RouteUtils } from "@/utils/route";

// Import types
import type { Place } from "./type";

type GetPlacesAsyncOptions = {
  limit?: number | string;
  skip?: number | string;
  type?: string;
  userId?: string;
};

type GetPlaceAsyncOptions = {
  id: string;
  userId?: string;
};

export class PlaceAPI {
  static Fields =
    "placeId;name;addressComponents;types;userRatingsTotal;rating;isRecommended;userFavoritesTotal;photos";

  api!: API;

  constructor(baseURL: string) {
    this.api = new API({ baseURL });
  }

  /**
   * Get places from server.
   * @param options
   * @returns
   */
  async getPlacesAsync(options: GetPlacesAsyncOptions) {
    try {
      const { limit = 10, skip = 0, type = "all", userId } = options;
      const url = RouteUtils.getPath("places");
      let query = `limit=${limit}&skip=${skip}&type=${type}&fields=${PlaceAPI.Fields}`;

      if (userId) query += `&userId=${userId}`;

      const response = await this.api.get(RouteUtils.mergeQuery(url, query));

      return response.data as Array<Place>;
    } catch (error: any) {
      console.warn(error.message);
      return [];
    }
  }

  async getPlaceAsync(options: GetPlaceAsyncOptions) {
    try {
      const { id, userId } = options;
      const url = RouteUtils.getPath("place");
      let query = `id=${id}`;

      if (userId) query += `&userId=${userId}`;

      // const response = await this.api.get(RouteUtils.mergeQuery(url, query));
      const data = await import("@/assets/mock-data/place/place.json");

      return data as Place;
    } catch (error: any) {
      console.warn(error.message);
      return [];
    }
  }
  async updatePlaceAynsc() {}
}
