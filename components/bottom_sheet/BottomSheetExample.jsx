import { View, Text, Pressable, TouchableOpacity } from 'react-native'
import React, { useCallback, useMemo, useRef } from 'react'
import BottomSheet, { BottomSheetScrollView, BottomSheetView } from '@gorhom/bottom-sheet'
import { styles } from './BottomSheetScrollStyles'
import { termsConditions } from 'utilities/termsConditions'
import Icon from 'react-native-vector-icons/Octicons'
import { app_c, app_typo } from 'globals/styles'


const BottomSheetExample = ({ 
  openTermCondition = false,
  closeTermCondition,
  childView,
  snapPoints,
  haveOverlay = true,
  bottomSheetExampleRef,
  flastlist,
  enableContentPanningGesture= true
}) => {

  const handleClosePress = () => {
    closeTermCondition()
    bottomSheetExampleRef.current?.close()
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
          ref={bottomSheetExampleRef}
          index={1}
          // enableContentPanningGesture={enableContentPanningGesture}
          snapPoints={snapPoints}
          enablePanDownToClose
          onClose={() => closeTermCondition()}
          backgroundStyle={styles.bottomSheetContainer}
        >
          {childView}
          {/* {
            haveHeader &&
            <BottomSheetView>
              {childHeader}
            </BottomSheetView>
          } */}

          {/* <BottomSheetScrollView
            contentContainerStyle={[styles.bottomView, bottomView]}
            showsVerticalScrollIndicator={false}
          >
            

            {
              haveBtn && 
              <TouchableOpacity
                style={[styles.btn, labelBtnStyle]}
                onPress={handleLabelBtn}
              >
                <Text style={styles.btnText}>{labelBtn}</Text>
              </TouchableOpacity>
            }

          </BottomSheetScrollView> */}
        </BottomSheet>
      </> 
    )
}

export default BottomSheetExample