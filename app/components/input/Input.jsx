import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { FloatingLabelInput } from 'react-native-floating-label-input'

import { useTheme } from 'customHooks/useTheme'

import { app_c } from 'globals/styles'
import { styles } from './InputStyles'

const Input = ({ label, hint, isPassword, onChange, onBlur, value, error, containerStyle, rightComponent, handleShowSuggestTitle, handleHideSuggestTitle, isFromReparePublish = false}) => {

  const [isFocused, setIsFocused] = useState(false)

  const { theme } = useTheme();

  useEffect(() => {
    if (isFromReparePublish) {
      if(!isFocused && value) {
        handleShowSuggestTitle()
      } else {
        handleHideSuggestTitle()
      }
    }
  }, [isFocused, value])
  
  return (
    <FloatingLabelInput
      label={label}
      hint={hint}
      isPassword={isPassword}
      isFocused={isFocused}
      onBlur={() => {
        setIsFocused(false)
        onBlur()
      }}
      onFocus={() => {
        setIsFocused(true)
      }}
      labelStyles={[styles.label, { backgroundColor: theme.background }]}
      customLabelStyles={{
        topFocused: -25,
        fontSizeFocused: 12,
        leftBlurred: -2,
        colorBlurred: error ? '#F32424' : (isFocused ? theme.primary : theme.onOutline),
        colorFocused: error ? '#F32424' : (isFocused ? theme.onBackground : theme.onOutline)
      }}
      containerStyles={[styles.container, {
        borderColor: error ? '#F32424' : (isFocused ? theme.primary : theme.onOutline),
        borderWidth: isFocused ? 1.5 : 1,
        ...containerStyle
      }]}
      inputStyles={[styles.input, { backgroundColor: theme.background, color: theme.onBackground }]}
      togglePassword={false}
      value={value}
      onChangeText={onChange}
      customShowPasswordComponent= {
        <Icon 
          name='eye-slash' 
          size={16} 
          color={isFocused ? theme.background : theme.onOutline}
          style={styles.icon}
        />
      }
      customHidePasswordComponent= {
        <Icon 
          name='eye' 
          size={16} 
          color={isFocused ? theme.background : theme.onOutline}
          style={styles.icon}
        />
      }
      rightComponent={rightComponent}
    />
  )
}

export default Input