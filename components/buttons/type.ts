import type { StyleProp, TextStyle } from "react-native";

// Import types
import type {
  TouchableHighlightProps,
  TouchableOpacityProps,
} from "react-native";
import type { UButtonColorTypes } from "./styles";
import type { UShapes } from "@/styles/shapes";
import type { UBoxShadowTypes } from "@/styles/boxShadows";
import type { UTouchables } from "@/utils/component";

export type $ExtendableButtonProps = {
  isActive?: boolean;
  isTransparent?: boolean;
  isOnlyContent?: boolean;
  border?: number;
  type?: UTouchables;
  defaultColor?: UButtonColorTypes;
  activeColor?: UButtonColorTypes;
  boxShadowType?: UBoxShadowTypes;
} & Omit<TouchableHighlightProps, "children"> &
  Omit<TouchableOpacityProps, "children">;

export type CircleButtonProps = {
  setIcon?:
    | JSX.Element
    | ((
        isActive: boolean,
        currentLabelStyle: StyleProp<TextStyle>
      ) => JSX.Element);
} & $ExtendableButtonProps;

export type RectangleButtonProps = {
  children?:
    | string
    | Array<JSX.Element>
    | JSX.Element
    | ((
        isActive: boolean,
        currentLabelStyle: StyleProp<TextStyle>
      ) => Array<JSX.Element> | JSX.Element);
  shape?: UShapes;
} & $ExtendableButtonProps;
