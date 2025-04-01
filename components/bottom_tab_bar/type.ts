// Import types
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import type { ThemeData, UThemeSchemes } from "@/styles/theme";
import type { TextStyleProps, ViewStyleProps } from "@/types/style";

type TabButtonData = {
  inactive: string;
  active: string;
  isHighlight: boolean;
  size: number;
};

export type TabButtonProps = React.PropsWithChildren<{
  data: TabButtonData;
  index: number;
  routeKey: string;
  routeName: string;
  width: number;
  theme: ThemeData[UThemeSchemes];
  bottomTabBarProps: BottomTabBarProps;
  inFocusStyle?: TextStyleProps;
  outFocusStyle?: TextStyleProps;
  iconContainerStyle?: ViewStyleProps;
}>;
