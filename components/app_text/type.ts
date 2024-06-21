import type { TextProps } from "react-native";
import type {
  UFontSizes,
  UFontStyles,
  UFontWeights,
} from "@/styles/typography";
import type { UColorNames } from "@/styles/theme";

type ToScreen = {
  screenName: string;
  params: any;
};

export type AppTextProps = {
  fontStyle?: UFontStyles;
  weight?: UFontWeights;
  size?: UFontSizes;
  color?: UColorNames;
  hyperLink?: string;
  toScreen?: ToScreen;
} & TextProps;
