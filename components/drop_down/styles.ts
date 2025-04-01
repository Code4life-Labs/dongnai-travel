import { Styles } from "@/styles";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  dropdown: {
    width: "100%",
  },
  dropdown_btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  contentContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginRight: 12,
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  dropdown_label: {
    ...Styles.typography.size.sz_16,
    fontWeight: "500",
  },
  dropdown_label_mode: {
    ...Styles.typography.fonts.normal.bolder.h5,
    paddingHorizontal: 8,
  },
  dropdownContent: {
    paddingTop: 12,
  },
  dropdown_content: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  circle_outline: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  circle: {
    height: 10,
    width: 10,
    borderRadius: 5,
  },
  option_name: {
    ...Styles.typography.size.sz_16,
  },
  paragraphContainer: {
    paddingHorizontal: 12,
  },
  paragraphTitle: {
    ...Styles.typography.fonts.normal.bolder.h5,
    paddingBottom: 4,
  },
  paragraphText: {
    ...Styles.typography.fonts.normal.normal.sub0,
  },
  divider: {
    borderBottomWidth: 1.5,
    marginTop: 12,
  },
});

export default styles;