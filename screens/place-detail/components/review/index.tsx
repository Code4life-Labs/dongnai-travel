import { View, Image } from "react-native";
import React from "react";

// Import components
import { FC } from "@/components";

// Import hooks
import { useLanguage } from "@/hooks/useLanguage";
import { usePlaceDetailsState } from "@/hooks/usePlace";
import { useStateManager } from "@/hooks/useStateManager";

// Import objects
import { PlaceManager } from "@/objects/place";

// Import local state
import { StateManager } from "./state";

// Import styles
import { Styles } from "@/styles";
import { styles } from "../../styles";

export default function ReviewsSlide({ placeId }: { placeId: string }) {
  const { language } = useLanguage();
  const [state, stateFns] = useStateManager(
    StateManager.getInitialState(),
    StateManager.getStateFns
  );
  const placeDetails = usePlaceDetailsState(placeId);

  const _languageData = (language.data as any)["placeDetailScreen"] as any;

  React.useEffect(() => {
    let query = {
      placeId: placeDetails._id,
      skip: 0,
      limit: 20,
    };

    PlaceManager.Api.getPlaceReviews(query).then((data) => {
      if (data === null || data.length === 0) return;

      stateFns.setReviews(data);
    });
  }, []);

  if (!placeDetails) {
    return <FC.NoData />;
  }

  return (
    <View style={[styles.pd_content_container, Styles.spacings.ph_18]}>
      {/* Review rating information */}
      <View>
        <FC.AppText size="h3" style={Styles.spacings.mb_12}>
          {_languageData.review_texth3[language.code]}
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
            <FC.AppText size="body2" style={{ textAlign: "right" }}>
              {placeDetails?.reviews ? placeDetails?.reviews.length : 0} ratings
              & reviews
            </FC.AppText>
          </View>
        </View>
      </View>

      {/* Reviews */}
      <View style={Styles.spacings.mt_12}>
        {placeDetails?.reviews ? (
          placeDetails.reviews.map((review) => (
            <FC.ReviewSectionPromise key={review.time} review={review} />
          ))
        ) : (
          <FC.NoData title={_languageData.reviewsDataMessage[language.code]} />
        )}
      </View>
      <View style={{ height: 50 }}></View>
    </View>
  );
}
