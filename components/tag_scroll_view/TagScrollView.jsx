import { ScrollView, Text,View } from 'react-native'
import React from 'react'

import AppText from '../app_text/AppText'
import RectangleButton from '../buttons/RectangleButton'

import { app_sp } from 'globals/styles'


/**
 * __Creator__: @NguyenAnhTuan1912
 * 
 * ScrollButtonView sẽ chịu trách nhiệm load dữ liệu cho các Button, mà dữ liệu này sẽ theo một chủ đề nào đó,
 * như là blogs, places.
 * @param {object} props - Props của component.
 * @param {'places' | 'blogs'} [props.concept=places] - Chủ đề cần để load dữ liệu. VD: `Blog`, `Place`.
 * @param {StyleProp<ViewStyle>} props.style - Style riêng cho Scroll TagButton View.
 * @param {boolean} props.isHorizontalScroll - Đây có phải là một view scroll nằm ngang hay không? Mặc định là `true`
 * @returns Trả về `ScrollView` Component có các `TouchableOpacity` Components ở trong đó.
 */
const TagScrollView = ({
  concept = 'places',
  style,
  isHorizontalScroll = true
}) => {
  if(concept === undefined || concept === "") return<Text>Không tìm thấy concept</Text>

  const [tags, setTags] = React.useState([]);

  let lengthOfTags;

  React.useEffect(() => {
    setTimeout(() => {
      lengthOfTags = fakeData[concept].length;
      setTags([...fakeData[concept]]);
    }, 2000)
  }, []);

  return (
    <ScrollView
      horizontal={isHorizontalScroll}
      showsHorizontalScrollIndicator={false}
      style={{...style}}
    >
      {
        tags.length === 0
        ? [1, 2, 3, 4, 5].map((data, index) => {
          return (
            index > (lengthOfTags - 1)
            ? (<RectangleButton key={data} overrideShape="capsule" typeOfButton="highlight" style={{width: 70}}><AppText></AppText></RectangleButton>)
            : (<RectangleButton key={data} overrideShape="capsule" typeOfButton="highlight" style={{...app_sp.me_12, width: 70}}><AppText></AppText></RectangleButton>)
          )})
        : fakeData[concept].map((data, index) => {
          return (
            index > (lengthOfTags - 1)
            ? (
                <RectangleButton
                  key={data}
                  overrideShape="capsule"
                  typeOfButton="highlight"
                  isActive={index === 0 ? true : false}
                >
                  {(isActive, currentLabelStyle) => (
                    <AppText style={currentLabelStyle} font="body3">{data}</AppText>
                  )}
                </RectangleButton>
              )
            : (
                <RectangleButton
                  key={data}
                  overrideShape="capsule"
                  typeOfButton="highlight"
                  style={app_sp.me_12}
                  isActive={index === 0 ? true : false}
                >
                  {(isActive, currentLabelStyle) => (
                    <AppText style={currentLabelStyle} font="body3">{data}</AppText>
                  )}
                </RectangleButton>
              )
          )})
      }
    </ScrollView>
  )
}

const fakeData = {
  "places": [
    "All", "Recommended", "Popular", "Most visits", "Most ratings"
  ],
  "blogs": [
    "All", "Newest", "Popular", "Most likes", "Most comments"
  ]
};

export default TagScrollView