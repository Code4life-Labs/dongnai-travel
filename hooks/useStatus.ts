import { useSelector, useDispatch } from "react-redux";

// Import actions
import { manifoldActions } from "@/states/redux/manifold";

// Import selectors
import { manifoldSelectors } from "@/states/redux/manifold/selectors";

// Import types
import type { AppDispatch } from "@/states/redux/type";

export const { useStatus, useStatusActions, useStatusState } = (function () {
  const createActions = function (dispatch: AppDispatch) {
    return {
      updateIsLoading(status: boolean) {
        dispatch(manifoldActions.updateIsLoading(status));
      },

      updateIsMaintaining(notification: any) {
        dispatch(manifoldActions.updateIsMaintaining(notification));
      },

      updateHasNetworkConnection(status: boolean) {
        dispatch(manifoldActions.updateHasNetworkConnection(status));
      },
    };
  };
  const select = function (_useSelector: typeof useSelector) {
    return _useSelector(manifoldSelectors.selectStatus);
  };

  return {
    useStatus() {
      const dispatch = useDispatch();
      const statusDispatchers = createActions(dispatch);
      const status = select(useSelector);

      return {
        status,
        statusDispatchers,
      };
    },

    useStatusActions() {
      const dispatch = useDispatch();
      return createActions(dispatch);
    },

    useStatusState() {
      return select(useSelector);
    },
  };
})();
