import { app_c } from 'globals/styles'
import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    borderRadius: 8,
    height: 48,
    marginTop: 20,
  },
  label: {
    paddingHorizontal: 6,
    backgroundColor: app_c.HEX.primary
  },
  input: {
    paddingHorizontal: 4,
    paddingVertical: 10,
  },
  icon: {
    padding: 4
  }
})