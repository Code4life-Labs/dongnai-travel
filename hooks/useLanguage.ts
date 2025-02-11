import { useSelector, useDispatch } from "react-redux";

// Import actions
import { languageActions } from "@/states/redux/language";

// Import selectors
import { languageSelectors } from "@/states/redux/language/selectors";

// Import types
import type { AppDispatch } from "@/states/redux/type";

export const { useLanguage, useLanguageActions, useLanguageState } =
  (function () {
    const createActions = function (dispatch: AppDispatch) {
      return {
        updateCode(code: string) {
          dispatch(languageActions.updateCode(code));
        },

        updateData(data: any) {
          dispatch(languageActions.updateData(data));
        },

        loadLanguage(data: any) {
          dispatch(languageActions.updateData(data));
        },
      };
    };

    const select = function (_useSelector: typeof useSelector) {
      return {
        code: _useSelector(languageSelectors.selectCode),
        data: _useSelector(languageSelectors.selectData),
      };
    };

    return {
      useLanguage() {
        const dispatch = useDispatch();
        const languageDispatchers = createActions(dispatch);
        const language = select(useSelector);

        return {
          language,
          languageDispatchers,
        };
      },

      useLanguageActions() {
        const dispatch = useDispatch();
        return createActions(dispatch);
      },

      useLanguageState() {
        return select(useSelector);
      },
    };
  })();
