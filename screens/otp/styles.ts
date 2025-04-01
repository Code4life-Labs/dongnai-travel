import { StyleSheet } from "react-native";
import Constants from "expo-constants";

// Import styles
import { Styles } from "@/styles";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 18,
  },
  containerAvoidView: {
    flex: 1,
    alignItems: "center",
  },
  content: {
    paddingHorizontal: 18,
  },
  textHeader: {
    marginBottom: 0,
    alignSelf: "flex-start",
  },
  image: {
    width: Styles.dimension.screenWidth - 18 * 2,
    height: (Styles.dimension.screenHeight * 30) / 100,
    resizeMode: "contain",
    marginBottom: 10,
  },
  label: {
    marginBottom: 30,
  },
  textInput: {
    width: 0,
    height: 0,
  },
  containerInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  cellView: {
    paddingVertical: 11,
    width: 16,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 2,
  },
  cellText: {
    textAlign: "center",
  },
  bottomView: {
    justifyContent: "center",
    flexDirection: "column",
    marginTop: 30,
  },
  btnChangeEmail: {
    width: 150,
    height: 50,
    borderRadius: 10,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  textChange: {
    alignItems: "center",
  },
  btnChangeResend: {
    width: 150,
    height: 50,
    borderRadius: 10,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  textResend: {
    alignItems: "center",
  },
});
