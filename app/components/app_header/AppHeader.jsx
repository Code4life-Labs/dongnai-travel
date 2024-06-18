import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

import {
  useNavigation
} from '@react-navigation/native';
import {
  NativeStackNavigationOptions
} from '@react-navigation/native-stack'

import { useTheme } from 'customHooks/useTheme';

import { selectCurrentNotifs } from '../../redux/notifications/NotificationsSlice';
import { selectCurrentLanguage } from '../../redux/language/LanguageSlice';

import { color } from 'react-native-reanimated';

import Ionicons from 'react-native-vector-icons/Ionicons'

import AppText from '../app_text/AppText';
import CircleButton from '../buttons/CircleButton';


import styles from './AppHeaderStyles'
import { app_c, app_shdw } from 'globals/styles';
import { app_typo } from '../../globals/styles';

/**
 * @typedef ExtendedOptions
 * @property {boolean} headerTransparent [Extend Property] Thông số chỉnh transparent cho header's background.
 * @property {string} title [Extend Property] Thông số chỉnh title cho header's background.
 * @property {boolean} canBack [Extend Property] Thông số cho biết screen có thể go back hay không?
 * @property {'type_1' | 'type_2' | 'type_3' | 'type_4' | 'type_5'} boxShadowType [Extend Property] Thông số chỉnh boxShadow cho header's background.
 */

 /**
 * __Creator__: @NguyenAnhTuan1912
 * 
 * Đây sẽ là phần header của screen, mỗi screen sẽ có một header khác nhau, tuy nhiên thì cấu trúc cơ bản của nó là giống nhau.
 * Header sẽ được chia làm 3 phần, phần trái, giữa và phải. Header mặc định sẽ có một nút để back và một nút tìm kiếm.
 * @param {object} props - Props của component.
 * @param {'type_1' | 'type_2' | 'type_3' | 'type_4' | 'type_5'} [props.boxShadowType=] - Đổ bóng cho button theo loại, xem thêm trong `box-shadow.js`.
 * @param {string} props.screenName - Tên của screen.
 * @param {6 | 8 | 10 | 12 | 16 | 18 | 22} [props.marginBottom=12] - Tuỳ chỉnh margin bottom cho Header, bởi vì header sẽ cách các container dưới 1 khoảng.
 * @param {object} props.back - Dùng cho nút back.
 * @param {string} props.back.title - Header có background hay không?
 * @param {object} props.navigation - Object navigation.
 * @param {object} props.route - Thông tin về Route.
 * @param {ExtendedOptions & NativeStackNavigationOptions} props.options - [Extend NativeStackNavigationOptions] Options của screen.
 * @param {() => JSX.Element} props.setLeftPart - Function cho phép custom phần bên trái của Header.
 * @param {() => JSX.Element} props.setCenterPart - Function cho phép custom phần giữa của Header.
 * @param {() => JSX.Element} props.setRightPart - Function cho phép custom phần phải trái của Header.
 * @returns `View` component với styles
 */
const AppHeader = ({
  boxShadowType,
  screenName,
  marginBottom,
  back,
  navigation,
  route,
  options,
  setLeftPart,
  setCenterPart,
  setRightPart
}) => {
  //language
  const langCode = useSelector(selectCurrentLanguage).languageCode
  const langData = useSelector(selectCurrentLanguage).data?.appHeader
  //theme
  const { theme, themeMode } = useTheme()

  const currentNotif = useSelector(selectCurrentNotifs)
  const [numberOfVisited, setNumberOfVisited] = useState(0)

  const canSetLeftPart = typeof setLeftPart === 'function' && Boolean(setLeftPart);
  const canSetCenterPart = typeof setCenterPart === 'function' && Boolean(setCenterPart);
  const canSetRightPart = typeof setRightPart === 'function' && Boolean(setRightPart);
  const canSetBackButton = back || options?.canBack;
  const title = (
    options?.title !== "" && options?.title
    ? options?.title
    : screenName !== "" && screenName
    ? screenName
    : route.name
  )
  const transparent = options?.headerTransparent;
  const boxShadow = (
    options?.boxShadowType !== "" && options?.boxShadowType
    ? options?.boxShadowType
    : boxShadowType !== "" && boxShadowType
    ? boxShadowType
    : ""
  )
  const headerStyle = {
    ...styles.container,
    ...app_shdw.type_1,
    backgroundColor: theme.background,
    ...(transparent ?  { backgroundColor: `rgba(${255, 255, 255}, 0)` } : {} )
  }

  useEffect(() => {
    if (currentNotif.length > 0) {
      setNumberOfVisited(currentNotif.filter(notif => notif._isVisited === false).length)
    }
  }, [currentNotif, themeMode])

  return (
    <View style={[headerStyle]}>
      <View style={{...styles.header_col, justifyContent: 'flex-start', alignItems: 'center'}}>
        {/* Phần bên trái */}
        {
          canSetLeftPart
          ? setLeftPart()
          : 
          (
            canSetBackButton
            && (
              <CircleButton
                defaultColor="type_5"
                boxShadowType="type_1"
                typeOfButton="opacity"
                onPress={() => navigation.goBack()}
                setIcon={(isActive, currentLabelStyle) => (
                  <Ionicons name="chevron-back-outline" size={18} style={currentLabelStyle} />
                )}
              />
            )
          )
        }
      </View>
      {/* Phần ở giữa */}
      <View style={{...styles.header_col, justifyContent: 'center', alignItems: 'center'}}>
        {
          canSetCenterPart
          ? setCenterPart()
          : (
              <AppText weight="lighter" font="h5" style={{textAlign: 'center'}}>{title}</AppText>
            )
        }
      </View>

      {/* Phần bên phải */}
      <View style={{...styles.header_col, justifyContent: 'flex-end', alignItems: 'center'}}>
        {
          canSetRightPart
          ? setRightPart()
          : 
          (
            <>
              <CircleButton
                defaultColor="type_5"
                boxShadowType="type_1"
                typeOfButton="opacity"
                setIcon={<Ionicons name="search-outline" size={18} />}
                onPress={() => {
                  navigation.push("GlobalNavigator", { screen: "SearchScreen" });
                }}
              />
            </>
          )
        }
        {
          title === langData.home[langCode] && (
            <View style={{paddingLeft:10}}>
              <CircleButton
                defaultColor="type_5"
                boxShadowType="type_1"
                typeOfButton="opacity"
                onPress={() => navigation.navigate('Notification')}
                setIcon={<Ionicons name="notifications-sharp" size={18} style={{color: numberOfVisited !== 0 ? '#FFC72C' : null}} />}
              />
              {
                numberOfVisited > 0 &&
                <View style={{
                  height: 15,
                  width: 15,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#CE2029',
                  borderRadius: 7.5,
                  position: 'absolute',
                  right: 0,
                  top: 0,
                }}>
                  <AppText style={{
                    fontSize: 10
                  }}>{numberOfVisited}</AppText>
                </View>
              }
            </View>
          )
        }
      </View>
    </View>
  )
}

export default AppHeader