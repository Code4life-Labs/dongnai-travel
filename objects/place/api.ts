// Import from bases
import { API } from "@/classes/API";

// Import from utils
import { RouteUtils } from "@/utils/route";

// Import types
import type { Place, PlaceReview, CreatePlaceReview, PlaceType } from "./type";
import type { GetMultipleBaseOptions } from "@/types/api";

type GetPlacesAsyncOptions = {
  name?: string;
  type?: string;
} & GetMultipleBaseOptions;

type GetPlaceAsyncOptions = {
  id: string;
};

type GetPlaceReviewsOptions = {
  placeId: string;
} & GetMultipleBaseOptions;

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
      const { limit = 10, skip = 0, type = "all", name } = options;
      const url = RouteUtils.getPath("places");
      let query = `limit=${limit}&skip=${skip}&types=${type}`;

      if (name) query += `&name=${name}`;

      const response = await this.api.get(RouteUtils.mergeQuery(url, query), {
        headers: {
          Authorization: API.generateBearerToken() as string,
        },
      });

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
      const { id } = options;
      const url = RouteUtils.getPath("places", id);

      const response = await this.api.get(url, {
        headers: {
          Authorization: API.generateBearerToken() as string,
        },
      });
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
   * Get place's reviews
   * @param options
   * @returns
   */
  async getPlaceReviews(options: GetPlaceReviewsOptions) {
    try {
      const { limit = 10, skip = 0, placeId } = options;
      const url = RouteUtils.getPath("places", placeId, "reviews");
      let query = `limit=${limit}&skip=${skip}`;

      const response = await this.api.get(RouteUtils.mergeQuery(url, query));

      return response.data.data as Array<PlaceReview>;
    } catch (error: any) {
      console.warn(error.message);
      return null;
    }
  }

  /**
   * Mark `favorite` on a place
   * @param userId
   * @param placeId
   * @returns
   */
  async postFavoritedPlaceAsync(placeId: string) {
    try {
      const userId = API.getUser()?._id;
      const url = RouteUtils.getPath(
        "users",
        `${userId}`,
        "favorites/places",
        `${placeId}`
      );

      console.log("postFavoritedPlace URL:", url);

      await this.api.post(url, null, {
        headers: {
          Authorization: API.generateBearerToken() as string,
        },
      });

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
  async deleteFavoritedPlaceAsync(placeId: string) {
    try {
      const userId = API.getUser()?._id;
      const url = RouteUtils.getPath(
        "users",
        `${userId}`,
        "favorites/places",
        `${placeId}`
      );

      await this.api.delete(url, {
        headers: {
          Authorization: API.generateBearerToken() as string,
        },
      });

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
  async postVisitedPlaceAsync(placeId: string) {
    try {
      const userId = API.getUser()?._id;
      const url = RouteUtils.getPath(
        "users",
        `${userId}`,
        "visits/places",
        `${placeId}`
      );

      await this.api.post(url, null, {
        headers: {
          Authorization: API.generateBearerToken() as string,
        },
      });

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
  async deleteVisitedPlaceAsync(placeId: string) {
    try {
      const userId = API.getUser()?._id;
      const url = RouteUtils.getPath(
        "users",
        `${userId}`,
        "favorites/places",
        `${placeId}`
      );

      await this.api.delete(url, {
        headers: {
          Authorization: API.generateBearerToken() as string,
        },
      });

      return true;
    } catch (error: any) {
      console.warn(error.message);
      return false;
    }
  }

  /**
   * Create new review for place
   * @param data
   * @returns
   */
  async postPlaceReview(placeId: string, data: CreatePlaceReview) {
    try {
      const userId = API.getUser()?._id;

      if (!userId) throw new Error("Unauthenticated");

      const url = RouteUtils.getPath(
        "users",
        userId,
        "reviews",
        "places",
        placeId
      );

      const response = await this.api.post(url, data, {
        headers: {
          Authorization: API.generateBearerToken() as string,
        },
      });

      return response.data.data;
    } catch (error: any) {
      console.warn(error.message);
      return null;
    }
  }

  /**
   * Delete new review for place
   * @param data
   * @returns
   */
  async deletePlaceReview(placeId: string) {
    try {
      const userId = API.getUser()?._id;

      if (!userId) throw new Error("Unauthenticated");

      const url = RouteUtils.getPath(
        "users",
        userId,
        "reviews",
        "places",
        placeId
      );

      const response = await this.api.delete(url, {
        headers: {
          Authorization: API.generateBearerToken() as string,
        },
      });

      return response.data.data;
    } catch (error: any) {
      console.warn(error.message);
      return null;
    }
  }

  /**
   * Update new review for place
   * @param data
   * @returns
   */
  async editPlaceReview(placeId: string, data: CreatePlaceReview) {
    try {
      const userId = API.getUser()?._id;

      if (!userId) throw new Error("Unauthenticated");

      const url = RouteUtils.getPath(
        "users",
        userId,
        "reviews",
        "places",
        placeId
      );

      const response = await this.api.patch(url, data, {
        headers: {
          Authorization: API.generateBearerToken() as string,
        },
      });

      return response.data.data;
    } catch (error: any) {
      console.warn(error.message);
      return null;
    }
  }
}
