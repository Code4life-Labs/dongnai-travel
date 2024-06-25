import { Animated } from "react-native";

// Import types
import type { ScrollView } from "react-native";
import type { ButtonsScrollBarState } from "./state";
import type {
  ButtonsScrollBarLocalData,
  ButtonContent,
  OnButtonPress,
} from "./type";

export class ButtonsScrollBarUtils {
  static handleButtonPress(
    index: number,
    content: ButtonContent,
    data: ButtonsScrollBarLocalData,
    setCurrentIndex: (arg: ((prev: number) => number) | number) => void,
    onButtonPress: OnButtonPress
  ) {
    data.isButtonPress = true;
    setCurrentIndex((prevState) => {
      data.previousIndex = prevState;
      return index;
    });
    onButtonPress(content, index);
  }

  static scrollViewToRightPosition(
    element: ScrollView | null,
    data: ButtonsScrollBarLocalData,
    state: ButtonsScrollBarState,
    animation: Animated.Value
  ) {
    if (!element) return;

    if (data.isButtonPress) {
      Animated.timing(animation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }).start();

      if (state.currentIndex === 0) {
        element.scrollTo({ x: 0, y: 0, animated: true });
      } else {
        element.scrollTo({
          x: data.scrollToXList[state.currentIndex],
          y: 0,
          animated: true,
        });
      }
    } else {
      animation.setValue(0);
    }

    data.isButtonPress = false;
  }

  static calculateScrollToCenterValue(
    scrollViewWidth: number,
    xPositionButton: number,
    buttonWidth: number,
    buttonType: any
  ) {
    const snapPosition = scrollViewWidth / 2;
    const xToSnapPositionDistance = xPositionButton - snapPosition;
    const buttonHalfWidth = buttonWidth / 2;
    let scrollValue = xToSnapPositionDistance + buttonHalfWidth;

    if (buttonType !== "underline") {
      scrollValue -= 6;
    }

    return scrollValue;
  }
}
