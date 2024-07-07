import { LayoutAnimation } from "react-native";

// Import types
import type { NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import type { ExploreLocalData } from "./type";

/**
 * @NguyenAnhTuan1912
 */
export class ExploreScreenUtils {
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
      ExploreScreenUtils.setBannerVisibility(true, setIsOnTop);
    } else {
      ExploreScreenUtils.setBannerVisibility(false, setIsOnTop);
    }
  }

  /**
   * This function handles `end reached` event of list.
   * @param localData
   */
  static handleOnEndReached(localData: ExploreLocalData) {
    localData.status.isEndReach = true;
  }

  /**
   * When
   * @param localData
   */
  static handleOnMomentumScrollEnd(
    localData: ExploreLocalData,
    places: any[] | undefined,
    getPlaces: () => void
  ) {
    if (localData.status.isEndReach) {
      if (places) {
        getPlaces();
      }
    }
    localData.status.isEndReach = false;
  }
}
