import { app_c, app_sh, app_typo } from 'globals/styles'
import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: app_c.HEX.fourth,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    ...app_sh.rounded_8,
    height: 48
  },
  label: {
    color: app_c.HEX.primary,
    ...app_typo.fonts.normal.bolder.h4
  }
})