import { View, Text } from 'react-native'
import React from 'react'

import ComponentUtility from 'utilities/component'

import styles from './VerticalPlaceCardStyles'

import { ViewProps } from 'types/index.d'

import { app_c, app_sh, app_shdw, app_sp } from 'globals/styles'
import {useTheme} from 'customHooks/useTheme'
import Skeleton from 'components/skeleton/Skeleton'


/**
 * @param {ViewProps} props Props của component. Chình là props của View.
 * @returns 
 */
const VerticalPlaceCardSkeleton = (props) => {
  const containerStyle = ComponentUtility.mergeStyle(styles.card, props.style);
  //theme
  const { theme } = useTheme();

  return (
    <View {...props} style={[containerStyle,{backgroundColor: theme.subBackground}]}>
      {/* Image */}
      <Skeleton
        skeletonStyle={[styles.card_image, {backgroundColor: app_c.HEX.ext_primary}]}
      />
      {/* Button & Recommended tag */}
      <Skeleton
        skeletonStyle={[
          styles.card_mid,
          styles.card_ske_bg, 
          app_sh.rounded_4, 
          { backgroundColor: app_c.HEX.ext_primary, height: 15, width: '50%', marginBottom: 3}
        ]}
      />

      {/* Content */}
      <View style={styles.card_content_container}>
        <Skeleton
          skeletonStyle={[styles.card_ske_bg, app_sh.rounded_4, {backgroundColor: app_c.HEX.ext_primary, height: 19, width: '100%', marginBottom: 3 }]}
        />

        {/* Sub-information */}
        <View style={styles.card_content_sub_information_container}>
          <Skeleton
            skeletonStyle={[styles.card_ske_bg, app_sh.rounded_4, {backgroundColor: app_c.HEX.ext_primary, height: 15, width: '70%' }]}
          />
          <Skeleton
            skeletonStyle={[styles.card_ske_bg, app_sh.rounded_4, {backgroundColor: app_c.HEX.ext_primary, height: 15, width: '30%' , marginTop: 3, marginBottom: 5}]}
          />
        </View>
      </View>

      {/* Like button */}
      <View style={[styles.card_buttons_container, {paddingTop: 3,}]}>
        <Skeleton
          skeletonStyle={[styles.card_ske_bg, app_sh.rounded_4, { backgroundColor: app_c.HEX.ext_primary,height: 30, flex: .48 }]}
        />
        <View style={{ flex: .04 }}></View>
        <Skeleton
          skeletonStyle={[styles.card_ske_bg, app_sh.rounded_4, {backgroundColor: app_c.HEX.ext_primary, height: 30, flex: .48 }]}
        />
      </View>
    </View>
  )
}

export default VerticalPlaceCardSkeleton