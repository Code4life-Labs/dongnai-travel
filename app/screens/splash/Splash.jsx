import { View, Text, Animated } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import LottieView from 'lottie-react-native'

import { styles } from './SplashStyles'
import { app_c } from 'globals/styles'
import { useNavigation } from '@react-navigation/native'
import { Easing } from 'react-native-reanimated'

const Splash = () => {
  // Phuong: https://github.com/lottie-react-native/lottie-react-native#usage
  
  const navigation = useNavigation()
  const [loaded, setLoaded] = useState(false)
  const opacity = useRef(new Animated.Value(0)).current
  useEffect(() => {
    setTimeout(() => {
      Animated.timing(
        opacity,
        {
          toValue: 1,
          duration: 1500,
          useNativeDriver: false,
          easing: Easing.ease

        }
      ).start()
    }, 4000);
    
    setTimeout(() => {
      
      setLoaded(true)
    }, 6000)
  }, [])
  useEffect(() => {
    if (loaded) {
      navigation.navigate('Signin')
    }
  }, [loaded])
  return (
    <View style={styles.container}>
      <Animated.Text
        style={[styles.label, {opacity: opacity}]}
      >DongNaiTravelApp</Animated.Text>
      <LottieView
        autoPlay
        loop={false}
        speed={1.3}
        style={{
          width: 200,
          height: 200,
          backgroundColor: app_c.HEX.primary,
        }}
        source={require('assets/animations/splash.json')}
      />
    </View>
  )
}

export default Splash