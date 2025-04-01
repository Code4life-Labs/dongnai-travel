import { StyleSheet } from "react-native";

// Import from styles
import { Styles } from "@/styles";

export const styles = StyleSheet.create({
  slider_container: {
    flex: 1,
    width: "100%",
    backgroundColor: "red",
  },

  slider_button_container: {
    flexGrow: 0,
    flexDirection: "row",
    ...Styles.spacings.mb_12,
  },

  line_index: {
    width: "100%",
    height: 2,
  },

  slide_container: {
    flex: 1,
    flexGrow: 1,
  },
});
