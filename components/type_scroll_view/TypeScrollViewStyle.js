import { StyleSheet } from "react-native"

import { app_sp, app_c, app_dms } from "globals/styles";

const styles = StyleSheet.create({
  slider_container: {
    flex: 1,
    width: '100%'
  },

  slider_button_container: {
    flexGrow: 0,
    flexDirection: 'row',
    ...app_sp.mb_12
  },

  line_index: {
    width: '100%',
    height: 1
  },

  slide_container: {
    flex: 1,
    flexGrow: 1
  }
});

export default styles