import { useState, useEffect } from 'react';
import { ImageCacheUtils } from '@/utils/imageCache';

/**
 * author: __phapdev
 * Hook để lấy đường dẫn ảnh từ cache hoặc tải và cache ảnh nếu chưa có
 * @param uri URI của ảnh từ server
 * @returns Đường dẫn ảnh (local hoặc remote) và trạng thái loading
 */
export function useImageCache(uri: string) {
  const [imagePath, setImagePath] = useState<string>(uri);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const loadImage = async () => {
      if (!uri) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const cachedPath = await ImageCacheUtils.getImagePath(uri);
        
        if (isMounted) {
          setImagePath(cachedPath);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error loading cached image:', error);
        if (isMounted) {
          setImagePath(uri); // Fallback to original URI
          setIsLoading(false);
        }
      }
    };

    loadImage();

    return () => {
      isMounted = false;
    };
  }, [uri]);

  return { imagePath, isLoading };
}

/**
 * Hook để preload nhiều ảnh cùng lúc
 * @param uris Danh sách URI của ảnh từ server
 * @returns Trạng thái loading và hàm để bắt đầu preload
 */
export function useImagePreload(uris: string[] = []) {
  const [isPreloading, setIsPreloading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  const preloadImages = async () => {
    if (!uris.length) return;
    
    setIsPreloading(true);
    setProgress(0);
    
    try {
      let loaded = 0;
      
      // Khởi tạo thư mục cache
      await ImageCacheUtils.initImageCache();
      
      // Tải từng ảnh
      for (const uri of uris) {
        await ImageCacheUtils.cacheImage(uri);
        loaded++;
        setProgress(Math.floor((loaded / uris.length) * 100));
      }
      
      setIsPreloading(false);
    } catch (error) {
      console.error('Error preloading images:', error);
      setIsPreloading(false);
    }
  };

  return { isPreloading, progress, preloadImages };
} 