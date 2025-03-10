import { View, ScrollView } from "react-native";
import React from "react";
import { router } from "expo-router";
import Ionicons from "react-native-vector-icons/Ionicons";

// Import components
import { FC } from "@/components";

// Import hooks
import { useLanguage } from "@/hooks/useLanguage";
import { usePlaceDetailsState } from "@/hooks/usePlace";
import { useAuth } from "@/hooks/useAuth";
import { useStateManager } from "@/hooks/useStateManager";

// Import objects
import { PlaceManager } from "@/objects/place";

// Import utils
import { NumberUtils } from "@/utils/number";

// Import styles
import { Styles } from "@/styles";
import { styles } from "../styles";

// Import types
import { PlaceReview } from "@/objects/place/type";

export default function ReviewsSlide({ placeId }: { placeId: string }) {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [reviews, setReviews] = React.useState<Array<PlaceReview> | null>(null);
  const [totalReviews, setTotalReviews] = React.useState(0);
  const placeDetails = usePlaceDetailsState(placeId);

  const _languageData = (language.data as any)["placeDetailScreen"] as any;

  const handleRemoveReview = function (reviewId: string) {
    setReviews((prevState) => {
      if (!prevState || prevState.length === 0) return prevState;
      const index = prevState.findIndex((review) => review._id === reviewId);
      prevState.splice(index, 1);
      return [...prevState];
    });
  };

  React.useEffect(() => {
    let query = {
      placeId: placeDetails._id,
      skip: 0,
      limit: 7,
    };

    PlaceManager.Api.getPlaceReviews(query).then((data) => {
      if (data === null || data.length === 0) return;

      setReviews(data);
    });
    Promise.all([
      PlaceManager.Api.getPlaceReviews(query),
      PlaceManager.Api.getTotalReviewsOfPlace(placeDetails._id),
    ]).then((values) => {
      const [reviews, totalReviews] = values;
      if (reviews && reviews.length > 0) setReviews(reviews);
      if (totalReviews) setTotalReviews(totalReviews.count);
    });
  }, []);

  if (!placeDetails) {
    return <FC.NoData />;
  }

  return (
    <View style={[styles.pd_content_container, Styles.spacings.ph_18]}>
      {/* Review rating information */}
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View>
          <FC.AppText size="h3" style={Styles.spacings.mb_12}>
            {_languageData.ratings[language.code]}
          </FC.AppText>

          {/* Rating statistic */}
          <View style={styles.pd_content_rr_stats_container}>
            <View style={styles.pd_content_rr_rating_point_container}>
              <FC.AppText size="h0">{placeDetails.rating}</FC.AppText>
              <FC.AppText size="body2">out of 5</FC.AppText>
            </View>

            {/* Line Chart */}
            <View style={styles.pd_content_rr_chart_container}>
              {/* <View style={Styles.spacings.mb_12}>
              <FC.SimpleBarChart dataSet={dataSet} />
            </View> */}
            </View>
          </View>
        </View>
        <View>
          <FC.AppText
            size="h3"
            style={[Styles.spacings.mb_12, { textAlign: "right" }]}
          >
            {_languageData.reviews[language.code]}
          </FC.AppText>

          {/* Rating statistic */}
          <View>
            <FC.AppText size="h0" style={{ textAlign: "right" }}>
              {NumberUtils.toMetricNumber(totalReviews)}
            </FC.AppText>

            {/* Line Chart */}
            <View style={styles.pd_content_rr_chart_container}>
              {/* <View style={Styles.spacings.mb_12}>
              <FC.SimpleBarChart dataSet={dataSet} />
            </View> */}
            </View>
          </View>
        </View>
      </View>

      <View
        style={[
          Styles.spacings.mt_8,
          Styles.spacings.pb_8,
          { borderBottomWidth: 1 },
        ]}
      >
        <FC.RectangleButton
          type="highlight"
          onPress={() => {
            router.navigate({
              pathname: "/explore/places/[id]/reviews",
              params: {
                id: placeDetails._id,
              },
            });
          }}
        >
          {(isActive, currentLabelStyle) => (
            <>
              <FC.AppText style={currentLabelStyle}>
                Write your review
              </FC.AppText>
              <Ionicons
                style={[currentLabelStyle, Styles.spacings.ms_8]}
                name="pencil"
              />
            </>
          )}
        </FC.RectangleButton>
      </View>

      {/* Reviews */}
      <View style={Styles.spacings.mt_12}>
        {reviews ? (
          reviews.map((review) => (
            <FC.PlaceReview
              key={review._id}
              isOwnedByUser={user?._id === review.place._id}
              review={review}
              onDelete={handleRemoveReview}
            />
          ))
        ) : (
          <FC.NoData title={_languageData.reviewsDataMessage[language.code]} />
        )}
      </View>
      <View style={{ height: 50 }}></View>
    </View>
  );
}
