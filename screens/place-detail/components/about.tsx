import { View, Text, Pressable, Animated, Image } from "react-native";
import React from "react";
import { ScrollView } from "react-native-gesture-handler";
import Ionicons from "react-native-vector-icons/Ionicons";
import Lightbox from "react-native-lightbox-v2";
import Markdown from "react-native-markdown-display";

// Import components
import { FC } from "@/components";

// Import hooks
import { useLanguage } from "@/hooks/useLanguage";
import { usePlaceDetailsState } from "@/hooks/usePlace";

// Import objects
import { PlaceManager } from "@/objects/place";

// Import styles
import { Styles } from "@/styles";
import { styles } from "../styles";

export default function AboutSlide({ placeId }: { placeId: string }) {
  const { language } = useLanguage();

  const placeDetails = usePlaceDetailsState(placeId);
  const [relatedPlaces, setRelatedPlaces] = React.useState<Array<any>>([]);

  React.useEffect(() => {
    if (relatedPlaces.length === 0) {
      PlaceManager.Api.getPlacesAsync({ limit: 5, skip: 0, type })
        .then((data) => {
          setRelatedPlaces(data);
        })
        .catch((error) => console.error(error));
    }
  }, []);

  if (!placeDetails) return;

  const imageUrls = placeDetails.photos ? placeDetails?.photos : [];
  const type = placeDetails.types ? placeDetails.types[0] : "";
  const speech = placeDetails.content
    ? (placeDetails.content.formattedText as any)[language.code]
    : "";
  const _languageData = (language.data as any)["placeDetailScreen"] as any;

  return (
    <View style={styles.pd_content_container}>
      {/* Read */}
      <FC.Speech
        content={speech}
        style={[Styles.spacings.mb_12, Styles.spacings.ph_18]}
      />

      {/* Description */}
      <View style={[styles.pd_content_article, Styles.spacings.ph_18]}>
        <FC.AppText size="h3" numberOfLines={1} style={Styles.spacings.mb_6}>
          {_languageData.description[language.code]}
        </FC.AppText>
        {placeDetails.content ? (
          <Markdown>
            {(placeDetails.content.formattedText as any)[language.code]}
          </Markdown>
        ) : (
          <FC.AppText>
            {_languageData.descriptionMessage[language.code]}
          </FC.AppText>
        )}
      </View>

      {/* Images */}
      <View style={styles.pd_content_article}>
        <FC.AppText
          size="h3"
          numberOfLines={1}
          style={[Styles.spacings.mb_6, Styles.spacings.ph_18]}
        >
          {_languageData.image[language.code]}
        </FC.AppText>
        <View style={styles.pd_content_image_row_container}>
          <ScrollView
            style={Styles.spacings.mb_12}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {imageUrls.map((url, index) => {
              let actualStyle: Array<any> = [
                styles.pd_content_image_button,
                Styles.spacings.me_18,
              ];
              if (index === 0) actualStyle.push(Styles.spacings.ms_18);
              return (
                <FC.RectangleButton
                  isOnlyContent
                  type="highlight"
                  shape="rounded_8"
                  style={actualStyle}
                  key={url}
                >
                  <Image
                    source={{ uri: url }}
                    style={{ width: "100%", aspectRatio: 1 }}
                  />
                </FC.RectangleButton>
              );
            })}
          </ScrollView>
        </View>
      </View>

      {/* Related Places */}
      <View
        style={{
          ...styles.pd_content_article,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          ...Styles.spacings.ph_18,
        }}
      >
        <FC.AppText size="h3" numberOfLines={1} style={Styles.spacings.mb_6}>
          {_languageData.relatedPlaces[language.code]}
        </FC.AppText>
        <FC.CircleButton
          isTransparent
          type="highlight"
          setIcon={<Ionicons name="chevron-forward-outline" size={18} />}
        />
      </View>
      <View style={[Styles.spacings.ph_18]}>
        {relatedPlaces.length === 0 ? (
          <View
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <FC.AppText>
              {_languageData.relatedPlacesDataMessage[language.code]}
            </FC.AppText>
            <Image
              source={require("@/assets/images/no-data.png")}
              style={{
                height: 300,
                width: 300,
                alignSelf: "center",
              }}
            />
          </View>
        ) : (
          relatedPlaces.map((relatedPlace, index) => (
            <FC.HorizontalPlaceCard
              type={relatedPlace.types[0]}
              key={relatedPlace.id}
              placeIndex={index}
              data={relatedPlace}
            />
          ))
        )}
      </View>
    </View>
  );
}
