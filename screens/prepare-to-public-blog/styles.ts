import { StyleSheet } from "react-native";

// Import styles
import { Styles } from "@/styles";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  presentationImageContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    ...Styles.shapes.rounded_8,
    ...Styles.spacings.p_18,
    ...Styles.spacings.mt_12,
  },
  textError: {
    flex: 1,
    color: "#F32424",
    marginTop: 5,
    alignSelf: "flex-start",
  },
  refreshContainer: {
    ...Styles.spacings.ph_18,
    height: 150,
    marginHorizontal: 18,
    zIndex: 4,
    borderRadius: 12,
    paddingVertical: 20,
    ...Styles.boxShadows.type_3,
    marginTop: 110,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});
