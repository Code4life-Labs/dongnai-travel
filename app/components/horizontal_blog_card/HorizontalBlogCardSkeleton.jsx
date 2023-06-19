import { View, Text } from 'react-native'
import React from 'react'

import AppText from 'components/app_text/AppText'
import RectangleButton from 'components/buttons/RectangleButton'
import CircleButton from 'components/buttons/CircleButton'

import styles from './HorizontalBlogCardStyles'
import { app_c, app_sp } from 'globals/styles'
import useTheme from 'customHooks/useTheme'

const HorizontalBlogCardSkeleton = () => {
  console.log("Horizontal Card Skeleton Render");
  const { themeColor } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: themeColor.bg_second }]}>
      {/* Cột đâu tiên - Image Container */}
      <View style={{...styles.card_image_container, ...app_sp.me_12,backgroundColor: themeColor.bg_tertiary}}>
      </View>

      {/* Cột thứ 2 - Main Container */}
      <View style={[styles.card_main_container,{backgroundColor: themeColor.bg_tertiary}]}>
        <View style={styles.card_content_container}>
          <View style={{...styles.car_skeleton_rectangle, ...app_sp.mb_12, height: 7}}></View>
          <View>
            <View style={{...styles.car_skeleton_rectangle, height: 18, ...app_sp.mb_6, backgroundColor: themeColor.bg_tertiary}}></View>
            <View style={{...styles.car_skeleton_rectangle, height: 18, ...app_sp.mb_6, backgroundColor: themeColor.bg_tertiary}}></View>
          </View>
          <View style={[styles.card_information_container,{backgroundColor: themeColor.bg_tertiary}]}>
            <View style={{...styles.card_information_col, ...app_sp.me_12}}>
              <View style={{...styles.car_skeleton_rectangle, height: 12, ...app_sp.mb_6}}></View>
            </View>
            <View style={styles.card_information_col}>
              <View style={{...styles.car_skeleton_rectangle, height: 12, ...app_sp.mb_6}}></View>
            </View>
          </View>
        </View>
        <View style={styles.card_buttons_container}>
          <CircleButton
            style={app_sp.me_8}
            isDisable={true}
          />
          <CircleButton
            style={app_sp.me_8}
            isDisable={true}
          />
        </View>
      </View>

      {/* Cột thứ 3 - Share Container */}
      <View style={styles.card_share_container}>
      </View>
    </View>
  )
}

export default HorizontalBlogCardSkeleton