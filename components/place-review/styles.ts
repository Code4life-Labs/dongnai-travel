import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {},

  review_info_n_actions_container: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "relative",
    zIndex: 2,
  },

  review_author_info_container: {
    flexDirection: "row",
    alignItems: "center",
  },

  review_interact_buttons_container: {
    flexDirection: "row",
  },

  review_float_action_buttons_container: {
    position: "absolute",
    width: 120,
    right: 0,
    top: 22,
    zIndex: 5,
  },
});
