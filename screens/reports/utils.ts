import { LayoutAnimation } from "react-native";

// Import types
import type { NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import type { ReportsScreenStateType } from "./state";

/**
 * @NguyenAnhTuan1912
 */
export class ReportsScreenUtils {
  /**
   * This function handles `end reached` event of list.
   * @param localData
   */
  static handleOnEndReached(localData: ReportsScreenStateType) {
    localData.status.isEndReach = true;
  }

  /**
   * When user stops scrolling and scroll is completed, this function will be called.
   * @param localData
   */
  static handleOnMomentumScrollEnd(
    localData: ReportsScreenStateType,
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
