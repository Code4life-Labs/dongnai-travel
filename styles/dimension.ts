import { Dimensions, Platform } from "react-native";
import Constants from "expo-constants";

export const dimension = {
  screenHeight: Dimensions.get("window").height,
  screenWidth: Dimensions.get("window").width,
  statusBarHeight: Constants.statusBarHeight,
};
