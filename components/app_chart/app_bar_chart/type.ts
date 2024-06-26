import type { StyleProp, ViewStyle } from "react-native";

// Import types
import type { UColorNames } from "@/styles/themes";
import type {
  UFontSizes,
  UFontStyles,
  UFontWeights,
} from "@/styles/typography";

export type BarChartData = {
  indexUnit: string;
  valueUnit: string;
  levelStep: number;
  dataSet: Array<{ index: string; value: number }>;
};

export type BarChartAppearanceSettings = {
  visualType: "nolimit" | "percent";
  labelColor: UColorNames;
  labelSize: UFontSizes;
  labelFontStyle: UFontStyles;
  labelWeight: UFontWeights;
  barColor: UColorNames;
  barContainerColor: UColorNames;
  containerStyle: StyleProp<ViewStyle>;
};

export type BarChartProps = {
  indexUnit: string;
  valueUnit: string;
  levelStep: number;
  data: [indexes: Array<string>, values: Array<number>];
  labelColor: UColorNames;
  labelSize: UFontSizes;
  labelFontStyle: UFontStyles;
  labelWeight: UFontWeights;
  barColor: UColorNames;
  barContainerColor: UColorNames;
  containerStyle: StyleProp<ViewStyle>;
};
