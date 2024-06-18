import { app_c, app_dms, app_typo } from 'globals/styles'
import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  
  seperate: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: app_c.HEX.ext_primary,
    marginVertical: 10
  },
  contentContainer: {
    // paddingHorizontal: 18
  },
  authenContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 45,
    height: 45,
    marginRight: 10
  },
  nameAuthorRatingContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  authorName: {
    color: app_c.HEX.ext_second,
    ...app_typo.fonts.normal.bolder.h5,
    marginBottom: 3
  },
  textContent: {
    marginTop: 10,
    color: app_c.HEX.fourth,
    ...app_typo.fonts.normal.normal.body1
  },
})