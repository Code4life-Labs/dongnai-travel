import { StyleSheet } from "react-native";

// import from styles
import { Styles } from "@/styles";

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },

  bar_chart_row: {
    flexDirection: "row",
    alignItems: "center",
  },

  bar_chart_label_container: {
    ...Styles.spacings.ph_6,
  },

  bar_chart_container: {
    flex: 1,
    height: 8,
    ...Styles.shapes.capsule,
  },

  bar_chart: {
    height: "100%",
    ...Styles.shapes.capsule,
  },
});

export default styles;
