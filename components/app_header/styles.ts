import { StyleSheet } from "react-native";

// Import from styles
import { Styles } from "@/styles";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    height: 50,
    borderWidth: 0,
    ...Styles.spacings.ph_18,
    ...Styles.boxShadows.type_1,
  },

  header_col: {
    flex: 1,
    flexDirection: "row",
  },
});

export { styles };
