import { StyleSheet } from 'react-native'
import { app_c, app_dms, app_shdw, app_typo } from 'globals/styles'
import { app_sh } from 'globals/styles'


const styles = StyleSheet.create({
  modal: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    backgroundColor: 'black',
    opacity: 0.2
  },
  bottomSheetContainer: {
    borderRadius: 24,
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center'
  },
  bottomView: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
  },
  textHeader: {
    ...app_typo.sz_6,
    color: app_c.HEX.fourth,
    fontWeight: '600',
    marginTop: 10
  },
  textContent: {
    fontSize: 15,
    fontWeight: '400',
    marginTop: 10,
    paddingHorizontal: 18,
    textAlign: 'center',
  },
  btn: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // width: `${Math.floor(100 * (app_dms.screenWidth - 16) / app_dms.screenWidth)}%`,
    width: app_dms.screenWidth -36,
    marginHorizontal: 18,
    paddingVertical: 14,
    backgroundColor: app_c.HEX.fourth,
    marginTop: 20,
    ...app_sh.capsule
  },
  btnText: {
    ...app_typo.sz_4,
    color: app_c.HEX.primary,
    fontWeight: '600'
  }
})

export default styles