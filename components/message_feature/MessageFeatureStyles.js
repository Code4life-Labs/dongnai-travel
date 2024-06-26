import { app_c, app_dms, app_sh, app_shdw, app_typo } from 'globals/styles'
import { StyleSheet } from 'react-native'

const CARD_HEIGHT = 150
const CARD_WIDTH = 300 * 0.8

export const styles = StyleSheet.create({
  cardScrollView: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    ...app_shdw.type_1,
    paddingVertical: 18,
  },
  card: {
    backgroundColor: app_c.HEX.primary,
    marginHorizontal: 10,
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    overflow: 'hidden',
    ...app_sh.rounded_8,
  },
  cardImage: {
    width: '100%',
    height: 70,
    alignSelf: 'center'
  },
  imageCardDay: {
    width: 120,
    height: 120,
    borderRadius: 12,
    ...app_shdw.type_3
  },
  cardNoImage: {
    width: '100%',
    height: 70,
    alignSelf: 'center',
    backgroundColor: app_c.HEX.ext_primary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noImageText: {
    color: app_c.HEX.ext_third,
    ...app_typo.fonts.normal.bolder.h3
  },
  textContent: {
    flex: 2,
    padding: 10,
  },
  cardtitle: {
    color: app_c.HEX.fourth,
    ...app_typo.fonts.normal.bolder.h5
  },
  cardDescription: {
    marginTop: 2,
    color: app_c.HEX.fourth,
    ...app_typo.fonts.normal.normal.body2
  },
  cardDayDescription: {
    color: app_c.HEX.fourth,
    ...app_typo.fonts.normal.normal.body2,
    textAlign: 'justify'
  },
  buttonViewMap: {
    marginTop: 2,
    color: app_c.HEX.third,
    ...app_typo.fonts.normal.bolder.body2
  },
  refreshContainer: {
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 17.5,
    ...app_shdw.type_1,
    marginTop: CARD_HEIGHT / 2 - 35/2,
    marginLeft: 20,
    marginRight: 10
  },
  loadingForMap: {
    position: 'absolute',
    elevation: 99,
    zIndex: 99,
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: '#fffefe73',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionalContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    position: 'absolute',
    top: 5
  },
  iconOriDesContainer: {
    marginHorizontal: 10,
  },
  oriDesContainer: {
    flex: 1,
    height: 90
  },
  textInput: {
    ...app_sh.rounded_8,
    borderWidth: 1,
    borderColor: app_c.HEX.ext_third,
    fontSize: 14,
    height: 40
  },
  listView: {
    position: 'absolute',
    top: 40,
    ...app_shdw.type_2,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: app_c.HEX.ext_third,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  predefinedPlacesDescription: {
    ...app_typo.fonts.normal.bolder.h5,
    color: app_c.HEX.third
  },
  routeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignSelf: 'center',
    ...app_sh.rounded_8,
    backgroundColor: app_c.HEX.third,
    position: 'absolute',
    bottom: -40,
    right: '30%',
  },
  routeBtnText: {
    color: app_c.HEX.primary,
    ...app_typo.fonts.normal.bolder.h5,
  },
})