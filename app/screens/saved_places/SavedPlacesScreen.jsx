import { View, Text, FlatList } from 'react-native'
import React from 'react'

import { getPlacesAPI } from 'apis/axios'

import { withTheme } from 'hocs/withTheme'

import { BRIEF_PLACE_DATA_FIELDS } from 'utilities/constants'

import {
  HorizontalPlaceCard,
  HorizontalPlaceCardSkeleton
} from 'components'

import { app_sp } from 'globals/styles'

const SavedPlacesScreen = withTheme(({
  theme
}) => {
  const [data, setData] = React.useState([]);
  const savedPlacesInfo = React.useRef({
    isEndReach: false
  });

  let query = `limit=5&skip=0&fields=${BRIEF_PLACE_DATA_FIELDS}&onlySavedPlaces=${true}`;

  const handleExploreMomentumScrollEnd = React.useCallback((() => {
    let skip = 5;
    return function(e) {
      if(savedPlacesInfo.current.isEndReach) {
        if(data) {
          let query = `limit=5&skip=${skip}&fields=${BRIEF_PLACE_DATA_FIELDS}&onlySavedPlaces=${true}`;
          getPlacesAPI(query).then(data => {
            if(data.length > 0) {
              skip += data.length;
              setData(prevState => { prevState = prevState.concat(data); return [...prevState]; });
            }
            savedPlacesInfo.current.isEndReach = false;
          });
        }
      }
    }
  })(), []);

  const handleEndReach = e => {
    console.log("REACH END");
    savedPlacesInfo.current.isEndReach = true;
  }

  React.useEffect(() => {
    getPlacesAPI(query).then(setData);
  }, []);

  if(data.length > 0) console.log("Places: ", data.map(d => d.name));

  return (
    <FlatList
      data={data}
      style={[{ backgroundColor: theme.background }, app_sp.pt_12]}
      contentContainerStyle={{paddingBottom: 200, backgroundColor: theme.background }}
      ListEmptyComponent={
        !data && (
          <View style={[app_sp.mh_18, app_sp.mb_12]}>
            {[1, 2, 3, 4, 5].map((value, index) => <HorizontalPlaceCardSkeleton key={value + index} />)}
          </View>
        )
      }
      renderItem={item => <View style={app_sp.ph_18}><HorizontalPlaceCard place={item.item} placeIndex={item.index} /></View>}
      keyExtractor={item => item._id}
      onRefresh={() => { getPlacesAPI(query).then(setData) }}
      refreshing={false}
      onMomentumScrollEnd={handleExploreMomentumScrollEnd}
      onEndReached={handleEndReach}
      scrollEventThrottle={1000}
    />
  )
});

export default SavedPlacesScreen