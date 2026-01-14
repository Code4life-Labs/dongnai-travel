import { Styles } from "@/styles";
import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";
import Swiper from "react-native-swiper";
import { FC } from "@/components";
import { useTheme } from "@/hooks/useTheme";
import { useImagePreload } from "@/hooks/useImageCache";
import { useLanguage } from "@/hooks/useLanguage";

// Danh sách banner tiếng Việt
const BANNERS_VI = [
  "https://res.cloudinary.com/dbtb0sjby/image/upload/v1685983477/banners/vi/1_nqx0pu.jpg",
  "https://res.cloudinary.com/dbtb0sjby/image/upload/v1685983478/banners/vi/3_i3makt.jpg",
  "https://res.cloudinary.com/dbtb0sjby/image/upload/v1685983478/banners/vi/5_uijds1.jpg",
  "https://res.cloudinary.com/dbtb0sjby/image/upload/v1685983475/banners/vi/7_hnspu5.jpg",
  "https://res.cloudinary.com/dbtb0sjby/image/upload/v1685983476/banners/vi/9_w9iskz.jpg",
  "https://res.cloudinary.com/dbtb0sjby/image/upload/v1685983476/banners/vi/11_brt1fg.jpg",
  "https://res.cloudinary.com/dbtb0sjby/image/upload/v1685983478/banners/vi/13_vd6g6b.jpg",
  "https://res.cloudinary.com/dbtb0sjby/image/upload/v1685983477/banners/vi/15_uaiyk7.jpg",
  "https://res.cloudinary.com/dbtb0sjby/image/upload/v1685983477/banners/vi/17_dvgaqn.jpg",
  "https://res.cloudinary.com/dbtb0sjby/image/upload/v1685983476/banners/vi/19_bxjlbj.jpg",
];

// Danh sách banner tiếng Anh
const BANNERS_EN = [
  "https://res.cloudinary.com/dbtb0sjby/image/upload/v1685983504/banners/en/2_vwpe7c.jpg",
  "https://res.cloudinary.com/dbtb0sjby/image/upload/v1685983504/banners/en/4_trp9xj.jpg",
  "https://res.cloudinary.com/dbtb0sjby/image/upload/v1685983504/banners/en/6_tdup44.jpg",
  "https://res.cloudinary.com/dbtb0sjby/image/upload/v1685983502/banners/en/8_srf8ww.jpg",
  "https://res.cloudinary.com/dbtb0sjby/image/upload/v1685983502/banners/en/10_hcpe5m.jpg",
  "https://res.cloudinary.com/dbtb0sjby/image/upload/v1685983502/banners/en/12_kilqkr.jpg",
  "https://res.cloudinary.com/dbtb0sjby/image/upload/v1685983502/banners/en/14_dynbxz.jpg",
  "https://res.cloudinary.com/dbtb0sjby/image/upload/v1685983503/banners/en/16_xad7dt.jpg",
  "https://res.cloudinary.com/dbtb0sjby/image/upload/v1685983503/banners/en/18_ffz6co.jpg",
  "https://res.cloudinary.com/dbtb0sjby/image/upload/v1685983503/banners/en/20_lnzglb.jpg",
];

const HomeBannerSlider = React.memo(() => {
  const { theme } = useTheme();
  const { language } = useLanguage();
  
  const _languageData = React.useMemo(
    () => (language.data as any)["homeScreen"] as any,
    [language.data]
  );

  // Select banners based on language
  const banners = React.useMemo(
    () => (language.code === 'vi' ? BANNERS_VI : BANNERS_EN),
    [language.code]
  );

  // Sử dụng hook preload ảnh cho banner
  const { isPreloading, progress, preloadImages } = useImagePreload(banners);

  // Preload ảnh khi component mount hoặc banners thay đổi
  React.useEffect(() => {
    preloadImages();
  }, [banners, preloadImages]);

  const renderBanner = React.useCallback((banner: string, index: number) => (
    <View key={`banner-${index}`} style={styles.slide}>
      <FC.CachedImage
        uri={banner}
        style={styles.image}
        resizeMode="cover"
      />
    </View>
  ), []);

  return (
    <View style={styles.container}>
      {/* Hiển thị trạng thái preload ảnh */}
      {isPreloading && (
        <View style={[styles.loadingOverlay, { backgroundColor: theme.background }]}>
          <Text style={{ color: theme.onBackground, fontSize: 12 }}>
            {_languageData["desWeather"][language.code]} {progress}%
          </Text>
        </View>
      )}

      {banners.length > 0 ? (
        <Swiper
          style={styles.wrapper}
          autoplay
          loop
          dot={<View style={styles.dot} />}
          activeDot={<View style={styles.active_dot} />}
          paginationStyle={styles.pagination}
        >
          {banners.map(renderBanner)}
        </Swiper>
      ) : (
        <FC.Skeleton style={styles.skeleton} />
      )}
    </View>
  );
});

HomeBannerSlider.displayName = 'HomeBannerSlider';

export default HomeBannerSlider;

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
  },
  slide: {
    height: 200,
    backgroundColor: "transparent",
  },
  container: {
    height: 200,
    position: "relative",
  },
  image: {
    height: 200,
    width: "100%",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    padding: 5,
    alignItems: "center",
    opacity: 0.8,
  },
  skeleton: {
    width: "100%",
    height: "100%",
  },
  pagination: {
    bottom: -12,
  },
  dot: {
    backgroundColor: Styles.theme.data.light.onPrimary,
    bottom: 20,
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
  },
  active_dot: {
    backgroundColor: Styles.theme.data.light.primary,
    bottom: 20,
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
  },
});
