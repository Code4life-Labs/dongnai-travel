import { View, Text, FlatList } from 'react-native'
import React from 'react'

import AppText from '../app_text/AppText'
import { app_sp } from 'globals/styles'

/**
 * __Creator__: @NguyenAnhTuan1912
 * 
 * Đây là một component dùng để render ra một list string có bullet dấu "•" và dấu "-". Và vì nó là một list string cho nên component chỉ nhận
 * `data` là một mảng chuỗi hoặc một chuỗi. Nếu như muốn thêm một list cấp 2 thì chỉ cần lồng thêm một list nữa.
 * @param {object} props - Props của component.
 * @param {JSX.Element[] | JSX.Element} props.children - Children chỉ nhận vào Một hoặc nhiều UnorderedList khác.
 * @param {Array<string | number> | string | number} [props.data=[]] - Dữ liệu cần được in.
 * @param {number} [props.level=0] - Cấp của list, cái này thì chỉ thật sự hoạt động khi List này không lồng ở trong 1 list nào khác.
 * @param {'normal' | 'italic'} [props.fontStyle=normal] - Kiểu của chữ, bình thường hay là nghiêng.
 * @param {'normal' | 'lighter' | 'bolder'} [props.weight=normal] - Độ đậm của chữ.
 * @param {'h0' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'body0' | 'body1' | 'body2' | 'body3' | 'sub0' | 'sub1'} [props.font=body1] - Từ khoá liên quan tới font, được quy định trong typography.js.
 * @param {'primary' | 'second' | 'third' | 'fourth' | 'sub_primary' | 'sub_second' | 'sub_third' | 'sub_fourth' | 'ext_primary' | 'ext_second' | 'ext_third'} [props.color=fourth] - Từ khoá lên quan tới màu sắc, được quy định trong `color.js`.
 * @param {Array<string>} props.customBullets - Tuỳ chỉnh bullet cho list, các bullet này là một circle, khi số cấp của list vượt quá số các bullet đã cho thì nó sẽ chở về buttet đầu tiên.
 * @param {StyleProp<ViewStyle>} [props.style={}] - Style cho component.
 * @returns Trả về một `FlatList` có bullet.
 */
const AppUnorderedList = ({
  children,
  data = [],
  level = 0,
  fontStyle = 'normal',
  weight = 'normal',
  font = 'body1',
  color = 'fourth',
  customBullets,
  style = {}
}) => {
  const bulletInLevel = React.useMemo(() => {
    let bullets = customBullets ? customBullets : ['\u2022', '-'];
    let bulletsLength = customBullets ? customBullets.length : 2;
    return bullets[level % bulletsLength];
  }, [level, customBullets])

  return (
    <View style={{...style, ...app_sp.ps_12}}>
      {
        data.map((text, index) => (
          <AppText
            fontStyle={fontStyle}
            weight={weight}
            font={font}
            color={color}
            key={text + index}
          >
            {bulletInLevel + " " + text}
          </AppText>
        ))
      }
      {
        children
        ? children.length > 1
          ? children.map(child => (
            child.type.name === "MyUnorderedList"
            ? React.cloneElement(child, {level: level + 1, ...child.props})
            : null
          ))
          : children.type.name === "MyUnorderedList"
            ? React.cloneElement(children, {level: level + 1, ...children.props})
            : null
        : null
      }
    </View>
  )
}



export default AppUnorderedList