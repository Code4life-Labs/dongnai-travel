import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { app_c, app_shdw } from 'globals/styles'
import { styles } from './PolyLineDirectionStyles'
import { Callout, Marker, Polyline } from 'react-native-maps'


export const PolyLineDirection = ({ calloutRef, directionPolyLine, directionPolyLineIndex, selectedPolyLine, onPressPolyLine, onPressCallout}) => {
  
  const [warningString, setWarningString] = useState('')

  useLayoutEffect(() => {
    setTimeout(() => {
      if (directionPolyLineIndex === 0 && calloutRef.current !== null) {
        calloutRef?.current.showCallout()
      }
    }, 1000);
    console.log("🚀 ~ file: PolyLineDirection.jsx:20 ~ useLayoutEffect ~ showCallout:")
  }, [directionPolyLine])
      
  useEffect(() => {
    console.log("🚀 ~ file: PolyLineDirection.jsx:21 ~ useEffect ~ directionPolyLine?.warnings:", directionPolyLine?.warnings)
    if (directionPolyLine?.warnings) {
      let warningStringToUpdate = ''
      directionPolyLine.warnings.map((warning, index) => {
        if (index === 0)
          warningStringToUpdate += warning
        else
          warningStringToUpdate += `\n${warning}`
      })
      setWarningString(warningStringToUpdate)
    }
    else {
      setWarningString('')
    }
  }, [directionPolyLine])

  return (
    <>
      <Polyline
        coordinates={directionPolyLine?.polyline} 
        strokeWidth={6} 
        strokeColor={selectedPolyLine === directionPolyLineIndex ? app_c.HEX.third : '#808080'}
        tappable={true}
        lineJoin="round"
        onPress={() => {
          if ( calloutRef?.current !== null)
            calloutRef?.current.showCallout()
          onPressPolyLine()
        }}
        style={{ zIndex: selectedPolyLine === directionPolyLineIndex ? 1 : 0}}
      />
      {
        (warningString !== '') &&
        <Marker
          tappable={false}
          ref={calloutRef}
          style={{
            opacity: 0
          }}
          coordinate={directionPolyLine?.polyline[Math.floor(directionPolyLine?.polyline.length / 2)]}
          calloutAnchor={{
            x: -1.3,
            y: 1.1
          }}
        >
          <Callout onPress={onPressCallout} tooltip={true}>
            <TouchableOpacity
            style={{
              padding: 5,
              width: 100,
              backgroundColor: app_c.HEX.third,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderTopRightRadius: 4,
              borderTopLeftRadius: 4,
              borderBottomLeftRadius: 4,
              ...app_shdw.type_4
            }}>
              <Text style={{
                color: app_c.HEX.primary,
                fontSize: 12,
                fontWeight: 'bold',
                fontFamily: 'Roboto-Bold',
                textAlign: 'center'
              }}>{directionPolyLine?.description}</Text>
              <Text style={{
                color: app_c.HEX.primary,
                fontSize: 11,
                textAlign: 'center',
                fontFamily: 'Roboto-Regular'
              }}>{warningString}</Text>
            </TouchableOpacity>
            <View style={{
                width: '100%',
                alignItems: 'flex-end'
              }}>
              <View style={{
                width: 0,
                height: 0,
                borderTopWidth: 15,
                borderTopColor: app_c.HEX.third,
                borderLeftWidth: 15,
                borderBottomRightRadius: 30,
                borderBottomLeftRadius: 30,
                borderLeftColor: 'transparent',
              }}/>
            </View>
          </Callout>
        </Marker>
      }

      {
        (directionPolyLineIndex === selectedPolyLine) && 
        directionPolyLine?.travelAdvisory?.speedReadingIntervals.map((speedItem, index) => {
          if (speedItem.speed === "SLOW") {
            let coordinates = []
            for (let i = speedItem.startPolylinePointIndex; i <= speedItem.endPolylinePointIndex; i++) {
              coordinates.push(directionPolyLine?.polyline[i])
            }
            return (
              <Polyline
                key={`speedReadingIntervals-SLOW-${index}-directionPolyLineIndex-${directionPolyLineIndex}`}
                coordinates={coordinates} 
                strokeWidth={6} 
                strokeColor='orange'
                lineJoin="round"
                style={{ zIndex: 2 }}
              />
            )
          } else if (speedItem.speed === "TRAFFIC_JAM") {
            let coordinates = []
            for (let index = speedItem.startPolylinePointIndex; index <= speedItem.endPolylinePointIndex; index++) {
              coordinates.push(directionPolyLine?.polyline[index])
            }
            return (
              <Polyline
                key={`speedReadingIntervals-TRAFFIC_JAM-${index}-directionPolyLineIndex-${directionPolyLineIndex}`}
                coordinates={coordinates}
                strokeWidth={6} 
                strokeColor='red'
                lineJoin="round"
                style={{ zIndex: 2 }}
              />
            )
          }
          
        })
      }
    </>
  )
}