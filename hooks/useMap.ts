import { useSelector, useDispatch } from "react-redux";

// Import actions
import { mapActions } from "@/states/redux/map";

// Import selectors
import { mapSelectors } from "@/states/redux/map/selectors";

// Import types
import type { AppDispatch } from "@/states/redux/type";

export const { useMap, useMapActions, useMapState } = (function () {
  const createDispatchers = function (dispatch: AppDispatch) {
    return {
      updateCurrent(map: any) {
        dispatch(mapActions.updateCurrentMap(map));
      },

      updatePlaces(places: Array<any>) {
        dispatch(mapActions.updateCurrentMap(places));
      },

      updateRoutes(routes: Array<any>) {
        dispatch(mapActions.updateCurrentMap(routes));
      },

      updateSuggestions(suggestions: Array<any>) {
        dispatch(mapActions.updateCurrentMap(suggestions));
      },

      updateTypes(types: Array<any>) {
        dispatch(mapActions.updateCurrentMap(types));
      },

      updateDetails(details: any) {
        dispatch(mapActions.updateCurrentMap(details));
      },

      updateUserLocation(userLocation: any) {
        dispatch(mapActions.updateCurrentMap(userLocation));
      },
    };
  };

  const select = function (_useSelector: typeof useSelector) {
    return {
      current: _useSelector(mapSelectors.selectCurrent),
    };
  };

  return {
    useMap() {
      const dispatch = useDispatch();
      const mapDispatchers = createDispatchers(dispatch);
      const map = select(useSelector);

      return {
        map,
        mapDispatchers,
      };
    },

    useMapActions() {
      const dispatch = useDispatch();
      return createDispatchers(dispatch);
    },

    useMapState() {
      return select(useSelector);
    },
  };
})();
