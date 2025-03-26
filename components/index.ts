import AppText from "./app_text";
import AppFlatList from "./app-flat-list";
import AppHeader from "./app_header";
import { AppListItem, AppOrderedList, AppUnorderedList } from "./app_list";
import AppTabSlider from "./app_tab_slider";
import BottomTabBar from "./bottom_tab_bar";
import ButtonsScrollBar from "./buttons_scroll_bar";
import BottomSheetScroll from "./bottom_sheet/BottomSheetScroll";
import { CircleButton, RectangleButton } from "./buttons";
import CheckBoxText from "./checkbox_text";
import BlogComment from "./blog-comment";
import TabBarIcon from "./navigation/TabBarIcon";
import GlobalLoading from "./global-loading";
import HorizontalPlaceCard from "./horizontal_place_card";
import HorizontalPlaceCardSkeleton from "./horizontal_place_card/skeleton";
import HorizontalBlogCard from "./horizontal_blog_card";
import HorizontalBlogCardSkeleton from "./horizontal_blog_card/skeleton";
import Input from "./input";
import ReviewSectionPromise from "./review_section_promise";
import Speech from "./speech";
import Skeleton from "./skeleton";
import DropDown from "./drop_down";
import NoData from "./no-data";
import Search from "./search/search";
import SearchResultList from "./search/search-result-list";
import { SimpleBarChart } from "./app_chart/app_bar_chart";
import PlaceReview from "./place-review";
import TypeScrollView from "./type_scroll_view/TypeScrollView";
import { CachedImage } from "./cached_image";
import VerticalPlaceCard from "./vertical_place_card";
import VerticalPlaceCardSkeleton from "./vertical_place_card/skeleton";
import VerticalBlogCard from "./vertical_blog_card";
import VerticalBlogCardSkeleton from "./vertical_blog_card/skeleton";
import ReportCard from "./report-card";
import ReportCardSkeleton from "./report-card/skeleton";
import ReportSection from "./report-section";

export const FC = {
  AppText,
  AppHeader,
  AppFlatList,
  CircleButton,
  RectangleButton,
  ListItem: AppListItem,
  OrderedList: AppOrderedList,
  UnorderedList: AppUnorderedList,
  AppTabSlider,
  BlogComment,
  TabBarIcon,
  GlobalLoading,
  ButtonsScrollBar,
  BottomTabBar,
  BottomSheetScroll,
  CheckBoxText,
  SimpleBarChart,
  HorizontalPlaceCard,
  HorizontalBlogCard,
  Skeletons: {
    HorizontalPlaceCard: HorizontalPlaceCardSkeleton,
    HorizontalBlogCard: HorizontalBlogCardSkeleton,
    VerticalPlaceCard: VerticalPlaceCardSkeleton,
    VerticalBlogCard: VerticalBlogCardSkeleton,
    ReportCard: ReportCardSkeleton,
  },
  Input,
  ReviewSectionPromise,
  Speech,
  Skeleton,
  DropDown,
  NoData,
  Search,
  SearchResultList,
  PlaceReview,
  CachedImage,
  VerticalPlaceCard,
  VerticalBlogCard,
  TypeScrollView,
  ReportCard,
  ReportSection,
};
