import { useSelector, useDispatch } from "react-redux";

// Import actions
import { manifoldActions } from "@/states/redux/manifold";

// Import selectors
import { manifoldSelectors } from "@/states/redux/manifold/selectors";

// Import types
import type { AppDispatch } from "@/states/redux/type";

export const { useStatus, useStatusActions, useStatusState } = (function () {
  const createDispatchers = function (dispatch: AppDispatch) {
    return {
      setIsLoading(status?: boolean) {
        dispatch(manifoldActions.setIsLoading(status));
      },

      setIsMaintaining(status?: boolean) {
        dispatch(manifoldActions.setIsMaintaining(status));
      },

      setIsBottomTabShown(status?: boolean) {
        dispatch(manifoldActions.setIsBottomTabShown(status));
      },

      setHasNetworkConnection(status?: boolean) {
        dispatch(manifoldActions.setHasNetworkConnection(status));
      },
    };
  };
  const select = function (_useSelector: typeof useSelector) {
    return _useSelector(manifoldSelectors.selectStatus);
  };

  return {
    useStatus() {
      const dispatch = useDispatch();
      const statusDispatchers = createDispatchers(dispatch);
      const status = select(useSelector);

      return {
        status,
        statusDispatchers,
      };
    },

    useStatusActions() {
      const dispatch = useDispatch();
      return createDispatchers(dispatch);
    },

    useStatusState() {
      return select(useSelector);
    },
  };
})();
