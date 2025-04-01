// Import from components
import AppText from "../app_text";

// Import from utils
import { ListUtils } from "./utils";

// Import types
import type { AppListItemProps } from "./type";

/**
 * __Creator__: @NguyenAnhTuan
 *
 * Component is used to render a item of list
 * @param props
 * @returns
 */
export default function AppListItem(props: AppListItemProps) {
  if (
    Array.isArray(props.children) &&
    props.children.some(ListUtils.isValidList)
  ) {
    console.warn(
      "ListItem receives only string or List. The array of element may",
      "contains strings, elements, or list(s) is invalid"
    );
    return null;
  }

  // If props.children is a list
  if (ListUtils.isValidList(props.children)) {
    return ListUtils.increaseListLevel(
      props.children as React.ReactElement,
      props.level || 0
    );
  }

  return <AppText style={props.style}>{props.children}</AppText>;
}
