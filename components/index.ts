import { SimpleBarChart } from "./app_chart/app_bar_chart";
import AppText from "./app_text";
import AppHeader from "./app_header";
import { AppListItem, AppOrderedList, AppUnorderedList } from "./app_list";
import BottomTabBar from "./bottom_tab_bar";
import ButtonsScrollBar from "./buttons_scroll_bar";
import BottomSheetScroll from "./bottom_sheet/BottomSheetScroll";
import { CircleButton, RectangleButton } from "./buttons";
import CheckBoxText from "./checkbox_text";
import TabBarIcon from "./navigation/TabBarIcon";
import Loading from "./loading";
import HorizontalPlaceCard from "./horizontal_place_card";
import HorizontalPlaceCardSkeleton from "./horizontal_place_card/seleton";
import Input from "./input";

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
  BottomTabBar,
  BottomSheetScroll,
  CheckBoxText,
  SimpleBarChart,
  HorizontalPlaceCard,
  Skeletons: {
    HorizontalPlaceCard: HorizontalPlaceCardSkeleton,
  },
  Input,
};
