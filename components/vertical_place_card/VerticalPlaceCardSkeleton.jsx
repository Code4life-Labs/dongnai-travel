import { View } from 'react-native'
import React from 'react'

import styles from './VerticalPlaceCardStyles'


import { useTheme } from '@/hooks/useTheme'

import Skeleton from '@/components/skeleton'
import { Styles } from '@/styles'


/**
 * @param {ViewProps} props Props của component. Chình là props của View.
 * @returns 
 */
const VerticalPlaceCardSkeleton = (props) => {
  //theme
  const { theme } = useTheme();

  return (
    <View {...props} style={[styles.card,props.style, {backgroundColor: theme.background}]}>
      {/* Image */}
      <Skeleton
        skeletonStyle={[styles.card_image, {backgroundColor: theme.background}]}
      />
      {/* Button & Recommended tag */}
      <Skeleton
        skeletonStyle={[
          styles.card_mid,
          styles.card_ske_bg, 
          Styles.shapes.rounded_4, 
          { backgroundColor: theme.background, height: 15, width: '50%', marginBottom: 3}
        ]}
      />

      {/* Content */}
      <View style={styles.card_content_container}>
        <Skeleton
          skeletonStyle={[styles.card_ske_bg, Styles.shapes.rounded_4, {backgroundColor: Styles.theme.data.light.ext_primary, height: 19, width: '100%', marginBottom: 3 }]}
        />

        {/* Sub-information */}
        <View style={styles.card_content_sub_information_container}>
          <Skeleton
            skeletonStyle={[styles.card_ske_bg, Styles.shapes.rounded_4, {backgroundColor: Styles.theme.data.light.ext_primary, height: 15, width: '70%' }]}
          />
          <Skeleton
            skeletonStyle={[styles.card_ske_bg, Styles.shapes.rounded_4, {backgroundColor: Styles.theme.data.light.ext_primary, height: 15, width: '30%' , marginTop: 3, marginBottom: 5}]}
          />
        </View>
      </View>

      {/* Like button */}
      <View style={[styles.card_buttons_container, {paddingTop: 3,}]}>
        <Skeleton
          skeletonStyle={[styles.card_ske_bg, Styles.shapes.rounded_4, { backgroundColor: Styles.theme.data.light.ext_primary,height: 30, flex: .48 }]}
        />
        <View style={{ flex: .04 }}></View>
        <Skeleton
          skeletonStyle={[styles.card_ske_bg, Styles.shapes.rounded_4, {backgroundColor: Styles.theme.data.light.ext_primary, height: 30, flex: .48 }]}
        />
      </View>
    </View>
  )
}

export default VerticalPlaceCardSkeleton