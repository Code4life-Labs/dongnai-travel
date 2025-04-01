import { app_typo, app_c, app_dms, app_shdw, app_sp, app_sh } from 'globals/styles'
import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  container: {
    backgroundColor: app_c.HEX.primary
  },  
  bodyFilterContainer: {
    display: 'flex',
    flexDirection: 'column',
    paddingHorizontal: 18,
    backgroundColor: app_c.HEX.primary
  },
  sectionSeclectMultipleFilterContainer: {
    flexDirection: 'column',
    marginTop: 15
  },
  sectionSeclectMultipleHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionSeclectMultipleHeaderLeft: {
    color: app_c.HEX.ext_second,
    ...app_typo.fonts.normal.bolder.h4
  },
  sectionSeclectMultipleHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  multipleHeaderRightText: {
    color: app_c.HEX.ext_second,
    ...app_typo.fonts.normal.bolder.h5,
    marginRight: 5
  },
  sectionSeclectMultipleBodyContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10
  },
  sectionSeclectMultipleBodyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    ...app_sh.rounded_16,
    backgroundColor: app_c.HEX.third,
    marginRight: 5
  },
  sectionSeclectMultipleBodySelectAll: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10
  },
  bodySelectAllText: {
    color: app_c.HEX.third,
    ...app_typo.fonts.normal.lighter.h5,
    borderWidth: 1,
    paddingVertical: 10,
    borderColor: app_c.HEX.third,
    paddingHorizontal: 10,
    ...app_sh.rounded_8,
    width: '100%',
    textAlign: 'center'
  },
  bodyItemText: {
    marginRight: 5,
    color: app_c.HEX.primary,
    ...app_typo.fonts.normal.lighter.h5,
  },
  sectionRadioList: {
    flexDirection: 'column',
    paddingLeft: 18,
  },
  sectionRadioItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5
  },
  sectionRadioItemText: {
    ...app_typo.fonts.normal.lighter.h5,
  },
  sectionRadiusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  sectionRadiusInput: {
    paddingVertical: 8,
    flex: 1,
    marginRight: 100,
    textAlign: 'center',
    ...app_sh.rounded_8,
    borderWidth: 1,
    borderColor: app_c.HEX.ext_third
  },
  sectionRadiusText: {
    color: app_c.HEX.ext_second,
    ...app_typo.fonts.normal.lighter.h4,
  },
  controlLocationBtn: {
    width: '100%',
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: app_c.HEX.third,
    ...app_sh.rounded_8,
  },
  controlLocationText: {
    color: app_c.HEX.third,
    ...app_typo.fonts.normal.lighter.h4,
  },
  btn: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: app_dms.screenWidth - 32,
    paddingVertical: 14,
    backgroundColor: app_c.HEX.fourth,
    marginTop: 20,
    marginBottom: 30,
    borderRadius: 8,
  },
  btnText: {
    ...app_typo.fonts.normal.lighter.h4,
    color: app_c.HEX.primary,
    fontWeight: '600'
  },
  saperate: {
    height: 1,
    borderBottomWidth: 1,
    width: '100%',
    borderColor: app_c.HEX.ext_third,
    marginTop: 15,
    marginBottom: 5,
    borderRadius: 2
  },
  
  headerTextFilterContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom:8,
    backgroundColor: app_c.HEX.primary,
  },
  headerTextFilter: {
    color: app_c.HEX.fourth,
    ...app_typo.fonts.normal.lighter.h1,
    marginRight: 5
  },
  rightHeaderBtnFilter: {
    paddingVertical: 5,
    paddingLeft: 10,
    paddingRight: 0
  },
  leftHeaderBtnFilter: {
    paddingVertical: 5,
    paddingLeft: 0,
    paddingRight: 10
  },
  rightHeaderBtnTextFilter: {
    color: app_c.HEX.third,
    ...app_typo.fonts.normal.bolder.h4,
    paddingVertical: 5,
  },
  coverImageMarker: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLocation: {
    position: 'absolute',
    top: 250 / 2 - 2,
    left: (app_dms.screenWidth - 36) / 2 - 20
  },
  textInput: {
    ...app_sh.rounded_8,
    borderWidth: 1,
    borderColor: app_c.HEX.ext_third,
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
})