import { View, Text, TouchableOpacity, Touchable, Pressable } from 'react-native'
import React, { useCallback, useMemo, useRef } from 'react'
import styles from './NotificationBottomSheetStyle'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { selectCurrentManifold, updateCurrentManifold } from 'redux/manifold/ManifoldSlice'
import { useEffect } from 'react'
import { selectCurrentLanguage } from 'redux/language/LanguageSlice'

// Phuong: https://gorhom.github.io/react-native-bottom-sheet/modal
const NotificationBottomSheet = () => {

  const currentManifold = useSelector(selectCurrentManifold)

  const dispatch = useDispatch()

  const langCode = useSelector(selectCurrentLanguage).languageCode // vi or en 
  const langData = useSelector(selectCurrentLanguage).data?.notificationBottomSheet

  const [isOpen, setIsOpen] = useState(null)

  useEffect(() => {
    setIsOpen(currentManifold.appearNotificationBottomSheet)
  }, [currentManifold])

  const bottomSheetRef = useRef(null)

  const snapPoints = ['25%', '25%']

  const handleCloseBottomSheet = useCallback(() => {
  
    bottomSheetRef.current?.close()
    
    const timeToClose = setTimeout(() => {
      // Phuong: call action to update state
      dispatch(updateCurrentManifold({
        ...currentManifold,
        appearNotificationBottomSheet: false
      }))
      
      clearInterval(timeToClose)
    }, 300)
  }, [])

  if (isOpen)
  return (
    <>
      <Pressable style={styles.modal} onPress={handleCloseBottomSheet}/>
      <BottomSheet
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        enablePanDownToClose
        onClose={handleCloseBottomSheet}
        backgroundStyle={styles.bottomSheetContainer}
      >
        <BottomSheetView
          style={styles.bottomView}
        >
            <Text style={styles.textHeader}>{langData.notification[langCode]}</Text>
            <Text style={styles.textContent}>{currentManifold.contentNotificationBottomSheet}</Text>
            <TouchableOpacity
              style={styles.btn}
              onPress={handleCloseBottomSheet}
            >
              <Text style={styles.btnText}>{langData.close[langCode]}</Text>
            </TouchableOpacity>
        </BottomSheetView>
      </BottomSheet>
    </>
  )
}

export default NotificationBottomSheet
