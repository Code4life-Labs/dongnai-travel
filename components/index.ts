import AppText from "./app_text";
import AppHeader from "./app_header";
import { CircleButton, RectangleButton } from "./buttons";
import { AppListItem, AppOrderedList, AppUnorderedList } from "./app_list";
import TabBarIcon from "./navigation/TabBarIcon";

export const FC = {
  AppText,
  AppHeader,
  CircleButton,
  RectangleButton,
  ListItem: AppListItem,
  OrderedList: AppOrderedList,
  UnorderedList: AppUnorderedList,
  TabBarIcon,
};
