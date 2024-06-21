import { app_c, app_dms, app_typo } from 'globals/styles'
import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  blur: {
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: app_c.HEX.primary,
    opacity: 0.6,
    position: 'absolute'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0
  },
  lottie: {
    height: app_dms.screenHeight / 5,
    width: app_dms.screenHeight / 5
  },
  textLoading: {
    ...app_typo.h2,
    color: app_c.HEX.fourth
  }
})