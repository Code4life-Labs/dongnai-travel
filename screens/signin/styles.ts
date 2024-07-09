import { StyleSheet } from "react-native";

// Import from styles
import { Styles } from "@/styles";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
  },
  content: {
    paddingHorizontal: 18,
  },
  textHeader: {
    marginBottom: 20,
  },
  image: {
    width: Styles.dimension.screenWidth - 18 * 2,
    height: (Styles.dimension.screenHeight * 30) / 100,
    resizeMode: "contain",
    marginBottom: 10,
  },
  text_error: {
    color: "#F32424",
  },
  container_settings: {
    display: "flex",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
  },
  textFor: {
    padding: 5,
    paddingRight: 0,
  },
  footer: {
    flex: 1,
    height: "100%",
    display: "flex",
    justifyContent: "center",
  },
  labelSocial: {
    marginTop: 5,
    textAlign: "center",
  },
  containerSocialBtn: {
    marginTop: 15,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  imageSocial: {
    height: 30,
    width: 30,
  },
  containerSignup: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 40,
    marginTop: 10,
  },
  labelNoAccount: {},
  labelSignup: {
    ...Styles.spacings.ms_8,
  },
});
