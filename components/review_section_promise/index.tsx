import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { Linking } from "react-native";
import moment from "moment/moment";
import "moment/locale/vi"; // without this line it didn't work

// Import components
import StarRating from "../star_rating";

// Import styles
import { styles } from "./styles";

// Setup moment
moment.locale("vi");

export const ReviewSectionPromise = ({ review, isTranformData }: any) => {
  // const [urlBase64, setUrlBase64] = useState(null)

  // useEffect(() => {
  //   getUrlBase64()
  // }, [review.profile_photo_url])

  // const getUrlBase64 = async () => {
  //   if (!isTranformData) {
  //     const res = await axios.get(review.profile_photo_url, {responseType: 'arraybuffer'})
  //     const urlBase64 = Buffer.from(res.data, 'binary').toString('base64')

  //     setUrlBase64(urlBase64)
  //   } else {
  //     setUrlBase64(review.profile_photo_url)
  //   }
  // }
  // if (urlBase64)

  return (
    <>
      <View style={styles.seperate} />
      <View style={styles.contentContainer}>
        <View style={styles.authenContainer}>
          <TouchableOpacity onPress={() => Linking.openURL(review?.author_url)}>
            <Image
              // source={{uri: `data:image/jpeg;base64,${urlBase64}`}}
              source={{ uri: review?.profile_photo_url }}
              style={styles.avatar}
              resizeMode="cover"
            />
          </TouchableOpacity>
          <View style={styles.nameAuthorRatingContainer}>
            <Text style={styles.authorName}>{review?.author_name}</Text>
            <StarRating
              ratings={review?.rating}
              reviews={moment(
                moment(review?.time * 1000).format("YYYYMMDD"),
                "YYYYMMDD"
              ).fromNow()}
              isHaveRatingText={false}
            />
          </View>
        </View>
        <Text style={styles.textContent}>{review?.text}</Text>
      </View>
    </>
  );
};

export default ReviewSectionPromise;
