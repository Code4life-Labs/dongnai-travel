// Import from bases
import { API } from "@/classes/API";

// Import from utils
import { RouteUtils } from "@/utils/route";

// Import types
import type { Place, PlaceType } from "./type";

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
      let query = `limit=${limit}&skip=${skip}&types=${type}`;

      if (userId) query += `&userId=${userId}`;

      const response = await this.api.get(RouteUtils.mergeQuery(url, query));

      return response.data.data as Array<Place>;
    } catch (error: any) {
      console.warn(error.message);
      return [];
    }
  }

  /**
   * Get a place with full information
   * @param options
   * @returns
   */
  async getPlaceAsync(options: GetPlaceAsyncOptions) {
    try {
      const { id, userId } = options;
      const url = RouteUtils.getPath("place");
      let query = `id=${id}`;

      if (userId) query += `&userId=${userId}`;

      const response = await this.api.get(RouteUtils.mergeQuery(url, query));
      // const data = await import("@/assets/mock-data/place/place.json");

      return response.data.data as Place;
    } catch (error: any) {
      console.warn(error.message);
      return [];
    }
  }

  /**
   * Get types of places
   * @returns
   */
  async getPlaceTypes() {
    try {
      const url = RouteUtils.getPath("places", "types");

      const response = await this.api.get(url);

      return response.data.data as Array<PlaceType>;
    } catch (error: any) {
      console.warn(error.message);
      return [];
    }
  }

  /**
   * Mark `favorite` on a place
   * @param userId
   * @param placeId
   * @returns
   */
  async postFavoritedPlaceAsync(userId: string, placeId: string) {
    try {
      const url = RouteUtils.getPath(
        "users",
        `${userId}`,
        "favorites/places",
        `${placeId}`
      );
      console.log("URL:", url);
      await this.api.post(url, null);

      return true;
    } catch (error: any) {
      console.warn("Post Favorited Place:", error);
      return false;
    }
  }

  /**
   * Unmark `favorite` on a place
   * @param userId
   * @param placeId
   * @returns
   */
  async deleteFavoritedPlaceAsync(userId: string, placeId: string) {
    try {
      const url = RouteUtils.getPath(
        "users",
        `${userId}`,
        "favorites/places",
        `${placeId}`
      );

      await this.api.delete(url);

      return true;
    } catch (error: any) {
      console.warn(error.message);
      return false;
    }
  }

  /**
   * Mark `visit` on a place
   * @param userId
   * @param placeId
   * @returns
   */
  async postVisitedPlaceAsync(userId: string, placeId: string) {
    try {
      const url = RouteUtils.getPath(
        "users",
        `${userId}`,
        "visits/places",
        `${placeId}`
      );

      await this.api.post(url, null);

      return true;
    } catch (error: any) {
      console.warn(error.message);
      return false;
    }
  }

  /**
   * Unmark `visit` on a place
   * @param userId
   * @param placeId
   * @returns
   */
  async deleteVisitedPlaceAsync(userId: string, placeId: string) {
    try {
      const url = RouteUtils.getPath(
        "users",
        `${userId}`,
        "favorites/places",
        `${placeId}`
      );

      await this.api.delete(url);

      return true;
    } catch (error: any) {
      console.warn(error.message);
      return false;
    }
  }
}
