// Import types
import type { AppState } from "../type";

export const placesSelectors = {
  /**
   * Get current places in store
   * @param state
   * @returns
   */
  selectCurrentPlaces(state: AppState) {
    return state.places.briefPlaceListInformation.data;
  },

  /**
   * Get current status of current brief place
   * @param state
   * @returns
   */
  selectCurrentPlacesStatus(state: AppState) {
    return state.places.briefPlaceListInformation.status;
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
