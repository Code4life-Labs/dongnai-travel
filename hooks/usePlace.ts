import { useSelector, useDispatch } from "react-redux";

// Import actions
import { placesActions } from "@/states/redux/places";

// Import selectors
import { placesSelectors } from "@/states/redux/places/selectors";

// Import types
import type { AppState, AppDispatch } from "@/states/redux/type";
import type { Place } from "@/objects/place/type";

export const {
  usePlaces,
  usePlacesActions,
  usePlacesState,
  usePlaceDetailsState,
} = (function () {
  const createDispatchers = function (dispatch: AppDispatch) {
    return {
      addPlaceDetails(placeDetails: Place) {
        dispatch(placesActions.addPlaceDetails(placeDetails));
      },

      updateBriefPlace(id: string, briefPlace: Partial<Place>) {
        dispatch(placesActions.updateBriefPlace({ id, briefPlace }));
      },

      increaseSkipBriefPlacesAmount() {
        dispatch(placesActions.increaseSkipBriefPlacesAmount());
      },

      decreaseSkipBriefPlacesAmount() {
        dispatch(placesActions.decreaseSkipBriefPlacesAmount());
      },

      clearCurrentPlaces() {
        dispatch(placesActions.clearCurrentPlaces());
      },

      clearPlaceDetails(id: string) {
        dispatch(placesActions.clearPlaceDetails(id));
      },
    };
  };

  const selectPlaces = function (_useSelector: typeof useSelector) {
    return _useSelector(placesSelectors.selectCurrentPlaces);
  };

  const selectPlaceDetails = function (
    _useSelector: typeof useSelector,
    id: string
  ) {
    return _useSelector((state: AppState) =>
      placesSelectors.selectPlaceDetails(state, id)
    );
  };

  return {
    usePlaces() {
      const dispatch = useDispatch();
      const placesDispatchers = createDispatchers(dispatch);
      const places = selectPlaces(useSelector);

      return {
        places,
        placesDispatchers,
      };
    },

    usePlacesActions() {
      const dispatch = useDispatch();
      return createDispatchers(dispatch);
    },

    usePlacesState() {
      return selectPlaces(useSelector);
    },

    usePlaceDetailsState(id: string) {
      return selectPlaceDetails(useSelector, id);
    },
  };
})();
