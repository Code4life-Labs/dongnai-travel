import { useSelector, useDispatch } from "react-redux";

// Import reduce slice's actions
import { themeActions } from "@/states/redux/theme";

// Import reduce slice's selectors
import { themeSelectors } from "@/states/redux/theme/selectors";

/**
 * Hook này trả về `theme` và `toggleTheme`
 * @returns
 */
export function useTheme() {
  const theme = useSelector(themeSelectors.selectCurrentScheme);
  const currentScheme = useSelector(themeSelectors.selectMode);
  const dispatch = useDispatch();

  return {
    theme,
    currentScheme,
    toggleTheme: function () {
      return dispatch(themeActions.toggleThemeState());
    },
  };
}
