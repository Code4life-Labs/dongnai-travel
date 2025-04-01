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
    paddingVertical: 10
  },
  sectionSeclectMultipleHeaderLeft: {
    color: app_c.HEX.fourth,
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
    marginTop: 5
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
  },
  bodySelectAllText: {
    color: app_c.HEX.ext_third,
    ...app_typo.fonts.normal.bolder.h5,
    borderWidth: 1,
    paddingVertical: 5,
    borderColor: app_c.HEX.ext_third,
    paddingHorizontal: 10,
    ...app_sh.rounded_4,
    width: '100%',
    textAlign: 'center'
  },
  bodyItemText: {
    marginRight: 5,
    color: app_c.HEX.primary,
    ...app_typo.fonts.normal.bolder.h5,
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
    color: app_c.HEX.ext_second,
    ...app_typo.fonts.normal.bolder.h5,
  },
  sectionRadiusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
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
    ...app_typo.fonts.normal.bolder.h4,
  },
  controlLocationBtn: {
    width: '100%',
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10
  },
  controlLocationText: {
    color: app_c.HEX.third,
    ...app_typo.fonts.normal.bolder.h4,
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
    ...app_typo.fonts.normal.bolder.h4,
    color: app_c.HEX.primary,
    fontWeight: '600'
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
    ...app_typo.fonts.normal.bolder.h3,
    paddingLeft: 5
  },
  rightHeaderBtnFilter: {
    paddingVertical: 5,
    paddingHorizontal: 3
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
    paddingRight: 0,
    paddingLeft: 10
  },
  cardContainer: {
    display: 'flex',
    flexDirection: 'column'
  },
  cardCategoryContain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10
  },
  cardCategoryText: {
    ...app_typo.fonts.normal.bolder.h5
  },
  saperate: {
    height: 1,
    borderBottomWidth: 1,
    width: '100%',
    borderColor: app_c.HEX.ext_third,
    borderRadius: 2
  },
})