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
  const createActions = function (dispatch: AppDispatch) {
    return {
      update(id: string, briefPlace: Partial<Place>) {
        dispatch(placesActions.updateBriefPlace({ id, briefPlace }));
      },

      increaseSkipAmount() {
        dispatch(placesActions.increaseSkipBriefPlacesAmount());
      },

      decreaseSkipAmount() {
        dispatch(placesActions.decreaseSkipBriefPlacesAmount());
      },

      clear() {
        dispatch(placesActions.clearCurrentPlaces());
      },

      get(type: string = "all") {
        dispatch(placesThunks.getPlacesByTypeAsync(type));
      },
    };
  };

  const select = function (_useSelector: typeof useSelector) {
    return _useSelector(placesSelectors.selectCurrentPlaces);
  };

  return {
    /**
     * Use this hook to manage `places` and get actions to
     * manipulate `places`
     * @returns
     */
    usePlaces() {
      const dispatch = useDispatch();
      const placesActions = createActions(dispatch);
      const places = select(useSelector);

      return {
        places,
        placesActions,
      };
    },

    /**
     * Use this hook to get only actions, it does not affect component's
     * life cycle when `places` is updated
     * @returns
     */
    usePlacesActions() {
      const dispatch = useDispatch();
      return createActions(dispatch);
    },

    /**
     * Use this hook to get only `places`
     * @returns
     */
    usePlacesState() {
      return select(useSelector);
    },
  };
})();

export const { usePlaceDetails, usePlaceDetailsActions, usePlaceDetailsState } =
  (function () {
    const createActions = function (dispatch: AppDispatch) {
      return {
        add(placeDetails: Place) {
          dispatch(placesActions.addPlaceDetails(placeDetails));
        },

        update(placeDetails: Place) {
          dispatch(
            placesActions.updatePlaceDetails({
              id: placeDetails._id,
              placeDetails,
            })
          );
        },

        remove(id: string) {
          dispatch(placesActions.clearPlaceDetails(id));
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
        const placeDetailsDispatchers = createActions(dispatch);
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
        return createActions(dispatch);
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
