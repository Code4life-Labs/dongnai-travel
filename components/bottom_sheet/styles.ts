import { StyleSheet } from "react-native";

// Import styles
import { Styles } from "@/styles";

export const styles = StyleSheet.create({
  modal: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    backgroundColor: "black",
    opacity: 0.2,
  },
  bottomSheetContainer: {
    borderRadius: 24,
    ...Styles.boxShadows.type_4,
  },
  contentContainer: {
    width: "100%",
    alignItems: "center",
  },
  bottomView: {
    paddingHorizontal: 18,
  },
  textHeader: {
    // ...app_typo.sz_6,
    fontWeight: "600",
    marginTop: 10,
  },
  textContent: {
    fontSize: 15,
    fontWeight: "400",
    marginTop: 10,
    paddingHorizontal: 18,
    textAlign: "center",
  },
  btn: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    marginBottom: 30,
    borderRadius: 8,
    ...Styles.spacings.mt_22,
  },
  btnText: {},
  headerText: {
    // ...app_typo.fonts.normal.bolder.h4,
    marginTop: 20,
  },
  paragraph: {
    marginTop: 10,
    textAlign: "justify",
  },
  childContentContainer: {
    display: "flex",
    flexDirection: "row",
    marginTop: 10,
    paddingLeft: 10,
  },
  childContent: {
    marginLeft: 10,
  },
});
