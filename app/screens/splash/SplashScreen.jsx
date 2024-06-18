import { View, Text, Animated } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import * as Localization from 'expo-localization';

import { withTheme } from 'hocs/withTheme';

import { useDispatch, useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'

import {
  useAuthState
} from 'customHooks/useAuth'

import { updateLanguageCode, updateData } from 'redux/language/LanguageSlice'
import { selectIsAuthenticated } from 'redux/user/UserSlice'
import { selectCurrentWareHouse } from 'redux/warehouse/WareHouseSlice'

import { languageData } from 'utilities/language'

import LottieView from 'lottie-react-native'
import { Easing } from 'react-native-reanimated'

import { styles } from './SplashScreenStyles'
import { app_c } from 'globals/styles'

const SplashScreen = withTheme(({
  theme
}) => {
  // Phuong: https://github.com/lottie-react-native/lottie-react-native#usage
  
  const navigation = useNavigation()
  const dispatch = useDispatch()

  const { isAuthenticated, isFirstTimeLaunch } = useAuthState();

  console.log("🚀 ~ file: SplashScreen.jsx:32 ~ SplashScreen ~ isAuthenticated:", isAuthenticated)
  console.log("🚀 ~ file: SplashScreen.jsx:33 ~ SplashScreen ~ isFirstTimeLaunch:", isFirstTimeLaunch)

  const [loaded, setLoaded] = useState(false)
  const opacity = useRef(new Animated.Value(0)).current
  useEffect(() => {
    const languageCode = Localization.locale.split('-')[0]
    // en or vi
    // console.log('Localization.locale', Localization.locale)
    // console.log("🚀 ~ file: SplashScreen.jsx:29 ~ useEffect ~ languageCode:", languageCode)
    dispatch(updateLanguageCode(languageCode))
    dispatch(updateData(languageData))

    setTimeout(() => {
      Animated.timing(
        opacity,
        {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
          easing: Easing.ease
        }
      ).start()
    }, 500);
    
    setTimeout(() => {
      
      setLoaded(true)
    }, 4000)
  }, [])


  useEffect(() => {
    if (loaded) {
      if (isFirstTimeLaunch)
        navigation.replace('OnboardingScreen')
      else {
        if (isAuthenticated) {
          console.log("🚀 ~ file: SplashScreen.jsx:70 ~ useEffect ~ isAuthenticated:", isAuthenticated)
          navigation.replace('GroupBottomTab', {
            isGetFullUserInfo: true
          })
        }
        else 
          navigation.replace('SigninScreen')
      }
      // navigation.replace('TestNavigator');
    }
  }, [loaded])

  const lottieViewRef = useRef(null)

  return (
    <View style={[styles.container, {backgroundColor: theme.background}]}>
      {/* <Animated.Text
        style={[styles.label, {opacity: opacity}]}
      >DongNaiTravelApp</Animated.Text> */}
      <Animated.Image
        source={require('../../assets/logo/logo_text.png')}
        style={{
          height: 400,
          width: 400,
          opacity: opacity
        }}
      />
      {/* <View>
        <LottieView
          ref={lottieViewRef}
          onLayout={() => {lottieViewRef.current?.play()}}
          loop={true}
          speed={1.6}
          style={{
            width: 200,
            height: 200,
            backgroundColor: theme.background,
          }}
          source={require('../../assets/animations/loading1.json')}
        />
      </View> */}
    </View>
  )
});

export default SplashScreen