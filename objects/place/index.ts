import { debounce } from "lodash";

import { PlaceAPI } from "./api";
import { PlaceValidator } from "./validator";
import { PlaceStorage } from "./storage";

// Import types
import type { Place } from "./type";

/**
 * An static class which is used to manage place
 * @NguyenAnhTuan1912
 */
export class PlaceManager {
  static Api = new PlaceAPI(process.env.EXPO_PUBLIC_DONGNAITRAVEL_API_URL!);
  static Validator = new PlaceValidator();
  static Storage = new PlaceStorage();

  private constructor() {}

  /**
   * Get address string from array of address components
   * @param place
   */
  static getAddress(place: Partial<Place>) {
    let result = "",
      i = 0;

    while (i < place.addressComponents!.length) {
      if (
        !this.Validator.canShowAddressComponent(place.addressComponents![i])
      ) {
        i++;
        continue;
      }

      if (i > 0) result += " - " + place.addressComponents![i].shortName;
      else result += place.addressComponents![i].shortName;

      i++;
    }

    return result;
  }

  /**
   * Toggle favorite a place
   * @param place
   * @param favoritePlace
   * @param unfavoritePlace
   */
  static toggleFavorite = debounce(function (
    place: Place,
    favoritePlace: (placeId: string) => void,
    unfavoritePlace: (placeId: string) => void
  ) {
    if (place.isFavorited) {
      unfavoritePlace(place._id);
    } else {
      favoritePlace(place._id);
    }
  }, parseInt(process.env.EXPO_PUBLIC_BUTTON_DEBOUNCE_TIME!));

  /**
   * Toggle visit a place
   * @param place
   * @param visitPlace
   * @param unvisitPlace
   */
  static toggleVisit = debounce(function (
    place: Place,
    visitPlace: (placeId: string) => void,
    unvisitPlace: (placeId: string) => void
  ) {
    if (place.isVisited) {
      unvisitPlace(place._id);
    } else {
      visitPlace(place._id);
    }
  }, parseInt(process.env.EXPO_PUBLIC_BUTTON_DEBOUNCE_TIME!));
}
