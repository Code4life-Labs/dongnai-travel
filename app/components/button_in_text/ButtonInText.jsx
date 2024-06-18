import { Text, TouchableOpacity, View } from 'react-native'
import React, { memo } from 'react'

import { styles } from './ButtonInTextStyles'
import FunctionsUtility from 'utilities/functions'
import { app_c, app_typo } from 'globals/styles'

const ButtonInText = ({textRaw, numberOfLines=2, handlePressPlace, isItineraryDetail}) => {
  const regex = /(\[[^\]]+\])/
  const pharagraphArrayRaw = textRaw.split(regex)
  return (
    <View style={{
      display: 'flex',
      flexDirection:'row',
      flexWrap: 'wrap'
    }}>
      <Text 
        style={{
          color: app_c.HEX.fourth,
          ...app_typo.fonts.normal.normal[isItineraryDetail ? 'body1' : 'body2'],
          textAlign: 'justify',
          lineHeight: isItineraryDetail ? 18 : 15,
          overflow: 'hidden',
        }}
        numberOfLines={numberOfLines}
      >
        {
          pharagraphArrayRaw.length > 0 &&
          pharagraphArrayRaw.map((p, index) => {
            // console.log('paragraph', p)
            // Nếu đúng với regex này thì nó đang là place
            if (FunctionsUtility.validateRegex(p, /^\[[^\]]+\]$/)) {
              return (
                  <Text style={{
                    color: app_c.HEX.fourth,
                    backgroundColor: '#0074ff2b',
                    ...app_typo.fonts.normal.normal[isItineraryDetail ? 'body1' : 'body2'], 
                    // paddingHorizontal: ,
                    borderWidth: 1,
                    borderRadius: 4,
                    padding: 5,
                    lineHeight: 16,
                    overflow: 'hidden',
                  }}
                    onPress={() => handlePressPlace(p.slice(1, -1))}
                  > {p.slice(1, -1)} </Text>
              )
            }

            // Nếu k đúng với regex này thì nó đang đoạn văn
            else {
              return (
                <Text style={{
                  color: app_c.HEX.fourth,
                  ...app_typo.fonts.normal.normal[isItineraryDetail ? 'body1' : 'body2']
                }}>{p}</Text>
              )
            }
          })
        }
      </Text>
    </View>
  )
}

export default memo(ButtonInText) 