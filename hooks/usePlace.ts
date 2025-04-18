import React from "react";
import { useSelector, useDispatch } from "react-redux";

// Import actions
import { placesActions } from "@/states/redux/places";

// Import middlewares
import { placesThunks } from "@/states/redux/places/middlewares";

// Import selectors
import { placesSelectors } from "@/states/redux/places/selectors";

// Import types
import type { AppState, AppDispatch } from "@/states/redux/type";
import type { Place } from "@/objects/place/type";

export const { usePlaces, usePlacesActions, usePlacesState } = (function () {
  const createDispatchers = function (dispatch: AppDispatch) {
    return {
      fetchPlaces(type: string = "all") {
        dispatch(placesThunks.getPlacesAsync(type));
      },

      fetchPlaceTypes() {
        dispatch(placesThunks.getPlaceTypesAsync());
      },

      favoritePlace(placeId: string) {
        dispatch(placesThunks.favoritePlaceAsync(placeId));
      },

      unfavoritePlace(placeId: string) {
        dispatch(placesThunks.unfavoritePlaceAsync(placeId));
      },

      visitPlace(placeId: string) {
        dispatch(placesThunks.visitPlaceAsync(placeId));
      },

      unvisitPlace(placeId: string) {
        dispatch(placesThunks.unvisitPlaceAsync(placeId));
      },

      update(id: string, briefPlace: Partial<Place>) {
        dispatch(placesActions.updateBriefPlace({ id, briefPlace }));
      },

      increaseSkipAmount() {
        dispatch(placesActions.increaseSkipInBriefPlaceListInformation());
      },

      decreaseSkipAmount() {
        dispatch(placesActions.decreaseSkipInBriefPlaceListInformation());
      },

      clear() {
        dispatch(placesActions.clearCurrentPlaces());
      },
    };
  };

  const selectPlaces = function (_useSelector: typeof useSelector) {
    return _useSelector(placesSelectors.selectCurrentPlaces);
  };

  const selectCurrentPlacesType = function (_useSelector: typeof useSelector) {
    return _useSelector(placesSelectors.selectCurrentPlacesType);
  };

  const selectPlaceTypes = function (_useSelector: typeof useSelector) {
    return _useSelector(placesSelectors.selectPlaceTypes);
  };

  const selectPlacesStatus = function (_useSelector: typeof useSelector) {
    return _useSelector(placesSelectors.selectCurrentPlacesStatus);
  };

  return {
    /**
     * Use this hook to manage `places` and get actions to
     * manipulate `places`
     * @returns
     */
    usePlaces() {
      const dispatch = useDispatch();
      const placesDispatchers = createDispatchers(dispatch);
      const places = selectPlaces(useSelector);
      const currentType = selectCurrentPlacesType(useSelector);
      const placeTypes = selectPlaceTypes(useSelector);
      const status = selectPlacesStatus(useSelector);

      return {
        places,
        currentType,
        status,
        placeTypes,
        placesDispatchers,
      };
    },

    /**
     * Use this hook to get only actions, it does not affect component's
     * life cycle when `places` is updated
     * @returns
     */
    usePlacesActions() {
      const dispatch = useDispatch();
      return createDispatchers(dispatch);
    },

    /**
     * Use this hook to get only `places`
     * @returns
     */
    usePlacesState() {
      return {
        places: selectPlaces(useSelector),
        currentType: selectCurrentPlacesType(useSelector),
        status: selectPlacesStatus(useSelector),
        placeTypes: selectPlaceTypes(useSelector),
      };
    },
  };
})();

export const { usePlaceDetails, usePlaceDetailsActions, usePlaceDetailsState } =
  (function () {
    const createDispatchers = function (dispatch: AppDispatch) {
      return {
        fetchPlaceDetail(id: string, lang: string) {
          dispatch(placesThunks.getPlaceDetailAsync({ id, lang }));
        },

        favoritePlace(placeId: string) {
          dispatch(placesThunks.favoritePlaceAsync(placeId));
        },

        unfavoritePlace(placeId: string) {
          dispatch(placesThunks.unfavoritePlaceAsync(placeId));
        },

        visitPlace(placeId: string) {
          dispatch(placesThunks.visitPlaceAsync(placeId));
        },

        unvisitPlace(placeId: string) {
          dispatch(placesThunks.unvisitPlaceAsync(placeId));
        },

        add(placeDetails: Place) {
          dispatch(placesActions.addPlace(placeDetails));
        },

        update(placeDetails: Place) {
          dispatch(
            placesActions.updatePlace({
              id: placeDetails._id,
              placeDetails,
            })
          );
        },

        remove(id: string) {
          dispatch(placesActions.clearPlace(id));
        },
      };
    };

    const select = function (_useSelector: typeof useSelector, id: string) {
      return _useSelector((state: AppState) =>
        placesSelectors.selectPlaceDetails(state, id)
      );
    };

    return {
      /**
       * Use this hook to manage `place's details` and get actions to
       * manipulate `place's details`
       * @returns
       */
      usePlaceDetails(id: string) {
        const dispatch = useDispatch();
        const placeDetailsDispatchers = createDispatchers(dispatch);
        const place = select(useSelector, id);

        return {
          place,
          placeDetailsDispatchers,
        };
      },

      /**
       * Use this hook to get only actions, it does not affect component's
       * life cycle when `place's details` is updated
       * @returns
       */
      usePlaceDetailsActions() {
        const dispatch = useDispatch();
        return createDispatchers(dispatch);
      },

      /**
       * Use this hook to get only `place's details`
       * @returns
       */
      usePlaceDetailsState(id: string) {
        return select(useSelector, id);
      },
    };
  })();
