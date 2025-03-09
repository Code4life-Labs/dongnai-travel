import { StyleSheet } from "react-native";

// Import styles
import { Styles } from "@/styles";

export const styles = StyleSheet.create({
  bd_container: {
    flex: 1,
    ...Styles.spacings.ph_18,
  },

  bd_header: {
    justifyContent: "space-between",
    borderBottomWidth: 0.75,
    ...Styles.spacings.pb_12,
  },

  bd_row: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },

  bd_content_container: {
    ...Styles.spacings.mt_22,
  },

  bd_content_article: {
    ...Styles.spacings.mb_22,
  },

  bd_content_image: {
    width: "100%",
    minHeight: 200,
    ...Styles.shapes.rounded_8,
  },

  bd_content_image_button: {
    width: Styles.dimension.screenWidth / 2,
    aspectRatio: 1,
    overflow: "hidden",
  },

  float_button_container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    position: "absolute",
    bottom: 115,
    ...Styles.spacings.ph_12,
    ...Styles.spacings.pv_6,
    ...Styles.boxShadows.type_1,
    ...Styles.shapes.capsule,
  },
  imageNoData: {
    height: 300,
    width: 300,
    alignSelf: "center",
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    // width: 42, aspectRatio: 1, borderRadius: 9999
  },
  seperate: {
    ...Styles.spacings.mh_8,
    width: 1,
    height: "50%",
    backgroundColor: "#000",
  },
});
