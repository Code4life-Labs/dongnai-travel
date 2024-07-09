import React from "react";

// Import types
import { TwoDChartProps, ChartData } from "./type";

/**
 * Bar chart dùng để thống kê, so sánh một bộ dữ liệu đầu vào và đồ hoạ hoá dữ liệu đó ở đầu ra
 * ở dạng các thanh ngang.
 * @param Chart - which uses a 2D Data.
 * @returns
 * @NguyenAnhTuan1912
 */
export function withTwoDData<T extends TwoDChartProps>(
  Chart: (props: T & ChartData) => JSX.Element
) {
  return function (props: T) {
    const data = React.useMemo(() => {
      let indexes = [],
        values = [],
        divided = 1;

      switch (props.visualType) {
        case "nolimit": {
          divided = props.dataSet.reduce(
            (accumulator, currentValue) => accumulator + currentValue.value,
            0
          );
          break;
        }

        case "percent":
        default: {
          divided = Math.max(...props.dataSet.map((data) => data.value));
          break;
        }
      }

      for (let data of props.dataSet) {
        indexes.push(data.index);
        values.push(Math.round((data.value / divided) * 100));
      }

      return [indexes, values] as [string[], number[]];
    }, [props.dataSet, props.visualType]);

    return <Chart {...props} data={data} />;
  };
}
