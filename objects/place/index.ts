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
  static Api = new PlaceAPI(process.env.EXPO_DONGNAITRAVEL_API_URL!);
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
}
