import { app_c, app_typo } from 'globals/styles'
import { StyleSheet } from 'react-native'

export const StarRatingStyles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  star: {
    color: '#F9BD06'
  },
  textReviews: {
    marginLeft: 5,
    color: app_c.HEX.fourth,
    ...app_typo.fonts.normal.normal.body1
  },
  textRatings: {
    marginRight: 5,
    color: app_c.HEX.fourth,
    ...app_typo.fonts.normal.normal.body1
  }
})