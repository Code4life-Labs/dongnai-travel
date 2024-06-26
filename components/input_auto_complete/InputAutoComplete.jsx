import { View, Text, TextInput, Pressable } from 'react-native'
import React from 'react'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'

import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

import { styles } from './InputAutoCompleteStyles'
import { app_c } from 'globals/styles'
import { useSelector } from 'react-redux'
import { selectCurrentManifold } from 'redux/manifold/ManifoldSlice'
import { useEffect } from 'react'
import { TouchableOpacity } from 'react-native'

const InputAutoComplete = ({ 
  placeholder,
  onPlaceSelected,
  map_api_key,
  isFocusedInput,
  handleFocus,
  inputRef,
  handleGetAddressText,
  isShowBackIcon = false,
  handlePressBackIcon ,
  isHaveLeftButton = true,
  isHaveRightButton = false,
  textContainerStyle,
  listViewStyle,
  textInputStyle,
  loaddingText,
  predefinedPlaces,
  predefinedPlacesDescriptionStyle,
  handlePressFilter
}) => {
  useEffect(() => {
    if (typeof loaddingText === 'function') {
      loaddingText()
    }
  }, [])
  return (
    <>
      <GooglePlacesAutocomplete
        ref={inputRef}
        placeholder={placeholder}
        minLength={2} // minimum length of text to search
        predefinedPlaces={predefinedPlaces}
        predefinedPlacesAlwaysVisible={true}
        returnKeyType={'search'}
        keyboardAppearance={'light'}
        styles={{
          textInput: [styles.textSearch, textInputStyle],
          textInputContainer: [styles.textContainer, textContainerStyle],
          row: styles.row,
          poweredContainer: styles.poweredContainer,
          listView: [styles.listView, listViewStyle],
          predefinedPlacesDescription: [styles.predefinedPlacesDescription, predefinedPlacesDescriptionStyle]
        }}
        renderLeftButton={() => {
          if (isHaveLeftButton) {
            if (!isShowBackIcon) {
              return (
                <TouchableOpacity
                  onPress={() => handleGetAddressText(inputRef.current?.getAddressText())}
                >
                  <FontAwesome
                    name="search"
                    size={18}
                    color={app_c.HEX.third}
                    style={styles.iconSearch}
                  />
                </TouchableOpacity>
              )
            } else {
              return (
                <TouchableOpacity
                  onPress={() => handlePressBackIcon()}
                >
                  <MaterialIcons
                    name="arrow-back-ios"
                    size={25}
                    color={app_c.HEX.third}
                    style={styles.iconBack}
                  />
                </TouchableOpacity>
              )
            }
          }
        }}
        renderRightButton={() => {
          if (isHaveRightButton) {
            return (
              <>
                <View style={{borderLeftWidth: 1, borderLeftColor: app_c.HEX.ext_third, height: 30, marginTop: 10,}}/>
                <TouchableOpacity
                  onPress={handlePressFilter}
                >
                  <FontAwesome
                    name="filter"
                    size={20}
                    color={app_c.HEX.third}
                    style={styles.iconFilter}
                  />
                </TouchableOpacity>
              </>
            )
          }
        }}
        query={{
          key: map_api_key,
          language: 'vi',
          components: 'country:vn',
        }}
        fetchDetails={true}
        debounce={200}
        onPress={(data, details) => {
          // console.log("🚀 ~ file: InputAutoComplete.jsx:47 ~ InputAutoComplete ~ data", data)
          // console.log("🚀 ~ file: InputAutoComplete.jsx:38 ~ InputAutoComplete ~ details", details)
          onPlaceSelected(details)
        }}
      />
      {
        !isFocusedInput &&
        <Pressable
        style={styles.overlayBtn}
        onPress={() => {
          inputRef.current?.focus()
          handleFocus(true)
        }}
      />
      }
    </>
  )
}

export default InputAutoComplete