import { View, Text, Animated, ActivityIndicator } from 'react-native'
import React, { useEffect, useRef } from 'react'
import LottieView from 'lottie-react-native'


import { styles } from './LoadingStyles'
import { useSelector } from 'react-redux'
import { selectCurrentManifold } from 'redux/manifold/ManifoldSlice'
import { app_c } from 'globals/styles'

const Loading = () => {
  const isLoading = useSelector(selectCurrentManifold).isLoading

  if (isLoading)
  return (
    <>
      <View style={styles.blur}></View>
      <View style={styles.container}>
        {/* <LottieView
          autoPlay
          loop={true}
          style={styles.lottie}
          source={require('assets/animations/loading2.json')}
        /> */}
        <ActivityIndicator size="large" color={app_c.HEX.fourth}/>
      </View>
    </>
  )
}

export default Loading