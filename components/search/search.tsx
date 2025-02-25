import { View, Text, TextInput, StyleSheet } from "react-native";
import React from "react";
import Ionicons from "react-native-vector-icons/Ionicons";

// Import hooks
import { useTheme } from "@/hooks/useTheme";

// Import stlyes
import { Styles } from "@/styles";

const search = (function () {
  let _timeoutInstance: NodeJS.Timeout;
  let timeout = 500;
  /**
   * @param {string} text Text này chính là chữ mà người dùng nhập vào để tìm kiếm.
   * @param {() => void} callBack Callback này sẽ thực thi khi timeout thực thi
   */
  return function handleSearchInputTextChange(text: string, callBack: any) {
    clearTimeout(_timeoutInstance);
    if (!text) return;
    _timeoutInstance = setTimeout(() => {
      callBack();
    }, timeout);
  };
})();

export type SearchProps = {
  placeHolder: string;
  callBack: (searchString: string, data: any) => void;
  apis: Array<(text: string) => Promise<any>>;
};

/**
 * Đây là component dùng để tìm kiếm một cái gì đó như là địa điểm, blog hay user. `Search` là một
 * phần trong chức năng này, là một text input cho phép người dùng tìm kiếm. Và một component hiển thị
 * ra các kết quả mà người dùng này tìm kiếm. Khi ấn vào kết quả đó thì nó sẽ trả về kết quả. Thường
 * thì kết quả này sẽ.
 */

/**
 * __Component này cần phải build trước__
 *
 * Component này dùng để tìm một cái gì đó, trong app của mình thì nó sẽ tìm place, blog hoặc user.
 * Nhận một số props bao gồm: `placeHolder` cho `TextInput`; `callBack` dùng để gọi khi trả về kết quả;
 * `apis` là một array chứa các api function, khi người dùng không nhập chữ nữa thì các api này sẽ được gọi.
 * @param props Thuộc tính của component.
 * @returns
 */
export default function Search(props: SearchProps) {
  props = Object.assign(
    {},
    {
      placeHolder: "",
      apis: [],
    },
    props
  );

  const { theme } = useTheme();

  const textInputRef = React.useRef(null);

  React.useEffect(() => {
    if (props.apis.length === 0)
      console.warn("The `apis` props need api functions to work correctly.");
  }, []);

  return (
    <View
      style={[
        styles.container,
        Styles.shapes.rounded_8,
        Styles.spacings.ph_12,
        Styles.spacings.pv_12,
        {
          position: "relative",
          borderColor: theme.outline,
          borderWidth: 1,
          flex: 1,
          zIndex: 10,
        },
      ]}
    >
      <Ionicons
        name="search-outline"
        style={Styles.spacings.me_12}
        color={theme.outline}
        size={20}
      />
      <TextInput
        ref={textInputRef}
        style={{
          flex: 1,
          color: theme.onBackground,
          backgroundColor: theme.background,
        }}
        placeholderTextColor={theme.outline}
        placeholder={props.placeHolder}
        onChangeText={(text) => {
          search(text, () => {
            Promise.all(
              // Lây ra tất cả các request promises trong props.apis để request nhiều resource khác nhau
              props.apis.reduce((acc: any, curr: any) => {
                acc.push(curr(text));
                return acc;
              }, [])
            ).then((values) => {
              let flatValue = [];
              for (let value of values) flatValue.push(...value);

              props.callBack(text, flatValue);
            });
          });
          if (!text) props.callBack(text, []);
        }}
        contextMenuHidden
        clearButtonMode="while-editing"
        inputMode="search"
      />
    </View>
  );
}

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
});
