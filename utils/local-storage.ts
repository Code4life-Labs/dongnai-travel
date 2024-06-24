import AsyncStorage from '@react-native-async-storage/async-storage';

export class LocalStorageUtils {
  /**
   * 
   * @example
      const data = new Map<string, string>();
      data.set('key1', 'value1');
      data.set('key2', 'value2');
      data.set('key3', 'value3');
  
      const result = await setItemsStorage(data);
  
      if (result) {
        console.log('Data saved successfully!');
      } else {
        console.log('Failed to save data.');
      }
   */
  static async setItems(data: Map<string, string>): Promise<boolean> {
    try {
      const promises = [];

      for (let [key, value] of data.entries()) {
        promises.push(AsyncStorage.setItem(`@${key}:key`, value));
      }

      await Promise.all(promises);

      return true;
    } catch (error) {
      console.error('Error saving data to AsyncStorage:', error);
      return false;
    }
  };

  /**
   * 
   * @example
      const data = new Map<string, string>();
      data.set('key', 'value');
  
      const result = await setItemStorage(data);
  
      if (result) {
        console.log('Data saved successfully!');
      } else {
        console.log('Failed to save data.');
      }
   */
  static async setItem(data: Map<string, string>): Promise<boolean> {
    try {
      // Lấy cặp key-value đầu tiên từ Map
      const [key, value] = data.entries().next().value;

      await AsyncStorage.setItem(`@${key}:key`, value);
      return true;
    } catch (error) {
      console.error('Error saving data to AsyncStorage:', error);
      return false;
    }
  };

  /**
   * 
   * @example
      const keys = [key1, key2, key3];
  
      const result = await getItemsStorage(keys);
  
      if (result) {
        console.log('Data got successfully!');
      } else {
        console.log('Failed to got data.');
      }
   */
  static async getItems(keys: string[]): Promise<Map<string, string>> {
    const result = new Map<string, string>();
    try {
      const promises = keys.map(async (key) => {
        const value = await AsyncStorage.getItem(`@${key}:key`);
        if (value !== null) {
          result.set(key, value);
        } else {
          result.set(key, '');
        }
      });

      await Promise.all(promises);

      return result;
    } catch (error) {
      console.error('Error getting data from AsyncStorage:', error);
      // Trả về Map trống trong trường hợp lỗi
      return result;
    }
  };

  /**
   * 
   * @example
      const key = 'key1';
  
      const result = await getItemStorage(key);
  
      if (result) {
        console.log('Data got successfully!');
      } else {
        console.log('Failed to got data.');
      }
   */
  static async getItem(key: string): Promise<string> {
    try {
      const value = await AsyncStorage.getItem(`@${key}:key`);
      if (value !== null) {
        return value;
      }
      return '';
    } catch (error) {
      console.error('Error getting data from AsyncStorage:', error);
      return '';
    }
  };
}