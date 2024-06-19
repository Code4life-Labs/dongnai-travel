import { useSelector, useDispatch } from "react-redux";

// Import actions
import { manifoldActions } from "@/states/redux/manifold";

// Import selectors
import { manifoldSelectors } from "@/states/redux/manifold/selectors";

// Import types
import type { AppDispatch } from "@/states/redux/type";
import { current } from "@reduxjs/toolkit";

export const { useManifold, useManifoldActions, useManifoldState } =
  (function () {
    const createDispatchers = function (dispatch: AppDispatch) {
      return {
        updateCurrent(manifold: any) {
          dispatch(manifoldActions.updateCurrentManifold(manifold));
        },

        updateNotification(notification: any) {
          dispatch(manifoldActions.updateNotification(notification));
        },

        updateIsLoading(status: boolean) {
          dispatch(manifoldActions.updateIsLoading(status));
        },

        updatePrivateKeys(privateKeys: Array<string>) {
          dispatch(manifoldActions.updatePrivateKeys(privateKeys));
        },

        updateStatusBar(statusBar: any) {
          dispatch(manifoldActions.updateStatusBar(statusBar));
        },
      };
    };
    const select = function (_useSelector: typeof useSelector) {
      return {
        current: _useSelector(manifoldSelectors.selectCurrent),
      };
    };

    return {
      useManifold() {
        const dispatch = useDispatch();
        const manifoldDispatchers = createDispatchers(dispatch);
        const manifold = select(useSelector);

        return {
          manifold,
          manifoldDispatchers,
        };
      },

      useManifoldActions() {
        const dispatch = useDispatch();
        return createDispatchers(dispatch);
      },

      useManifoldState() {
        return select(useSelector);
      },
    };
  })();
