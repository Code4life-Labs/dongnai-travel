import { View, Text, FlatList } from 'react-native'
import React from 'react'

import { getBlogsAPI } from 'apis/axios/blog/get'

import { withTheme } from 'hocs/withTheme'

import { BRIEF_BLOG_DATA_FIELDS } from 'utilities/constants'

import { useAuth } from 'customHooks/useAuth'

import {
  HorizontalBlogCard,
  HorizontalBlogCardSkeleton
} from 'components'

import { app_sp } from 'globals/styles'

const SavedBlogsScreen = withTheme(({
  theme
}) => {
  const [data, setData] = React.useState([]);
  const savedBlogsInfo = React.useRef({
    isEndReach: false
  });
  const { user } = useAuth();

  let query = {
    limit: 5,
    skip: 0,
    fields: BRIEF_BLOG_DATA_FIELDS,
    onlySavedBlogs: true,
    userId: user._id
  }

  const handleExploreMomentumScrollEnd = React.useCallback((() => {
    let skip = 5;
    return function(e) {
      if(savedBlogsInfo.current.isEndReach) {
        if(data) {
          let query = {
            limit: 5,
            skip: skip,
            fields: BRIEF_BLOG_DATA_FIELDS,
            onlySavedBlogs: true,
            userId: user._id
          }
          getBlogsAPI(query).then(response => {
            let data = response.data;
            if(data.length > 0) {
              skip += data.length;
              setData(prevState => { prevState = prevState.concat(data); return [...prevState]; });
            }
            savedBlogsInfo.current.isEndReach = false;
          });
        }
      }
    }
  })(), []);

  const handleEndReach = e => {
    console.log("REACH END");
    savedBlogsInfo.current.isEndReach = true;
  }

  React.useEffect(() => {
    getBlogsAPI(query).then(response => { console.log("Get blog done: ", response.data); setData(response.data) })
  }, []);

  return (
    <FlatList
      data={data}
      style={[{ backgroundColor: theme.background }, app_sp.pt_12]}
      contentContainerStyle={{paddingBottom: 200, backgroundColor: theme.background }}
      ListEmptyComponent={
        !data && (
          <View style={[app_sp.mh_18, app_sp.mb_12]}>
            {[1, 2, 3, 4, 5].map((value, index) => <HorizontalBlogCardSkeleton key={value + index} />)}
          </View>
        )
      }
      renderItem={item => <View style={app_sp.ph_18}><HorizontalBlogCard blog={item.item} blogIndex={item.index} /></View>}
      keyExtractor={item => item._id}
      onRefresh={() => { getBlogsAPI(query).then(response => setData(response.data)) }}
      refreshing={false}
      onMomentumScrollEnd={handleExploreMomentumScrollEnd}
      onEndReached={handleEndReach}
      scrollEventThrottle={1000}
    />
  )
});

export default SavedBlogsScreen