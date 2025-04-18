import { View, Animated, Image, useWindowDimensions } from "react-native";
import React from "react";
import { router, useNavigation } from "expo-router";
import { useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import Ionicons from "react-native-vector-icons/Ionicons";

// Import components
import { FC } from "@/components";
import ReviewsSlide from "@/screens/place-detail/components/review";
import AboutSlide from "@/screens/place-detail/components/about";
import PlaceDetailsSkeletonScreen from "@/screens/place-detail/components/skeleton";

// Import hooks
import { useLanguage } from "@/hooks/useLanguage";
import { useTheme } from "@/hooks/useTheme";
import { usePlaceDetails } from "@/hooks/usePlace";
import { useReportSection } from "@/hooks/useReport";

// Import objects
import { PlaceManager } from "@/objects/place";

// Import utils
import { HEADER_HEIGHT } from "@/utils/constants";
import { StringUtils } from "@/utils/string";

// Import styles
import { Styles } from "@/styles";
import { styles } from "@/screens/place-detail/styles";

export default function PlaceDetailsScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { id } = route.params as any;
  const { language } = useLanguage();
  const { theme } = useTheme();
  const { place, placeDetailsDispatchers } = usePlaceDetails(id);
  const { reportSectionDispatchers } = useReportSection();

  const screenHeight =
    Styles.dimension.screenHeight - insets.bottom - insets.top;
  const snapPoints = React.useMemo(
    () => ["60%", `${(screenHeight / Styles.dimension.screenHeight) * 100}%`],
    []
  );

  const bottomSheetRef = React.useRef(null);
  const opacityValue = React.useRef(new Animated.Value(0)).current;

  const animateFade = React.useCallback(
    (toValue: number) => {
      Animated.timing(opacityValue, {
        toValue: toValue,
        duration: 200,
        useNativeDriver: true,
      }).start();
    },
    [opacityValue]
  );

  const handleChangeBottomSheet = (index: number) => {
    if (index === 1) {
      animateFade(1);
    } else {
      animateFade(0);
    }
  };

  React.useEffect(() => {
    if (place) navigation.setOptions({ title: place.name });
    placeDetailsDispatchers.fetchPlaceDetail(id, language.code);
    return () => {
      placeDetailsDispatchers.remove(id);
    };
  }, [id, language.code]);

  if (!place) return <PlaceDetailsSkeletonScreen />;

  /**
   * Hàm này dùng để yêu thích / bỏ yêu thích một place, nó sẽ gửi id của place về server và tự server nó sẽ xử lý.
   */
  const handleFavoriteButton = function () {
    PlaceManager.toggleFavorite(
      place,
      placeDetailsDispatchers.favoritePlace,
      placeDetailsDispatchers.unfavoritePlace
    );
  };

  const handleVisitButton = function () {
    PlaceManager.toggleVisit(
      place,
      placeDetailsDispatchers.visitPlace,
      placeDetailsDispatchers.unvisitPlace
    );
  };

  const presentationImageUrl =
    place.photos && place.photos.length > 0 ? place.photos[0] : undefined;
  const _languageData = (language.data as any)["placeDetailScreen"] as any;

  return (
    <View style={{ backgroundColor: theme.background, flex: 1 }}>
      <Image
        source={presentationImageUrl ? { uri: presentationImageUrl } : {}}
        style={styles.pd_background_image}
      />
      <BottomSheet
        snapPoints={snapPoints}
        index={0}
        ref={bottomSheetRef}
        style={[styles.pd_bottom_sheet, Styles.boxShadows.type_4]}
        onChange={handleChangeBottomSheet}
        backgroundStyle={{
          flex: 1,
          backgroundColor: theme.background,
        }}
      >
        <BottomSheetScrollView
          style={[
            styles.pd_bottom_sheet_view,
            { backgroundColor: theme.background },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={[
              styles.pd_header,
              Styles.spacings.ph_18,
              {
                borderBottomColor: theme.outline,
                borderBottomWidth: 0.75,
              },
            ]}
          >
            {/* Information row */}
            <View style={{ ...styles.pd_row, ...Styles.spacings.mb_12 }}>
              {/* Name, location of visits column */}
              <View style={[{ flex: 1 }, Styles.spacings.me_12]}>
                <FC.AppText size="h2" numberOfLines={2}>
                  {place.name}
                </FC.AppText>
                <FC.AppText size="sub0">
                  {PlaceManager.getAddress(place)}
                </FC.AppText>
              </View>

              {/* Ratings, number of visits column */}
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <FC.AppText size="body2" style={Styles.spacings.me_12}>
                  <Ionicons name="star-outline" color={theme.primary} />{" "}
                  {place.rating}
                </FC.AppText>
                {/* <FC.AppText size="body2" style={{}}>
                  <Ionicons name='heart-outline' color={theme.primary} /> {place.userFavoritesTotal}
                </FC.AppText> */}
              </View>
            </View>

            {/* Buttons container row */}
            <View style={{ ...styles.pd_row, ...Styles.spacings.mb_12 }}>
              <FC.CircleButton
                isActive={place.isFavorited}
                style={Styles.spacings.me_8}
                defaultColor="type_5"
                type="highlight"
                setIcon={
                  <Ionicons
                    name={place.isFavorited ? "heart" : "heart-outline"}
                    size={14}
                  />
                }
                onPress={handleFavoriteButton}
              />
              <FC.CircleButton
                isActive={place.isVisited}
                style={Styles.spacings.me_8}
                defaultColor="type_5"
                type="highlight"
                setIcon={
                  <Ionicons
                    name={place.isVisited ? "compass" : "compass-outline"}
                    size={14}
                  />
                }
                onPress={handleVisitButton}
              />
              <FC.CircleButton
                style={Styles.spacings.me_8}
                defaultColor="type_5"
                type="highlight"
                onPress={() => router.navigate("/map")}
                setIcon={<Ionicons name="map" size={14} />}
              />
              <FC.CircleButton
                style={Styles.spacings.me_8}
                defaultColor="type_5"
                type="highlight"
                setIcon={<Ionicons name="share-outline" size={14} />}
                onPress={() => {}}
              />
              <FC.CircleButton
                defaultColor="type_5"
                style={Styles.spacings.me_8}
                type="highlight"
                onPress={() => {
                  reportSectionDispatchers.openReportSection(
                    place._id,
                    "place"
                  );
                }}
                setIcon={<Ionicons name="flag" size={14} />}
              />
            </View>

            {/* Tags container row */}
            <View
              style={[
                styles.pd_row,
                Styles.spacings.mb_12,
                { flexWrap: "wrap" },
              ]}
            >
              <FC.AppText size="body2" style={Styles.spacings.me_12}>
                <Ionicons name="pricetag-outline" /> Tags:
              </FC.AppText>
              {place.types &&
                place.types.map((type) => (
                  <FC.RectangleButton
                    key={type._id}
                    type="highlight"
                    defaultColor="type_5"
                    shape="rounded_4"
                    style={[
                      Styles.spacings.ph_8,
                      Styles.spacings.pv_0,
                      Styles.spacings.me_6,
                      Styles.spacings.mb_6,
                    ]}
                  >
                    {/* {(isActive, currentLabelStyle) => (
                        <FC.AppText style={currentLabelStyle} size="body3">{StringUtility.toTitleCase(type)}</FC.AppText>
                      )} */}
                    {StringUtils.toTitleCase(type.name)}
                  </FC.RectangleButton>
                ))}
            </View>
          </View>

          {/* Tabs */}
          <FC.AppTabSlider
            slides={[
              {
                label: "About",
                value: "about",
                element: (
                  <FC.AppTabSlider.Child
                    component={() => <AboutSlide placeId={id} />}
                  />
                ),
              },
              {
                label: "Reviews",
                value: "reviews",
                element: (
                  <FC.AppTabSlider.Child
                    component={() => <ReviewsSlide placeId={id} />}
                  />
                ),
              },
            ]}
          />

          <View style={{ height: 125 }}></View>
        </BottomSheetScrollView>
      </BottomSheet>
    </View>
  );
}
