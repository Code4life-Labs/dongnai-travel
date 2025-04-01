// Import types
import type { AddressComoponent } from "./type";

/**
 * A static class which is used to check validation of place's data
 * @NguyenAnhTuan1912
 */
export class PlaceValidator {
  static InvalidACTypes = new Map();

  constructor() {
    this._setInvalidACTypes();
  }

  private _setInvalidACTypes() {
    PlaceValidator.InvalidACTypes.set("postal_code", "postal_code");
  }

  /**
   * Check if ac is valid base on its `types`.
   * @param ac
   */
  canShowAddressComponent(ac: AddressComoponent) {
    if (!ac || !ac.types) return false;
    return ac.types.some((type) => !PlaceValidator.InvalidACTypes.has(type));
  }
}
