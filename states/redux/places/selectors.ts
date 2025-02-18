// Import types
import type { AppState } from "../type";

export const placesSelectors = {
  /**
   * Get current places in store
   * @param state
   * @param typeOfBriefPlaces
   * @returns
   */
  selectCurrentPlaces(state: AppState) {
    return state.places.briefPlaceListInformation.data;
  },

  /**
   * Get place details in redux store by id
   * @param state
   * @returns
   */
  selectPlaceDetails(state: AppState, placeId: string) {
    return state.places.placeDict[placeId];
  },

  /**
   * Get place types (with default / redefined types)
   * @param state
   * @param placeId
   * @returns
   */
  selectPlaceTypes(state: AppState) {
    return state.places.types;
  },
};
