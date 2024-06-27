import { usePathname } from "expo-router";
import { Platform, Share } from "react-native";
import * as FileSystem from "expo-file-system";

// Import utils
import { StringUtils } from "./string";

export class OtherUtils {
  /**
   * Hàm trả về tên của một route đang được active. Nếu như muốn setup title cho cho các screen trong navigator con, ví dụ như là
   * một Stack navigator nằm trong screen của Tab navigator, thì dùng hàm này cho thuộc tính `options` của Tab screen.
   * @returns Trả về tên của route đang được active.
   * @NguyenAnhTuan1912
   * @example
   * ```jsx
   * <Tab.Screen
   *  options={() => (
   *    {
   *      title: OtherUtils.getHeaderTitle()
   *    }
   *  )}
   * />
   * ```
   */
  static getHeaderTitle() {
    return usePathname();
  }

  /**
   * Hàm sẽ so sánh 2 Số, chuỗi đối tượng hoặc function nào đó (gọi chung là đối tượng đi). Để kiểm tra xem
   * 2 đối tượng đó có giống nhau không? Không chỉ về ref mà còn là key và value.
   * @param a Số, chuỗi, đối tượng hoặc function đầu tiên muốn so sánh.
   * @param b Số, chuỗi, đối tượng hoặc function thứ hai muốn so sánh.
   * @returns
   * @NguyenAnhTuan1912
   *
   * @example
   *
   * ...
   * let obj1 = { a: 123, b: [ { c: 1 }, 23 ] }
   * let obj2 = { a: 123, b: [ { c: 1 }, 23 ] }
   *
   * console.log(deepCompare(obj1, obj2)); // Output: true
   * ...
   */
  static deepCompare(a: any, b: any) {
    let check = true;

    // Check trước ở đây, vì a và b có thể là số, chuỗi.ư
    // Tuy nhiên a và b cùng lưu một ref của một object hoặc array, thì có thể bằng nhau. Nhưng trường hợp này check sau.
    check = a === b;

    // Nếu cả a và b là function thì check luôn ở đây.
    if (a instanceof Function && b instanceof Function) {
      return a.toString() === b.toString();
    }

    // Nếu là array
    if (a instanceof Array) {
      check = true;

      if (a.length !== b.length) return false;

      if (a === b) return true;

      for (let index in a) {
        if (
          a[index] instanceof Object &&
          !OtherUtils.deepCompare(a[index], b[index])
        )
          return false;
        if (!(a[index] instanceof Object) && a[index] !== b[index])
          return false;
      }
    }

    // Nếu là object
    if (a instanceof Object && !(a instanceof Array)) {
      let propsA = Object.getOwnPropertyNames(a);
      let propsB = Object.getOwnPropertyNames(b);

      check = true;

      if (propsA.length !== propsB.length) return false;

      for (let prop in a) {
        if (!b[prop]) return false;
        if (!OtherUtils.deepCompare(a[prop], b[prop])) return false;
      }
    }

    return check;
  }

  /**
   * Hàm này để kiểm tra xem text có đúng với regex đã cung cấp hay chưa
   * @param text đoạn văn bản được cung cấp
   * @param regex được cung cấp
   * @returns
   * @FromSunNews
   */
  static validateRegex(text: string, regex: RegExp) {
    return regex.test(text);
  }

  /**
   * Trả về một mảng mới đã remove item theo `condition`. Không nên dùng mảng
   * quá sâu.
   * @param arr
   * @param selectValueToCompare
   * @param value
   * @NguyenAnhTuan1912
   */
  static removeFrom<T>(
    arr: Array<T>,
    selectValueToCompare: (ele: T, index: number) => T,
    value: T
  ) {
    if (arr.length === 1) return [];
    return arr.filter(
      (ele, index) => selectValueToCompare(ele, index) !== value
    );
  }

  /**
   * Dùng hàm này với async function để delay một tác vụ nào đó.
   * @param callBack
   * @param timeout
   * @returns
   * @NguyenAnhTuan1912
   */
  static wait(callBack: () => void, timeout: number) {
    return new Promise((res) => {
      setTimeout(() => {
        // Promise đang `await` res() thực thi.
        res(callBack());
      }, timeout);
    });
  }

  /**
   * Hàm này dùng để bind tất cả các methods trong một object với `obj` đó.
   * @param obj object cần bind tất cả các method của nó.
   * @param options
   * @NguyenAnhTuan1912
   */
  static autoBind(obj: any, options: { protoProps: string[] }) {
    let propNames = options?.protoProps
      ? options?.protoProps
      : Object.getOwnPropertyNames(obj);
    for (let propName of propNames) {
      if (propName !== "constructor" && typeof obj[propName] === "function") {
        obj[propName] = obj[propName].bind(obj);
      }
    }
  }

  /**
   * Use this method to create a static singleton class
   * @deprecated
   * @param name
   * @param fn
   * @NguyenAnhTuan1912
   */
  static createSingleton<
    Class,
    T extends Record<string, any>,
    Args extends Array<keyof T>,
  >(name: string, fn: (instance: Class, ...args: Args) => void) {
    let _instance: any;

    return class {
      constructor(...args: Args) {
        if (_instance) return _instance;

        fn.call(this, this as any, ...args);
        _instance = this;
      }

      get [Symbol.toStringTag]() {
        return name;
      }
    } as { new (): Class };
  }

  /**
   * Đây là hàm dùng để chia sẻ hình ảnh của bài viết lên các nền tảng mạng xả hội
   * @param message lời nhắn khi chia sẻ
   * @param url đường dẫn hoặc dạng base64 của hình ảnh muốn chia sẻ
   * @param title tiêu đề của bài chia sẻ
   * @returns
   * @FromSunNews
   */
  static async shareImageToSocial(message: string, url: string, title: string) {
    // let base64Data;
    // await callWithGlobalLoading(async () => {
    //   // Kiểm tra xem url này có phải là một đường dẫn hay không
    //   if (StringUtils.hasLink(url)) {
    //     base64Data = url;
    //     return;
    //   }
    //   base64Data = "data:image/jpeg;base64,";
    //   try {
    //     const { uri } = await FileSystem.downloadAsync(
    //       url,
    //       FileSystem.documentDirectory + "bufferimg.png"
    //     );
    //     base64Data += await FileSystem.readAsStringAsync(uri, {
    //       encoding: "base64",
    //     });
    //   } catch (err) {
    //     console.log(err);
    //   }
    // });
    // Share.share({
    //   message: message, // supporting android
    //   url: base64Data, // not supporting
    //   title: title,
    // })
    //   .then((result) => console.log(result))
    //   .catch((errorMsg) => console.log(errorMsg));
    // if (Platform.OS === "android") {
    //   Share.share({
    //     message: message, // supporting android
    //     url: base64Data, // not supporting
    //     title: title,
    //   })
    //     .then((result) => console.log(result))
    //     .catch((errorMsg) => console.log(errorMsg));
    // } else if (Platform.OS === "ios") {
    //   Share.share({
    //     message: message, // supporting android
    //     url: base64Data, // not supporting
    //     title: title,
    //   })
    //     .then((result) => console.log(result))
    //     .catch((errorMsg) => console.log(errorMsg));
    // }
  }
}
