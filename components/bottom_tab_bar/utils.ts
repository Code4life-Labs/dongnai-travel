import { Animated } from "react-native";

// Import from styles
import { Styles } from "@/styles";

export class BottomTabBarUtils {
  /**
   * Use this static method to create parameters for animation
   * of dot translation.
   * @param buttonContainerWidth
   * @param buttonCounts
   * @param dotWidth
   * @returns
   * @NguyenAnhTuan1912
   */
  static calculatDotTranslationParams(
    buttonContainerWidth: number,
    buttonCounts: number,
    dotWidth: number,
    horizontalPaddingAmount: number,
    leftAmount: number
  ) {
    const bottomBarWidth = Styles.dimension.screenWidth - leftAmount * 2;
    const tabButtonsContainerWidth =
      bottomBarWidth - horizontalPaddingAmount * 2;
    const tabButtonSpaceWidth =
      (tabButtonsContainerWidth - buttonContainerWidth * buttonCounts) /
      (buttonCounts - 1);
    const centerDotDistance = buttonContainerWidth / 2 - dotWidth / 2;
    const dotMovementDistance =
      tabButtonSpaceWidth +
      centerDotDistance +
      (buttonContainerWidth - centerDotDistance);

    return { dotMovementDistance, centerDotDistance };
  }

  static runDotMovementAnimation(
    animation: Animated.Value,
    index: number,
    dotMovementDistance: number,
    centerDotDistance: number
  ) {
    Animated.spring(animation, {
      toValue: dotMovementDistance * index + centerDotDistance,
      useNativeDriver: true,
    }).start();
  }
}
