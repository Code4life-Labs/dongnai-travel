import { Dimensions, Platform } from "react-native";
import Constants from "expo-constants";

export const dimension = {
  screenHeight: Dimensions.get("screen").height,
  screenWidth: Dimensions.get("screen").width,
  statusBarHeight: Constants.statusBarHeight,
};
