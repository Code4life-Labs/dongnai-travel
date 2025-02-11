import { LayoutAnimation } from "react-native";

// Import types
import type { NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import type { BlogsScreenStateType } from "./state";

/**
 * @NguyenAnhTuan1912
 */
export class BlogsScreenUtils {
  /**
   * Use this function to set visibility of banner
   * @param isVisible
   * @param setIsOnTop
   */
  static setBannerVisibility(
    isVisible: boolean,
    setIsOnTop: (status?: boolean) => void
  ) {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsOnTop(isVisible);
  }

  /**
   * This function handles `on scroll` event of list.
   * @param e
   * @param setIsOnTop
   */
  static handleOnScroll(
    e: NativeSyntheticEvent<NativeScrollEvent>,
    setIsOnTop: (status?: boolean) => void
  ) {
    const { contentOffset } = e.nativeEvent;
    let val = contentOffset.y;
    if (val <= 0) {
      BlogsScreenUtils.setBannerVisibility(true, setIsOnTop);
    } else {
      BlogsScreenUtils.setBannerVisibility(false, setIsOnTop);
    }
  }

  /**
   * This function handles `end reached` event of list.
   * @param localData
   */
  static handleOnEndReached(localData: BlogsScreenStateType) {
    localData.status.isEndReach = true;
  }

  /**
   * When
   * @param localData
   */
  static handleOnMomentumScrollEnd(
    localData: BlogsScreenStateType,
    places: any[] | undefined,
    getPlaces: () => void
  ) {
    if (localData.status.isEndReach) {
      if (places && places.length > 0) {
        getPlaces();
      }
    }
    localData.status.isEndReach = false;
  }
}
