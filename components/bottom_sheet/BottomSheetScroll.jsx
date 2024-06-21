import React, { useCallback, useMemo, useRef } from 'react'
import { View, Text, Pressable, TouchableOpacity } from 'react-native'
import BottomSheet, { BottomSheetScrollView, BottomSheetView } from '@gorhom/bottom-sheet'
import Icon from 'react-native-vector-icons/Octicons'

import { useTheme } from 'customHooks/useTheme'

import { termsConditions } from 'utilities/termsConditions'

import RectangleButton from 'components/buttons/RectangleButton'
import AppText from 'components/app_text/AppText'

import { styles } from './BottomSheetScrollStyles'
import { app_c, app_typo } from 'globals/styles'


const BottomSheetScroll = ({ 
  openTermCondition = false,
  closeTermCondition,
  childView,
  snapPoints,
  labelBtn,
  handleLabelBtn,
  haveBtn = true,
  haveOverlay = true,
  bottomView,
  labelBtnStyle,
  haveHeader = false,
  childHeader,
}) => {
  const { theme } = useTheme();
  const bottomSheetRef = useRef(null)

  const handleClosePress = () => {
    closeTermCondition()
    bottomSheetRef.current?.close()
  }

  if (openTermCondition)
    return (
      <>
        {
          haveOverlay &&
          <Pressable 
            style={styles.modal} 
            onPress={handleClosePress}
          />
        }
        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          // enableContentPanningGesture={false}
          enablePanDownToClose={true}
          onClose={() => closeTermCondition()}
          backgroundStyle={styles.bottomSheetContainer}
          handleStyle={{backgroundColor: theme.background}}
          handleIndicatorStyle={{backgroundColor: theme.onBackground}}
        >
          {
            haveHeader &&
            <BottomSheetView style={{backgroundColor: theme.background}}>
              {childHeader}
            </BottomSheetView>
          }
          <BottomSheetScrollView
            style={{backgroundColor: theme.background}}
            contentContainerStyle={[styles.bottomView, bottomView]}
            showsVerticalScrollIndicator={false}
          >
            {childView}
            {
              haveBtn && 
              <RectangleButton
                isActive
                style={[styles.btn, labelBtnStyle]}
                onPress={handleLabelBtn}
              >
                {
                  (isActive, currentLabelStyle) => (<AppText font="h4" style={[styles.btnText, currentLabelStyle]}>{labelBtn}</AppText>)
                }
              </RectangleButton>
            }
          </BottomSheetScrollView>
        </BottomSheet>
      </> 
    )
}

export default BottomSheetScroll