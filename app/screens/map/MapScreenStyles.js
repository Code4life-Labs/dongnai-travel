import Constants from 'expo-constants'
import { app_c, app_dms, app_sh, app_shdw, app_sp, app_typo } from 'globals/styles'
import { StyleSheet } from 'react-native'


const CARD_HEIGHT = 240
const CARD_WIDTH = app_dms.screenWidth * 0.8

export const styles = StyleSheet.create({
  headerBox: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 10,
    marginTop: -15,
    // marginTop: 20,
    width: '100%',
    backgroundColor: app_c.HEX.primary,
  },
  headerText: {
    color: app_c.HEX.fourth,
    marginTop: 10,
    // marginTop: 15,
    ...app_typo.fonts.normal.bolder.h3
  },
  map: {
    flex: 1,
  },
  seachTypeContainer: {
    position: 'absolute',
    top: (18),
    width: '100%',
  },
  searchContainer: {
    marginHorizontal: 18,
    backgroundColor: app_c.HEX.primary,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    ...app_sh.rounded_8,
    ...app_shdw.type_1
  },
  iconSearch: {
    position: 'absolute',
    top: 100
  },
  buttonRoute: {
    backgroundColor: '#bbb',
    paddingVertical: 12,
    marginTop: 16,
    borderRadius: 4,
  },
  buttonText: {
    textAlign: 'center',
  },
  tagContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    marginRight: 10,
    height: 30,
    ...app_shdw.type_1
  },
  tagText: {
    color: '#112D4E',
    padding: 5,
    paddingHorizontal: 15
  },
  tagList: {
    paddingLeft: 18,
    position: 'absolute',
    top: 85,
  },
  cardScrollView: {
    position: 'absolute',
    left: 0,
    right: 0,
    ...app_shdw.type_1,
    paddingVertical: 18,

  },
  refreshContainer: {
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 17.5,
    ...app_shdw.type_1,
    marginTop: CARD_HEIGHT / 2 - 35/2,
    marginLeft: 10
  },
  endPadding: {
    paddingRight: app_dms.screenWidth - CARD_WIDTH,
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
    height: 135,
    alignSelf: 'center'
  },
  cardNoImage: {
    width: '100%',
    height: 140,
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
  markerWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
  },
  marker: {
    width: 30,
    height: 30,
  },
  button: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5
  },
  scrollPlaceBtn: {
    width: '49%',
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: app_c.HEX.third,
    borderWidth: 1,
    ...app_sh.rounded_4,
  },
  textSign: {
    fontSize: 14,
    fontWeight: 'bold',
    color: app_c.HEX.third
  },
  besideBtn: {
    position: 'absolute',
    right: 0
  },
  circleBtn: {
    width: 50,
    height: 50,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginRight: 18,
    ...app_shdw.type_2
  },
  overlayBtn: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0
  },
  headerBottomSheet: {
    color: app_c.HEX.fourth,
    ...app_typo.fonts.normal.lighter.h1,
    paddingTop: 15,
    paddingLeft: 18,
    paddingBottom: 10,
    width: app_dms.screenWidth - 36
  },
  contentContainer: {
    paddingHorizontal: 18
  },
  starRating: {
    marginBottom: 5,
  },
  typeTimeContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 5
  },
  textTypeContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: app_c.HEX.third,
    marginRight: 5,
    marginBottom: 5,
    ...app_sh.rounded_4
  },
  textType: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    color: app_c.HEX.primary,
    ...app_typo.fonts.normal.lighter.h5
  },  
  timeContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  textTimeDirection: {
    marginLeft: 5,
    color: app_c.HEX.ext_second,
    ...app_typo.fonts.normal.normal.body1
  },
  dropDownContainer: {
    overflow: 'hidden',
  },
  statusTimeContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2
  },
  textStatus: {
    ...app_typo.fonts.normal.bolder.h5,
    fontSize: 14
  },
  textTimeOpen: {
    color: app_c.HEX.ext_second,
    ...app_typo.fonts.normal.normal.body1,
    marginRight: 5
  },
  controlListContainer:{
    paddingHorizontal: 18,
    marginTop: 5,
    marginBottom: 20
  },
  controlContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    marginRight: 10,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderWidth:1,
    borderColor: app_c.HEX.third,
  },
  controlText: {
    marginLeft: 10,
    ...app_typo.fonts.normal.normal.body1,
  },
  imgListContainer:{
    paddingHorizontal: 18,
    marginTop: 20
  },
  containerImg: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  imgBigger: {
    ...app_sh.rounded_8,
    height: '100%',
    width: app_dms.screenWidth * 0.7,
  },
  containerImgSmaller: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: 10,
    overflow: 'hidden',
  }, 
  imgSmaller: {
    width: 155,
    aspectRatio: 1,
    ...app_sh.rounded_8
  },
  imgEmply: {
    width: 155,
    height: 155,
    ...app_sh.rounded_8,
    backgroundColor: 'transparent',
  },
  imgEmplyGray: {
    width: 155,
    height: 155,
    ...app_sh.rounded_8,
    backgroundColor: app_c.HEX.ext_primary,
  },
  formattedAddress: {
    paddingHorizontal: 18,
    color: app_c.HEX.ext_second,
    ...app_typo.fonts.normal.normal.body1,
    marginBottom: 5
  },
  weatherText: {
    paddingLeft: 18,
    color: app_c.HEX.third,
    ...app_typo.fonts.normal.bolder.h5,
    marginBottom: 5
  },
  openHoursContainer: {
    display: 'flex',
    flexDirection: 'column'
  },
  weekdayTextContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 5,
    alignItems: 'center'
  },
  weekdayTextCell: {
    flex: 3
  },
  weekdayText: {
    color: app_c.HEX.ext_second,
    ...app_typo.fonts.normal.normal.body1,
  },
  spaceForWeekdayText: {
    flex: 4
  },
  headerReview: {
    paddingHorizontal: 18,
    color: app_c.HEX.ext_second,
    ...app_typo.fonts.normal.bolder.h3,
    marginTop: 20
  },
  containerRouteInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: 18,
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    backgroundColor: 'white',
    ...app_shdw.type_2
  },
  backbtn: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: app_c.HEX.primary,
    position: 'absolute',
    ...app_shdw.type_2,
    left: 18,
    top: 0
  },
  settingBtn: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: app_c.HEX.primary,
    position: 'absolute',
    ...app_shdw.type_2,
    right: 18,
    top: 0
  },
  iconBack: {
    marginLeft: 8,
  },
  headerRouteInfo: {
    color: app_c.HEX.ext_second,
    ...app_typo.fonts.normal.bolder.h4,
    marginTop: 10
  },
  frameRouteInfo: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: 130,
    borderWidth: 1,
    borderColor: app_c.HEX.ext_third,
    ...app_sh.rounded_8,
    overflow: 'hidden',
    // paddingHorizontal: 18,
    marginVertical: 18
  },
  changeOriDes: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: app_c.HEX.primary,
    position: 'absolute',
    right: -20,
    ...app_shdw.type_2
  },  
  leftContainerFrame: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    borderBottomRightRadius: 200,
    borderTopRightRadius: 200,
    borderStyle: 'dashed',
    borderWidth: 1,
    height: '110%',
    width: app_dms.screenWidth * 40 / 100,
    marginLeft: -2,
    paddingLeft: 14,
    paddingRight: 12,
    borderColor: app_c.HEX.ext_second,
    borderWidth: 1
  },
  originText: {
    color: app_c.HEX.ext_second,
    ...app_typo.fonts.normal.bolder.h4,
    textDecorationLine: 'underline',
    paddingRight: 10
  },
  toText: {
    color: app_c.HEX.ext_second,
    ...app_typo.fonts.normal.normal.body0,
    marginVertical: 5
  },
  detinationText: {
    color: app_c.HEX.ext_second,
    ...app_typo.fonts.normal.bolder.h4,
    textDecorationLine: 'underline',
    paddingRight: 10

  },
  rightContainerFrame: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingRight: 0
  },
  rightContainerFrameInto: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15
  },
  routeInfoTimeContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeInfoUnixTime: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginRight: 8,
  },
  routeInfoNumberTime: {
    color: app_c.HEX.ext_second,
    ...app_typo.fonts.normal.bolder.h3,
  },
  routeInfoTextTime: {
    color: app_c.HEX.ext_second,
    ...app_typo.fonts.normal.normal.body1,
  },
  routeInfoTranportContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  routeInfoTranport: {
    color: app_c.HEX.ext_second,
    ...app_typo.fonts.normal.bolder.h3,
  },
  distanceText: {
    color: app_c.HEX.ext_second,
    ...app_typo.fonts.normal.bolder.h5,
    marginRight: 15
  },
  routeInfoTextTranport: {
    color: app_c.HEX.ext_second,
    ...app_typo.fonts.normal.normal.body1,
  },
  containerBtnOptionRoute: {
    flexDirection: 'row',
    width: '100%',
    paddingRight: 12
  },
  btnStart: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    ...app_sh.rounded_4,
    backgroundColor: app_c.HEX.third,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textStart: {
    color: app_c.HEX.primary,
    ...app_typo.fonts.normal.lighter.h5,
    fontSize: 13,
    marginRight: 5
  },
  optionalContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 18,
    marginBottom: 50,
  },
  iconOriDesContainer: {
    marginRight: 10
  },
  oriDesContainer: {
    flex: 1,
    height: 100
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
  tagContainerTrans: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    marginRight: 10,
    height: 32,
    ...app_shdw.type_1,
  },
  tagTextTrans: {
    color: '#112D4E',
    padding: 5,
    paddingRight: 15,
  },
  tagListTrans: {
    paddingLeft: 18,
    position: 'absolute',
    top: 205,
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
    paddingHorizontal: 3
  },
  rightHeaderBtnTextFilter: {
    color: app_c.HEX.third,
    ...app_typo.fonts.normal.bolder.h4
  },
  headerBottomSheetDirection: {
    paddingBottom: 10,
    paddingHorizontal: 18,
  },
  timeBottomSheetDirection: {
    color: app_c.HEX.ext_second,
    ...app_typo.fonts.normal.bolder.h3,
    marginTop: 3,
  },
  titleBottomSheetDirection: {
    color: app_c.HEX.fourth,
    ...app_typo.fonts.normal.bolder.h2,
  },
  warningContainerBottomSheetDirection: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10
},
  warningBottomSheetDirection: {
    color: app_c.HEX.ext_second,
    ...app_typo.fonts.normal.bolder.h5,
    marginLeft: 10
  },
  containerDirections: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingVertical: 20
  },
  containerTextDirections: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    flex: 0.8,
    textAlign: 'justify',
    paddingHorizontal: 18
  },
  tilteDirections: {
    color: app_c.HEX.fourth,
    ...app_typo.fonts.normal.bolder.h4,
  },
  descDirections: {
    color: app_c.HEX.ext_second,
    ...app_typo.fonts.normal.normal.body1,
    marginTop: 5
  },
  timeContainerDirections: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5
  },
  timecDirections: {
    color: app_c.HEX.ext_second,
    ...app_typo.fonts.normal.bolder.h5,
  },
  discDirections: {
    color: app_c.HEX.ext_second,
    ...app_typo.fonts.normal.bolder.h5,
  },
  containerIconDirection: {
    flex: 0.2,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextFilterContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingBottom:8,
    backgroundColor: app_c.HEX.primary,
  },
  headerTextFilter: {
    color: app_c.HEX.fourth,
    ...app_typo.fonts.normal.lighter.h1,
    marginRight: 25
  },
  rightHeaderBtnFilter: {
  },
  leftHeaderBtnFilter: {
  },
  rightHeaderBtnTextFilter: {
    color: app_c.HEX.third,
    ...app_typo.fonts.normal.bolder.h4,
  },
  titleBottomSheet:{
    color: app_c.HEX.ext_second,
    ...app_typo.fonts.normal.bolder.h4,
    marginBottom: 10
  },
  saperate: {
    height: 1,
    borderBottomWidth: 1,
    width: '100%',
    borderColor: app_c.HEX.ext_third,
    marginTop: 15,
    marginBottom: 5,
    borderRadius: 2
  }
  
})