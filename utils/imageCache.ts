import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";

const IMAGE_CACHE_FOLDER = `${FileSystem.cacheDirectory}images/`;
const IMAGE_CACHE_KEY = "@image_cache_urls";

//**
//  author: __phapdev
// */
export class ImageCacheUtils {
  /**
   *    * Khởi tạo thư mục cache cho ảnh nếu chưa tồn tại
   */
  static async initImageCache() {
    const dirInfo = await FileSystem.getInfoAsync(IMAGE_CACHE_FOLDER);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(IMAGE_CACHE_FOLDER, {
        intermediates: true,
      });
    }
  }

  /**
   * Lấy đường dẫn local của ảnh đã cache
   * @param uri URI của ảnh từ server
   * @returns Đường dẫn local của ảnh đã cache
   */
  static getCachedImagePath(uri: string): string {
    // Tạo tên file từ URI bằng cách mã hóa URI
    const filename = uri.split("/").pop() || "";
    return `${IMAGE_CACHE_FOLDER}${filename}`;
  }

  /**
   * Kiểm tra xem ảnh đã được cache chưa
   * @param uri URI của ảnh từ server
   * @returns true nếu ảnh đã được cache, false nếu chưa
   */
  static async isImageCached(uri: string): Promise<boolean> {
    try {
      const cachedImagePath = this.getCachedImagePath(uri);
      const fileInfo = await FileSystem.getInfoAsync(cachedImagePath);
      return fileInfo.exists;
    } catch (error) {
      console.error("Error checking if image is cached:", error);
      return false;
    }
  }

  /**
   * Lưu danh sách URI ảnh đã cache vào AsyncStorage
   * @param uris Danh sách URI ảnh
   */
  static async saveCachedImagesList(uris: string[]) {
    try {
      await AsyncStorage.setItem(IMAGE_CACHE_KEY, JSON.stringify(uris));
    } catch (error) {
      console.error("Error saving cached images list:", error);
    }
  }

  /**
   * Lấy danh sách URI ảnh đã cache từ AsyncStorage
   * @returns Danh sách URI ảnh đã cache
   */
  static async getCachedImagesList(): Promise<string[]> {
    try {
      const cachedImagesJson = await AsyncStorage.getItem(IMAGE_CACHE_KEY);
      return cachedImagesJson ? JSON.parse(cachedImagesJson) : [];
    } catch (error) {
      console.error("Error getting cached images list:", error);
      return [];
    }
  }

  /**
   * Tải và cache ảnh từ URI
   * @param uri URI của ảnh từ server
   * @returns Đường dẫn local của ảnh đã cache
   */
  static async cacheImage(uri: string): Promise<string> {
    try {
      // Khởi tạo thư mục cache nếu chưa tồn tại
      await this.initImageCache();

      // Kiểm tra xem ảnh đã được cache chưa
      const cachedImagePath = this.getCachedImagePath(uri);
      const isCached = await this.isImageCached(uri);

      // Nếu ảnh đã được cache, trả về đường dẫn local
      if (isCached) {
        return cachedImagePath;
      }

      // Nếu ảnh chưa được cache, tải và lưu ảnh
      await FileSystem.downloadAsync(uri, cachedImagePath);

      // Cập nhật danh sách ảnh đã cache
      const cachedImages = await this.getCachedImagesList();
      if (!cachedImages.includes(uri)) {
        cachedImages.push(uri);
        await this.saveCachedImagesList(cachedImages);
      }

      return cachedImagePath;
    } catch (error) {
      console.error("Error caching image:", error);
      return uri; // Trả về URI gốc nếu có lỗi
    }
  }

  /**
   * Xóa tất cả ảnh đã cache
   */
  static async clearImageCache() {
    try {
      await FileSystem.deleteAsync(IMAGE_CACHE_FOLDER, { idempotent: true });
      await AsyncStorage.removeItem(IMAGE_CACHE_KEY);
      await this.initImageCache();
    } catch (error) {
      console.error("Error clearing image cache:", error);
    }
  }

  /**
   * Lấy đường dẫn ảnh (ưu tiên từ cache nếu có)
   * @param uri URI của ảnh từ server
   * @returns Đường dẫn ảnh (local hoặc remote)
   */
  static async getImagePath(uri: string): Promise<string> {
    if (!uri) return "";
    
    try {
      // Kiểm tra xem ảnh đã được cache chưa
      const isCached = await this.isImageCached(uri);
      
      // Nếu ảnh đã được cache, trả về đường dẫn local
      if (isCached) {
        return this.getCachedImagePath(uri);
      }
      
      // Nếu ảnh chưa được cache, tải và cache ảnh
      return await this.cacheImage(uri);
    } catch (error) {
      console.error("Error getting image path:", error);
      return uri; // Trả về URI gốc nếu có lỗi
    }
  }
} 