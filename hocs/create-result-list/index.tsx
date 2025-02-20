import { View, Pressable, StyleProp, ViewStyle } from "react-native";
import React from "react";

// Import components
import { FC } from "@/components";

// Import styles
import { Styles } from "@/styles";

// Import types
import type { UResultListPosition } from "@/components/search/search-result-list";

type SearchCreatorOptionsProps = {
  placeHolder: string;
  resultListPosition: UResultListPosition;
  keyExtractor: (item: any, index: number) => string;
  renderResultItem: (props: any) => JSX.Element;
  scrollEnabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

type ApiCallers = Array<(text: string) => Promise<any>>;

/**
 * Hàm này dùng để tạo ra một component search có kết quả trả về, nhưng sẽ cần phải cấp cho nó apis.
 * Ngoài ra thì muốn build thì import Search với SearchResultList và apis để build riêng.
 * @param {} apis Các apis cần để tìm dữ liệu search.
 * @returns
 */
export function createSearchWithResultList(apis: ApiCallers) {
  /**
   * @param {SearchCreatorOptionsProps} options Các options.
   */
  return function (options: SearchCreatorOptionsProps) {
    const [result, setResult] = React.useState([]);
    options = React.useMemo(
      () =>
        Object.assign(
          {},
          {
            placeHolder: "Search...",
            resultListPosition: "normal",
            scrollEnabled: true,
            style: [],
          },
          options
        ),
      []
    );

    if (!options.renderResultItem) {
      console.warn("Please add search result render item.");
      return null;
    }

    let hasResult = result.length >= 1;

    const handleClearResult = () => {
      setResult([]);
    };

    return (
      <>
        {hasResult && (
          <Pressable
            style={{
              flex: 1,
              width: Styles.dimension.screenWidth,
              height: Styles.dimension.screenHeight,
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 10,
            }}
            onPress={handleClearResult}
          />
        )}
        <View
          style={[
            {
              position: "relative",
              zIndex: 10,
            },
            options.style,
          ]}
        >
          <FC.Search
            apis={apis}
            placeHolder={options.placeHolder}
            callBack={(searchString, data) => {
              if (!data) return;
              setResult(data);
            }}
          />
          <FC.SearchResultList
            results={result}
            resultListPosition={options.resultListPosition}
            renderResultItem={options.renderResultItem}
            keyExtractor={options.keyExtractor}
            scrollEnabled={options.scrollEnabled}
          />
        </View>
      </>
    );
  };
}
