import { StyleSheet } from "react-native";
import Constants from "expo-constants";

// Import styles
import { Styles } from "@/styles";

export const styles = StyleSheet.create({
  containerScrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingBottom: 20,
  },
  content: {
    paddingHorizontal: 18,
  },
  textHeader: {
    marginBottom: 20,
  },
  textInfo: {},
  image: {
    width: Styles.dimension.screenWidth - 18 * 2,
    height: (Styles.dimension.screenHeight * 30) / 100,
    resizeMode: "contain",
    marginBottom: 10,
  },
  textError: {
    color: "#F32424",
    marginTop: 5,
  },
  containerLabel: {
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    marginTop: 20,
  },
  labelSignin: {
    padding: 5,
  },
});
