import { View, Text, Animated } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { app_c } from 'globals/styles'
import { LinearGradient } from 'expo-linear-gradient'

const Skeleton = ({skeletonStyle}) => {
  const translateX = useRef(new Animated.Value(-250)).current
  useEffect(() => {
    Animated.loop(
      Animated.timing(translateX, {
        toValue: 250,
        useNativeDriver: true,
        duration: 1500
      })
    ).start()
  }, [])
  
  return (
    <View style={[skeletonStyle, {backgroundColor: app_c.HEX.ext_primary, overflow: 'hidden'}]}>
      <Animated.View style={{width: '100%', height: '100%', transform: [{translateX: translateX}]}}>
        <LinearGradient 
          style={{ 
            height: '100%', 
            width: '100%',
          }} 
          colors={['transparent', 'rgba(0, 0, 0, 0.05)', 'transparent']}
          start={{x: 1, y: 1}}
        />
      </Animated.View>
    </View>
  )
}

export default Skeleton