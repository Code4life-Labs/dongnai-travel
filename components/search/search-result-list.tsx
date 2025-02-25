import { View, Text, FlatList } from "react-native";
import React from "react";

// Import hooks
import { useTheme } from "@/hooks/useTheme";

// Import styles
import { Styles } from "@/styles";

export type UResultListPosition = "normal" | "float-top" | "float-bottom";

export type SearchResultListProps = {
  results: any;
  resultListPosition: UResultListPosition;
  renderResultItem: (item: any) => JSX.Element;
  keyExtractor: (item: any, index: number) => string;
  scrollEnabled?: boolean;
};

/**
 * __Component này cần phải build trước__
 *
 * Component này dùng để render ra danh sách kết quả tìm kiếm.
 * @param props Props của component.
 * @returns
 */
export default function SearchResultList(props: SearchResultListProps) {
  const { theme } = useTheme();

  let position =
    props.resultListPosition === "float-top"
      ? {
          bottom: "100%",
          ...Styles.spacings.mb_12,
        }
      : props.resultListPosition === "float-bottom"
        ? {
            top: "100%",
            ...Styles.spacings.mt_12,
          }
        : {
            ...Styles.spacings.mt_12,
          };

  if (props.resultListPosition !== "normal") {
    position = {
      ...position,
      ...Styles.boxShadows.type_3,
      position: "absolute",
      maxHeight: 240,
    } as any;
  }

  return (
    <View
      style={[
        {
          backgroundColor: theme.primary,
          width: "100%",
          zIndex: 10,
        },
        position as any,
        Styles.shapes.rounded_8,
      ]}
    >
      <FlatList
        style={{
          position: "relative",
          width: "100%",
        }}
        contentContainerStyle={{
          justifyContent: "flex-end",
        }}
        data={props.results}
        renderItem={({ item }) => props.renderResultItem(item)}
        keyExtractor={(item, index) => props.keyExtractor(item, index)}
        scrollEnabled={props.scrollEnabled}
      />
    </View>
  );
}
