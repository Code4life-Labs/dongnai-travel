import AppText from "./app_text";
import AppHeader from "./app_header";
import { CircleButton, RectangleButton } from "./buttons";
import ButtonsScrollBar from "./buttons_scroll_bar";
import { AppListItem, AppOrderedList, AppUnorderedList } from "./app_list";
import TabBarIcon from "./navigation/TabBarIcon";
import Loading from "./loading";

export const FC = {
  AppText,
  AppHeader,
  CircleButton,
  RectangleButton,
  ListItem: AppListItem,
  OrderedList: AppOrderedList,
  UnorderedList: AppUnorderedList,
  TabBarIcon,
  Loading,
  ButtonsScrollBar,
};
