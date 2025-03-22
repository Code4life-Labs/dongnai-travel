import { LayoutAnimation } from 'react-native';

export const dropDownAnimation = {
  duration: 300,
  update: {
    duration: 300,
    property: LayoutAnimation.Properties.scaleY,
    type: LayoutAnimation.Types.easeInEaseOut,
  },
  delete: {
    duration: 200,
    property: LayoutAnimation.Properties.opacity,
    type: LayoutAnimation.Types.easeInEaseOut,
  },
}; 