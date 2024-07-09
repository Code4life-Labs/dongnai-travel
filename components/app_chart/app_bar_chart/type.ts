// Import types
import type { TwoDChartProps, ChartData } from "../type";
import type { UColorNames } from "@/styles/theme";

export type BarChartProps = {
  barColor?: UColorNames;
  barContainerColor?: UColorNames;
} & TwoDChartProps &
  ChartData;
