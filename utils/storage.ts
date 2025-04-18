import AsyncStorage from "@react-native-async-storage/async-storage";

const ASYNC_STORAGE_CONSTANT_KEYS = {
  SAVED_BLOG_IMAGES_KEY: "_sbi",
  SAVED_BLOG_CONTENT_KEY: "_sbc",
  SAVED_BLOG_METADATA_KEY: "_bmeta",
  USER: "_usr",
  REMEMBERED_USER: "_rmb_usr",
  REPORT_REASONS_KEY: "_rprsn",
  REPORT_STATUSES_KEY: "_rpstt",
};

export class StorageUtils {
  /**
   * Hàm này dùng để lấy dữ liệu ở trong `AsyncStorage` theo `key`.
   * @param key
   * @returns
   */
  static async getItemAsync(key: keyof typeof ASYNC_STORAGE_CONSTANT_KEYS) {
    try {
      let constantKey = ASYNC_STORAGE_CONSTANT_KEYS[key];
      if (!constantKey)
        throw new Error(
          `The key ${key} is not support in async storage constant key.`
        );
      let value = await AsyncStorage.getItem(constantKey);

      if (!value) return undefined;

      return JSON.parse(value);
    } catch (error: any) {
      let message = error.message ? ": " + error.message : "";
      console.error("AsyncStorage Get Item Error", message);
      return undefined;
    }
  }

  /**
   * Hàm này dùng để lưu `data` vào trong `AsyncStorage` theo `key`.
   * @param key
   * @param data
   * @returns
   */
  static async setItemAsync(
    key: keyof typeof ASYNC_STORAGE_CONSTANT_KEYS,
    data: any
  ) {
    try {
      let constantKey = ASYNC_STORAGE_CONSTANT_KEYS[key];
      if (!constantKey)
        throw new Error(
          `The key ${key} is not support in async storage constant key.`
        );
      await AsyncStorage.setItem(constantKey, JSON.stringify(data));
      return true;
    } catch (error: any) {
      let message = error.message ? ": " + error.message : "";
      console.error("AsyncStorage Set Item Error", message);
      return false;
    }
  }

  /**
   * Hàm này dùng để xoá dữ liệu ở trong `AsyncStorage` theo `key`.
   * @param key
   * @returns
   */
  static async removeItemAsync(key: keyof typeof ASYNC_STORAGE_CONSTANT_KEYS) {
    try {
      let constantKey = ASYNC_STORAGE_CONSTANT_KEYS[key];
      if (!constantKey)
        throw new Error(
          `The key ${key} is not support in async storage constant key.`
        );
      await AsyncStorage.removeItem(constantKey);
      return true;
    } catch (error: any) {
      let message = error.message ? ": " + error.message : "";
      console.error("AsyncStorage Remove Item Error", message);
      return false;
    }
  }
}
