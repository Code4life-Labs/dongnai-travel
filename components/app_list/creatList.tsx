import React, { Children } from "react";
import { View } from "react-native";

// Import styles
import { Styles } from "@/styles";

// Import from utils
import { ListUtils } from "./utils";

// Import types
import type {
  UListTypes,
  AppListItemProps,
  AppUnorderedListProps,
} from "./type";

/**
 * __Creator__: @NguyenAnhTuan
 *
 * Use this HOC to create list, there are 2 types of list.
 * @param type
 * @returns
 */
export function createList(type: UListTypes) {
  return function AppList({
    level = 0,
    bullets,
    style = {},
    ...props
  }: AppUnorderedListProps) {
    // Validate
    if (typeof props.children === "string") {
      console.warn("Ordered List - Chilrend's type validation - String");
      return null;
    }

    // Children is List
    if (ListUtils.isValidList(props.children)) {
      return props.children;
    }

    // Build style
    const containerStyle = [style, Styles.spacings.ps_12];

    // If children is a valid item
    if (ListUtils.isItemElement(props.children)) {
      return ListUtils.renderListItem(
        props.children as React.ReactElement,
        1,
        level,
        type,
        bullets
      );
    }

    return (
      <View style={containerStyle}>
        {(
          props.children as Array<
            React.ReactElement<AppListItemProps | AppUnorderedListProps>
          >
        ).map((item, index) => {
          if (ListUtils.isValidList(item)) {
            console.warn(
              "A List cannot be nested inside another list.",
              "You must have to wrap a List inside a ListItem"
            );
            return null;
          }
          return ListUtils.renderListItem(item, index, level, type, bullets);
        })}
      </View>
    );
  };
}
