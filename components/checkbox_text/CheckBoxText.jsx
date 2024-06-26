import React from 'react'
import { View, Text, Pressable, Platform } from 'react-native'
import AnimatedCheckbox from 'react-native-checkbox-reanimated'

import { useTheme } from 'customHooks/useTheme'

import AppText from 'components/app_text/AppText'

import { styles } from './CheckBoxTextStyles'
import { app_c } from 'globals/styles'

const CheckBoxText = ({ label, onPress, isChecked}) => {
  const { theme } = useTheme();

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={styles.checkbox}>
        <AnimatedCheckbox
          checked={isChecked}
          highlightColor={isChecked ? theme.onBackground : theme.background}
          checkmarkColor={Platform.OS === 'ios' ? theme.background : 'transparent'}
          boxOutlineColor={isChecked ? theme.outline : '#808080'}
        />
      </View>
      <AppText style={[styles.label, {
        color: isChecked ? theme.onBackground : theme.outline
      }]}>{label}</AppText>
    </Pressable>
  )
}

export default CheckBoxText