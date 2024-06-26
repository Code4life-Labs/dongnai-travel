import { Text, TouchableOpacity } from 'react-native'
import React from 'react'

import { styles } from './ButtonTextStyles'

const ButtonText = ({ label, onPress, btnStyle, textStyle}) => {
  return (
    <TouchableOpacity 
      style={[styles.container, btnStyle]}

      onPress={onPress}
    >
      <Text style={[styles.label, textStyle]}>{label}</Text>
    </TouchableOpacity>
  )
}

export default ButtonText