import {
  TouchableOpacity,
  TouchableWithoutFeedback,
  TouchableHighlight,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";

export type UTouchables = "none" | "highlight" | "opacity";

export class ComponentUtils {
  /**
   * __Creator__: @NguyenAnhTuan1912
   *
   * Function nhận vào một
   * @param type Kiểu của touchable. Bao gồm 3 kiểu là `highlight`, `opacity`
   * @returns Một Touchable tương ứng với type. Nếu như type không là `highlight` hoặc `opacity` thì sẽ trả về `TouchableWithoutFeedback`
   */
  static getTouchable(type?: UTouchables) {
    switch (type) {
      case "highlight":
        return TouchableHighlight;
      case "opacity":
        return TouchableOpacity;
      default:
        return TouchableWithoutFeedback;
    }
  }

  /**
   * __Creator__: @NguyenAnhTuan1912
   *
   * Function này cần dùng khi một component có default style và có thể style riêng đè lên default style.
   * Lợi dụng cơ chế style của React Native (flat array về thành object, loại bỏ những properties trùng - lấy các properties ở đằng sau).
   *
   * Tuy nhiên thì khi viết style cho component, thì hạn chế nested style vào trong sâu quá, bởi vì có thể làm giảm đi performance của JS.
   * @param baseStyle Style mặc định của một component.
   * @param otherStyles Style muốn tuỳ chỉnh cho component đó.
   * @returns Một mảng gồm các style đã được trộn lẫn với nhau.
   */
  static mergeStyle(
    baseStyle:
      | StyleProp<ViewStyle | TextStyle>
      | Array<StyleProp<ViewStyle | TextStyle>>,
    ...otherStyles: Array<StyleProp<ViewStyle | TextStyle>>
  ) {
    if (Array.isArray(baseStyle)) return baseStyle.concat(otherStyles);

    return [baseStyle, ...otherStyles];
  }
}
