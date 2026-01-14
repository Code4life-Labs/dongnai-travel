import { StyleSheet } from "react-native";
import { Styles } from "@/styles";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  home_content: {
    width: "100%",
    paddingBottom: 150,
  },
  home_banner: {
    height: 200,
    width: "100%",
  },
  home_temperature: {
    width: "100%",
    ...Styles.spacings.mt_18,
    ...Styles.spacings.ph_18,
    borderRadius: 20,
    paddingBottom: 16,
  },
  category_header: {
    ...Styles.spacings.mt_12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
