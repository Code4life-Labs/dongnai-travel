import React from "react";
import { View, Text, ViewStyle, StyleProp } from "react-native";

// Import from components
import AppText from "@/components/app_text";

// Import styles
import { theme } from "@/styles/themes";
import styles from "./styles";

// Import types
import type {
  BarChartData,
  BarChartAppearanceSettings,
  BarChartProps,
} from "./type";

/**
 * __Creator__: @NguyenAnhTuan1912
 *
 * Bar chart dùng để thống kê, so sánh một bộ dữ liệu đầu vào và đồ hoạ hoá dữ liệu đó ở đầu ra
 * ở dạng các thanh ngang.
 * @param Component - Props của component.
 * @returns
 */
function withBarChartCalculator(
  Component: (props: BarChartProps) => JSX.Element
) {
  return function ({
    indexUnit = "",
    valueUnit = "",
    levelStep = 10,
    dataSet = [],
    visualType = "percent",
    labelColor = "primary",
    labelSize = "body2",
    labelFontStyle = "normal",
    labelWeight = "normal",
    barColor = "primary",
    barContainerColor = "secondary",
    containerStyle = {},
  }: BarChartData & BarChartAppearanceSettings) {
    const data = React.useMemo(() => {
      let indexes = [],
        values = [],
        divided = 1;

      switch (visualType) {
        case "nolimit": {
          divided = dataSet.reduce(
            (accumulator, currentValue) => accumulator + currentValue.value,
            0
          );
          break;
        }

        case "percent":
        default: {
          divided = Math.max(...dataSet.map((data) => data.value));
          break;
        }
      }

      for (let data of dataSet) {
        indexes.push(data.index);
        values.push(Math.round((data.value / divided) * 100));
      }

      return [indexes, values] as [string[], number[]];
    }, [dataSet, visualType]);

    return (
      <Component
        data={data}
        indexUnit={indexUnit}
        valueUnit={valueUnit}
        levelStep={levelStep}
        barColor={barColor}
        barContainerColor={barContainerColor}
        labelColor={labelColor}
        labelSize={labelSize}
        labelFontStyle={labelFontStyle}
        labelWeight={labelWeight}
        containerStyle={containerStyle}
      />
    );
  };
}

/**
 * __Creator__: @NguyenAnhTuan1912
 *
 * Bar chart với mục đích hiển thị tất cả các dữ liệu.
 * @param props - Props của component.
 * @returns
 */
function ComplexBarChartWithoutComputing(props: BarChartProps) {
  const [indexes, values] = React.useMemo(() => props.data, [props.data]);

  return (
    <View style={[styles.container, props.containerStyle]}>
      {/* Đây là chỗ hiển thị chính */}
      <View>
        {indexes.map((data) => (
          <View></View>
        ))}
      </View>

      {/* Đây là container của trục x, bao gồm các value label và value unit */}
      <View></View>
    </View>
  );
}

/**
 * __Creator__: @NguyenAnhTuan1912
 *
 * Bar chart với mục đích hiển thị các dữ liệu đơn giản nhưng cần thiết.
 * @param props - Props của component.
 * @returns
 */
function SimpleBarChartWithoutComputing(props: BarChartProps) {
  const [indexes, values] = props.data;

  return (
    <View style={[styles.container, props.containerStyle]}>
      {/* Đây là chỗ hiển thị chính */}
      <View>
        {indexes.map((data, index) => (
          <View style={styles.bar_chart_row} key={data}>
            <View style={styles.bar_chart_label_container}>
              <AppText
                color={props.labelColor}
                size={props.labelSize}
                fontStyle={props.labelFontStyle}
                weight={props.labelWeight}
              >
                {data}
              </AppText>
            </View>
            <View
              style={[
                styles.bar_chart_container,
                { backgroundColor: props.barContainerColor },
              ]}
            >
              <View
                style={[
                  styles.bar_chart,
                  {
                    backgroundColor: props.barColor,
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

const ComplexBarChart = React.memo(
  withBarChartCalculator(ComplexBarChartWithoutComputing)
);
const SimpleBarChart = React.memo(
  withBarChartCalculator(SimpleBarChartWithoutComputing)
);

export { ComplexBarChart, SimpleBarChart };
