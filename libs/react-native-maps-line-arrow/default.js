import React from 'react';
import { View } from 'react-native';

const DefaultArrow = ({color, size}) => (
  <View style={{width: size, height: size}}>
    <View style={{
      borderColor: 'transparent',
      borderBottomColor: color ,
      width: 0,
      height: 0,
      borderTopWidth: 0,
      borderBottomWidth: size,
      borderRightWidth: size / 2,
      borderLeftWidth: size / 2,
    }} />
  </View>
);

export default DefaultArrow;