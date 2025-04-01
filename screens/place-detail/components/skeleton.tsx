import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";

// Import components
import { FC } from "@/components";

// Import styles
import { Styles } from "@/styles";

export default function PlaceDetailsSkeletonScreen() {
  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Background Image Skeleton */}
        <FC.Skeleton height={200} style={styles.backgroundImageSkeleton} />

        {/* Bottom Sheet Skeleton */}
        <View style={styles.bottomSheetSkeleton}>
          {/* Header Section Skeleton */}
          <View style={styles.bottomSheetHeaderSkeleton}>
            <FC.Skeleton height={20} style={Styles.spacings.mb_12} />
            <FC.Skeleton
              width="40%"
              height={16}
              style={Styles.spacings.mb_12}
            />
            <FC.Skeleton
              width="30%"
              height={16}
              style={Styles.spacings.mb_12}
            />
          </View>

          {/* Buttons Section Skeleton */}
          <View style={styles.buttonsSectionSkeleton}>
            <FC.Skeleton width={40} height={40} style={Styles.spacings.me_8} />
            <FC.Skeleton width={40} height={40} style={Styles.spacings.me_8} />
            <FC.Skeleton width={40} height={40} style={Styles.spacings.me_8} />
          </View>

          {/* Tags Section Skeleton */}
          <View style={styles.tagsSectionSkeleton}>
            <FC.Skeleton
              width="20%"
              height={16}
              style={Styles.spacings.me_12}
            />
            <FC.Skeleton width="15%" height={24} style={Styles.spacings.me_6} />
            <FC.Skeleton width="15%" height={24} style={Styles.spacings.me_6} />
            <FC.Skeleton width="15%" height={24} style={Styles.spacings.me_6} />
          </View>

          {/* Tabs Section Skeleton */}
          <View style={styles.tabsSectionSkeleton}>
            <FC.Skeleton height={40} style={Styles.spacings.mb_12} />
          </View>

          {/* About Slide Skeleton */}
          <View style={styles.aboutSlideSkeleton}>
            <FC.Skeleton
              width="80%"
              height={16}
              style={Styles.spacings.mb_12}
            />
            <FC.Skeleton height={100} style={Styles.spacings.mb_12} />
            <FC.Skeleton height={120} style={Styles.spacings.mb_12} />
            <FC.Skeleton height={120} style={Styles.spacings.mb_12} />
          </View>

          {/* Reviews Slide Skeleton */}
          <View style={styles.reviewsSlideSkeleton}>
            <FC.Skeleton
              width="60%"
              height={20}
              style={Styles.spacings.mb_12}
            />
            <FC.Skeleton height={80} style={Styles.spacings.mb_12} />
            <FC.Skeleton height={80} style={Styles.spacings.mb_12} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  headerSkeleton: {
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999,
  },
  backgroundImageSkeleton: {
    left: 0,
    right: 0,
  },
  bottomSheetSkeleton: {
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 18,
  },
  bottomSheetHeaderSkeleton: {
    paddingBottom: 12,
  },
  buttonsSectionSkeleton: {
    flexDirection: "row",
    marginBottom: 12,
  },
  tagsSectionSkeleton: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
  },
  tabsSectionSkeleton: {
    marginBottom: 12,
  },
  aboutSlideSkeleton: {
    marginBottom: 12,
  },
  reviewsSlideSkeleton: {
    marginBottom: 12,
  },
});
