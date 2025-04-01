import React from 'react';
import { Image, ImageProps, ActivityIndicator, View, StyleSheet, ViewStyle, StyleProp, ImageStyle } from 'react-native';
import { useImageCache } from '@/hooks/useImageCache';

interface CachedImageProps extends Omit<ImageProps, 'source'> {
  uri: string;
  placeholderColor?: string;
  showLoadingIndicator?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

/**
 * Component hiển thị ảnh từ cache hoặc tải và cache ảnh nếu chưa có
 */
export const CachedImage: React.FC<CachedImageProps> = ({
  uri,
  style,
  containerStyle,
  placeholderColor = '#e1e2e3',
  showLoadingIndicator = true,
  ...props
}) => {
  const { imagePath, isLoading } = useImageCache(uri);

  return (
    <View style={[styles.container, containerStyle]}>
      {isLoading ? (
        <>
          <View style={[styles.placeholder, { backgroundColor: placeholderColor }]} />
          {showLoadingIndicator && (
            <ActivityIndicator
              style={styles.loader}
              size="small"
              color="#0000ff"
            />
          )}
        </>
      ) : (
        <Image
          {...props}
          source={{ uri: imagePath }}
          style={style}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
  },
  placeholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  loader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -10,
    marginTop: -10,
  },
});

export default CachedImage; 