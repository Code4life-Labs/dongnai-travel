import { app_typo } from 'globals/styles'
import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  checkbox: {
    width: 20,
    height: 20
  },
  label: {
    marginLeft: 5,
    padding: 5,
    paddingRight: 0,
    ...app_typo.body4
  }
})