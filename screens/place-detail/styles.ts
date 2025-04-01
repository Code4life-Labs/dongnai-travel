import { StyleSheet } from "react-native";

// Import styles
import { Styles } from "@/styles";

export const styles = StyleSheet.create({
  pd_bottom_sheet: {
    ...Styles.shapes.ronuded_top_right_16,
    ...Styles.shapes.ronuded_top_left_16,
  },

  pd_bottom_sheet_view: {
    flex: 1,
  },

  pd_header: {
    justifyContent: "space-between",
    ...Styles.spacings.pb_12,
  },

  pd_row: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },

  pd_tab_container: {
    flexDirection: "row",
    ...Styles.spacings.mb_12,
  },

  pd_tab_button_active: {
    borderBottomWidth: 0.75,
  },

  pd_content_container: {
    width: "100%",
  },

  pd_content_article: {
    flex: 1,
    ...Styles.spacings.mb_12,
  },

  pd_content_image_row_container: {
    flex: 1,
    flexDirection: "column",
  },

  pd_content_image_row: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  pd_content_image_button: {
    width: Styles.dimension.screenWidth / 2,
    aspectRatio: 1,
    overflow: "hidden",
  },

  pd_content_rr_stats_container: {
    flexDirection: "row",
    ...Styles.spacings.pb_12,
  },

  pd_content_rr_rating_point_container: {
    justifyContent: "space-between",
    alignItems: "center",
  },

  pd_content_rr_chart_container: {
    flex: 1,
    justifyContent: "space-between",
    ...Styles.spacings.ps_22,
  },

  pd_background_image: {
    // position: 'absolute',
    width: "100%",
    aspectRatio: 1,
    top: 0,
  },
});
