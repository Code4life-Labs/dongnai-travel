import { View, Animated, Image } from "react-native";
import React from "react";
import { router, useNavigation } from "expo-router";
import { useRoute } from "@react-navigation/native";
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

// Import objects
import { PlaceManager } from "@/objects/place";

// Import states
import { placesActions } from "@/states/redux/places";

// Import utils
import { HEADER_HEIGHT } from "@/utils/constants";
import { StringUtils } from "@/utils/string";

// Import styles
import { Styles } from "@/styles";
import { styles } from "@/screens/place-detail/styles";

export default function PlaceDetailsScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params as any;
  const { language } = useLanguage();
  const { theme } = useTheme();
  const { place, placeDetailsActions } = usePlaceDetails(id);

  const snapPoints = React.useMemo(
    () => ["60%", `${100 - (30 / Styles.dimension.screenHeight) * 100}%`],
    []
  );

  const bottomSheetRef = React.useRef(null);
  const opacityValue = React.useRef(new Animated.Value(0)).current;

  const animFade = React.useCallback(
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
      animFade(1);
    } else {
      animFade(0);
    }
  };

  React.useEffect(() => {
    if (place) {
      navigation.setOptions({ title: place.name });
      // placesActions.fetchPlaceDetails(id, {
      //   canGetComplete: fromSearch,
      //   lang: language.code,
      // });
      return () => {
        placeDetailsActions.remove(id);
      };
    }
  }, [place, language.code]);

  if (!place) return <PlaceDetailsSkeletonScreen />;

  /**
   * Hàm này dùng để yêu thích / bỏ yêu thích một place, nó sẽ gửi id của place về server và tự server nó sẽ xử lý.
   */
  const handleLikeButton = function () {};

  const presentationImageUrl =
    place.photos && place.photos.length > 0 ? place.photos[0] : undefined;
  const _languageData = (language.data as any)["placeDetailScreen"] as any;

  return (
    <View style={{ backgroundColor: theme.background, flex: 1 }}>
      <Animated.View
        style={{
          opacity: opacityValue,
          backgroundColor: theme.background,
          height: HEADER_HEIGHT,
          zIndex: 999,
        }}
      />
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
                isActive={place.isLiked}
                style={Styles.spacings.me_8}
                defaultColor="type_5"
                type="highlight"
                setIcon={
                  <Ionicons
                    name={place.isLiked ? "heart" : "heart-outline"}
                    size={14}
                  />
                }
                onPress={handleLikeButton}
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
                    key={type}
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
                    {StringUtils.toTitleCase(type)}
                  </FC.RectangleButton>
                ))}
            </View>
          </View>

          {/* Tabs */}
          <FC.AppTabSlider>
            <FC.AppTabSlider.Child
              component={() => <AboutSlide placeId={id} />}
            />
            <FC.AppTabSlider.Child
              component={() => <ReviewsSlide placeId={id} />}
            />
          </FC.AppTabSlider>

          <View style={{ height: 125 }}></View>
        </BottomSheetScrollView>
      </BottomSheet>
    </View>
  );
}
