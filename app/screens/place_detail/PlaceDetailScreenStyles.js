import { StyleSheet } from "react-native"

import { app_c, app_dms, app_sh, app_sp } from "globals/styles"

const styles = StyleSheet.create({
  pd_bottom_sheet: {
    ...app_sh.ronuded_top_right_16,
    ...app_sh.ronuded_top_left_16
  },

  pd_bottom_sheet_view: {
    flex: 1
  },

  pd_header: {
    justifyContent: 'space-between',
    ...app_sp.pb_12
  },

  pd_row: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center'
  },

  pd_tab_container: {
    flexDirection: 'row',
    ...app_sp.mb_12
  },

  pd_tab_button_active: {
    borderBottomWidth: .75,
  },

  pd_content_container: {
    width: '100%',
  },

  pd_content_article: {
    flex: 1,
    ...app_sp.mb_12
  },

  pd_content_image_row_container: {
    flex: 1,
    flexDirection: 'column'
  },

  pd_content_image_row: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  pd_content_image_button: {
    width: app_dms.screenWidth / 2,
    aspectRatio: 1,
    overflow: 'hidden'
  },

  pd_content_rr_stats_container: {
    flexDirection: 'row',
    borderBottomWidth: .75,
    ...app_sp.pb_12,
  },

  pd_content_rr_rating_point_container: {
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  pd_content_rr_chart_container: {
    flex: 1,
    justifyContent: 'space-between',
    ...app_sp.ps_22
  },

  pd_background_image: {
    // position: 'absolute',
    width: '100%',
    aspectRatio: 1,
    top: 0
  }
})

export default styles