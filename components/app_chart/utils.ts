// Import types
import type { TwoDChartProps, TwoDChartAppearance } from "./type";

/**
 * A static utils class for chart
 * @NguyenAnhTuan1912
 */
export class ChartUtils {
  /**
   * Get default appearance parameters of 2D Data Chart.
   * @param props
   * @returns
   */
  static getDefaultTwoDChartAppearance(props: TwoDChartProps) {
    const defaultAppearance: TwoDChartAppearance = {
      visualType: props.visualType ? props.visualType : "percent",
      labelSize: props.labelSize ? props.labelSize : "body2",
      labelFontStyle: "normal",
      labelWeight: "normal",
      indexUnit: "",
      valueUnit: "",
      levelStep: 10,
      labelColor: "primary",
    };

    return defaultAppearance;
  }
}
