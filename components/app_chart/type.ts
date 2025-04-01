// Import types
import type { StyleProp, ViewStyle } from "react-native";
import type { UColorNames } from "@/styles/theme";
import type {
  UFontSizes,
  UFontStyles,
  UFontWeights,
} from "@/styles/typography";

export type ChartData = {
  data: [indexes: Array<string>, values: Array<number>];
};

export type TwoDChartAppearance = {
  indexUnit?: string;
  valueUnit?: string;
  levelStep?: number;
  visualType?: "nolimit" | "percent";
  labelColor?: UColorNames;
  labelSize?: UFontSizes;
  labelFontStyle?: UFontStyles;
  labelWeight?: UFontWeights;
  containerStyle?: StyleProp<ViewStyle>;
};

export type TwoDChartProps = {
  dataSet: Array<{ index: string; value: number }>;
} & TwoDChartAppearance;
