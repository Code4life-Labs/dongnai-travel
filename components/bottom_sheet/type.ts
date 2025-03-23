// Import types
import type { StyleProp, ViewStyle } from "react-native";

export type BottomSheetScrollProps = {
  haveHeader?: boolean;
  haveBtn?: boolean;
  haveOverlay?: boolean;
  isOpen?: boolean;
  children: React.ReactNode;
  snapPoints: Array<string | number>;
  labelBtn?: React.ReactNode;
  handleStyle?: StyleProp<ViewStyle>;
  bottomSheetStyle?: StyleProp<ViewStyle>;
  bottomSheetScrollViewStyle?: StyleProp<ViewStyle>;
  labelBtnStyle?: ViewStyle;
  childHeader?: React.ReactNode;
  close: () => void;
  handleLabelBtn: () => void;
};
