import type { NavigationProp } from "@react-navigation/native";
import type { Route } from "@react-navigation/native";
import type { NativeStackNavigationOptions } from "react-native-screens/lib/typescript/native-stack/types";

// Import types
import type { UBoxShadowTypes } from "@/styles/boxShadows";

export type ExtendedOptions = {
  isTransparent: boolean;
  title: string;
  canBack: boolean;
  boxShadowType: UBoxShadowTypes;
} & NativeStackNavigationOptions;

export type AppHeaderProps = {
  boxShadowType: UBoxShadowTypes;
  screenName: string;
  marginBottom: number;
  back: { title: string };
  navigation: NavigationProp<any>;
  route: Route<string, any>;
  options: ExtendedOptions;
  setLeftPart: () => JSX.Element;
  setCenterPart: () => JSX.Element;
  setRightPart: () => JSX.Element;
};
