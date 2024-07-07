import React from "react";
import { View } from "react-native";

// Import from components
import AppText from "@/components/app_text";

// Import local
// Import styles
import styles from "./styles";

// Import utils
import { ChartUtils } from "../utils";

// Import types
import type { BarChartProps } from "./type";

/**
 * Bar chart với mục đích hiển thị các dữ liệu đơn giản nhưng cần thiết.
 * @param props - Props của component.
 * @returns
 * @NguyenAnhTuan1912
 */
export default function _SimpleBarChart(props: BarChartProps) {
  const [indexes, values] = props.data;
  const appearance = ChartUtils.getDefaultTwoDChartAppearance(
    props
  ) as BarChartProps;

  appearance.barColor = "primary";
  appearance.barContainerColor = "primary";

  return (
    <View style={[styles.container, appearance.containerStyle]}>
      {/* Đây là chỗ hiển thị chính */}
      <View>
        {indexes.map((data, index) => (
          <View style={styles.bar_chart_row} key={data}>
            <View style={styles.bar_chart_label_container}>
              <AppText
                color={appearance.labelColor}
                size={appearance.labelSize}
                fontStyle={appearance.labelFontStyle}
                weight={appearance.labelWeight}
              >
                {data}
              </AppText>
            </View>
            <View
              style={[
                styles.bar_chart_container,
                { backgroundColor: appearance.barContainerColor },
              ]}
            >
              <View
                style={[
                  styles.bar_chart,
                  {
                    backgroundColor: appearance.barColor,
                    width: `${values[index]}%`,
                  },
                ]}
              ></View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
