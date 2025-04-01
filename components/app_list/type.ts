// Import types
import type React from "react";
import type { StyleProp, ViewStyle, TextStyle } from "react-native";

export type UListTypes = "ordered" | "unordered";

export type AppListProps = React.PropsWithChildren<{
  level?: number;
  bullets?: Array<string>;
  style?: StyleProp<ViewStyle>;
}>;

export type AppOrderedListProps = AppListProps;
export type AppUnorderedListProps = AppListProps;

export type AppListItemProps = React.PropsWithChildren<{
  level?: number;
  style?: StyleProp<TextStyle>;
}>;
