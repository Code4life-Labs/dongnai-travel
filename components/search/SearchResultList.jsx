import {
  View,
  Text,
  FlatList
} from 'react-native'
import React from 'react'

import {
  app_sp,
  app_c,
  app_shdw,
  app_sh
} from 'globals/styles'

import {
  SearchResultListProps
} from 'types/index.d.ts'

/**
 * __Component này cần phải build trước__
 * 
 * Component này dùng để render ra danh sách kết quả tìm kiếm.
 * @param {SearchResultListProps} props Props của component.
 * @returns 
 */
const SearchResultList = (props) => {
  let position = props.resultListPosition === "float-top"
    ? {
      bottom: '100%',
      ...app_sp.mb_12
    }
    : props.resultListPosition === "float-bottom"
    ? {
      top: '100%',
      ...app_sp.mt_12
    }
    : {
      ...app_sp.mt_12
    }

  if(props.resultListPosition !== "normal") {
    position = {
      ...position,
      ...app_shdw.type_3,
      position: 'absolute',
      maxHeight: 240
    }
  }

  return (
    <View
      style={[
        {
          backgroundColor: app_c.HEX.primary,
          width: '100%',
          zIndex: 10
        }, 
        position,
        app_sh.rounded_8
      ]}
    >
      <FlatList
        style={{
          position: 'relative',
          width: '100%'
        }}
        contentContainerStyle={{
          justifyContent: 'flex-end'
        }}
        data={props.results}
        renderItem={({item}) => props.renderResultItem(item)}
        keyExtractor={(item, index) => props.keyExtractor(item, index)}
        scrollEnabled={props.scrollEnabled}
      />
    </View>
  )
}

export default SearchResultList