// Import types
import type { ViewStyle } from "react-native";

export type BottomSheetScrollProps = {
  haveHeader?: boolean;
  haveBtn?: boolean;
  haveOverlay?: boolean;
  isOpen?: boolean;
  children: React.ReactNode;
  snapPoints: Array<string | number>;
  labelBtn?: React.ReactNode;
  bottomSheetScrollViewStyle: ViewStyle;
  labelBtnStyle?: ViewStyle;
  childHeader?: React.ReactNode;
  close: () => void;
  handleLabelBtn: () => void;
};
