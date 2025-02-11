import { StyleSheet } from "react-native";

// Import styles
import { Styles } from "@/styles";

const styles = StyleSheet.create({
  card: {
    flex: 1,
    flexDirection: "row",
    borderRadius: 8,
    ...Styles.spacings.p_10,
    ...Styles.spacings.mb_12,
    ...Styles.boxShadows.type_1,
  },

  card_image_container: {
    justifyContent: "flex-end",
    alignItems: "center",
    width: 145,
    height: 145,
    overflow: "hidden",
    ...Styles.shapes.rounded_4,
    ...Styles.spacings.p_10,
  },

  card_recommended_mark_container: {
    justifyContent: "center",
    ...Styles.shapes.capsule,
    ...Styles.spacings.ph_12,
    ...Styles.spacings.pv_6,
  },

  card_main_container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
  },

  card_content_container: {
    flex: 1,
    flexDirection: "column",
  },

  card_user_container: {
    alignItems: "center",
    flexDirection: "row",
    ...Styles.spacings.mb_12,
  },

  card_title: {
    flex: 1,
    flexWrap: "wrap",
    fontWeight: "bold",
  },

  car_subtitle: {},

  card_information_container: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  card_information_col: {
    flex: 1,
    flexDirection: "column",
  },

  card_buttons_container: {
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
  },

  card_share_container: {},

  card_skeleton_rectangle: {
    width: "100%",
    height: 19,
    ...Styles.shapes.rounded_4,
  },

  card_user_avatar: {
    width: 18,
    ...Styles.shapes.circle,
  },
});

export default styles;
