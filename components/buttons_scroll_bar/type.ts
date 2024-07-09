// Import types
import type { Animated } from "react-native";
import type { ViewStyleProps } from "@/types/style";
import type { UShapes } from "@/styles/shapes";
import type { ThemeData, UThemeSchemes } from "@/styles/theme";

export type ButtonContent = {
  label: string;
  value: string;
};

export interface OnButtonPress {
  (content: ButtonContent, index: number): void;
}

export type ButtonsScrollBarLocalData = {
  scrollToXList: Array<number>;
  previousIndex: number;
  buttonScrollContainerWidth: number;
  isButtonPress: boolean;
};

export type ButtonsScrollBarProps = {
  buttonContents: Array<ButtonContent>;
  lineIndexTranslateXStart?: number;
  scrollStyle?: ViewStyleProps;
  containerStyle?: ViewStyleProps;
  buttonType?: UShapes | "underline";
  onButtonPress: OnButtonPress;
};

export type UnderlineButtonProps = {
  index: number;
  currentIndex: number;
  content: ButtonContent;
  animation: Animated.Value;
  buttonsScrollBarData: ButtonsScrollBarLocalData;
  theme: ThemeData[UThemeSchemes];
  onButtonPress: OnButtonPress;
  setCurrentIndex: (arg: ((prev: number) => number) | number) => void;
};
