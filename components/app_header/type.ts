import type {
  BottomTabHeaderProps,
  BottomTabNavigationOptions,
} from "@react-navigation/bottom-tabs";
import type {
  NativeStackHeaderProps,
  NativeStackNavigationOptions,
} from "@react-navigation/native-stack";

// Import types
import type { UBoxShadowTypes } from "@/styles/boxShadows";

type $Extendable = {
  boxShadowType?: UBoxShadowTypes;
  screenName?: string;
  marginBottom?: number;
  setLeftPart?: () => JSX.Element;
  setCenterPart?: () => JSX.Element;
  setRightPart?: () => JSX.Element;
};

export type ExtendedTabHeaderOptions = {
  isTransparent?: boolean;
} & BottomTabNavigationOptions;

export type ExtendedStackHeaderOptions = {
  isTransparent?: boolean;
} & NativeStackNavigationOptions;

export type AppTabHeaderProps = {
  options: ExtendedTabHeaderOptions;
} & $Extendable &
  BottomTabHeaderProps;

export type AppStackHeaderProps = {
  options: ExtendedStackHeaderOptions;
} & $Extendable &
  NativeStackHeaderProps;
