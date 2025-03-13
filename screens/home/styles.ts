import { StyleSheet } from "react-native";
import { Styles } from "@/styles";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Styles.theme.colorNames.primary,
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
    paddingHorizontal: 10,
    ...Styles.spacings.mt_18,
    // ...Styles.boxShadows.type_4,
    borderRadius: 20,
    // backgroundColor: "gray",
    // elevation: 3,
  },
  temperature: {
    width: "100%",
    height: 140,
    flexDirection: "row",
    // ...Styles.boxShadows.type_4,
    justifyContent: "center",
    gap: 20,
    alignItems: "center",
  },
  temperature_degrees: {
    width: Styles.dimension.screenWidth * 0.3,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  temperature_degrees_icon: {
    width: 60,
    height: 60,
  },
  temperature_degrees_info: {
    ...Styles.typography.size.sz_12,
    color: Styles.theme.colorNames.onPrimary,
  },
  temperature_other_info: {
    width: Styles.dimension.screenWidth * 0.7 - 32,
    height: 70,
    ...Styles.spacings.mt_16,
  },
  temperature_other_info_half: {
    height: 30,
    marginBottom: 5,
    marginTop: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  temperature_other_info_quarter: {
    flexDirection: "row",
  },
  temperature_reload: {
    width: Styles.dimension.screenWidth * 0.17,
    height: Styles.dimension.screenWidth * 0.17,
    backgroundColor: Styles.theme.colorNames.tertiary,
    justifyContent: "center",
    alignItems: "center",
    ...Styles.boxShadows.type_1,
  },
  item: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  category_header: {
    ...Styles.spacings.mt_12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // paddingHorizontal:16,
    paddingLeft: 16,
  },
  category_name: {
    ...Styles.typography.size.sz_12,
  },
  category_option_list: {
    ...Styles.spacings.mt_12,
  },
  category_list_item: {
    ...Styles.spacings.mt_12,
  },

  // place home
  place_container: {
    width: "100%",
    paddingHorizontal: 16,
    backgroundColor: "gray",
  },
  place_header: {
    ...Styles.spacings.mt_12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  place_header_title: {
    width: 140,
  },
  place_list: {
    gap: 5,
    paddingHorizontal: 0,
    flexDirection: "row",
  },
  place_list_item: {
    width: 130,
    height: 150,
  },
});
