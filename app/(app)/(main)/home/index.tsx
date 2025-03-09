import * as React from "react";
import { ScrollView, View, Text, TouchableOpacity } from "react-native";

// Import from components
import { FC } from "@/components";

// Import from hooks
import { useTheme } from "@/hooks/useTheme";

// Import from styles
import { styles } from "@/screens/home/styles";
import { Ionicons } from "@expo/vector-icons";
import HomeBannerSlider from "@/screens/home/components/HomeBannerSlider";
import { useRouter } from "expo-router";
import { useLanguage } from "@/hooks/useLanguage";
import { usePlaces } from "@/hooks/usePlace";
import { Styles } from "@/styles";
import { useBlogs } from "@/hooks/useBlog";

export default function HomeScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { language } = useLanguage();

  const _languageData = (language.data as any)["homeScreen"] as any;
  // const [weather, setWeather] = React.useState<any>(null);
  const [typePlace, setTypePlace] = React.useState("all");
  const [typeBlog, setTypeBlog] = React.useState("all");
  // const [places, setPlaces] = React.useState(null);
  // const [blogs, setBlogs] = React.useState(null);

  const previousTypes = React.useRef({
    place: typePlace,
    blog: typeBlog,
  });

  const { places, placeTypes, placesDispatchers } = usePlaces();
  console.log("🚀 ~ HomeScreen ~ places:", places);

  const { blogs, blogTypes, blogsDispatchers } = useBlogs();
  console.log("🚀 ~ HomeScreen ~ blogs:", blogs);

  function capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={[styles.container]}>
      <View style={[styles.home_content]}>
        {/* Header home */}
        <View style={[styles.home_banner]}>
          <HomeBannerSlider />
        </View>
        {/* end header  */}
        {/* Weather */}
        <View style={[styles.home_temperature]}>
          <View style={[styles.temperature]}>
            <FC.Skeleton width="60%" height="65%" />
            <FC.Skeleton width="20%" height="65%" />
          </View>
        </View>
        {/*  end weather */}
        {/* Place */}
        <View>
          <TouchableOpacity
            style={styles.category_header}
            onPress={() => router.push("/explore")}
          >
            <FC.AppText size="h2">
              {_languageData["title_place"][language.code]}
            </FC.AppText>
            <Ionicons name="chevron-forward-outline" size={25} color="black" />
          </TouchableOpacity>
          {/* <FC.TypeScrollView 
           types={PLACE_QUALITIES[language.code].values}
            labels={PLACE_QUALITIES[language.code].labels}
            callBack={setTypePlace}
            scrollStyle={[Styles.spacings.mb_12, Styles.spacings.ps_18]}
            containerStyle={Styles.spacings.pv_10} /> 
          <FC.VerticalPlaceCardSkeleton /> */}
          <ScrollView
            horizontal
            contentContainerStyle={[{ flexGrow: 1 }, Styles.spacings.pb_18]}
            showsHorizontalScrollIndicator={false}
          >
            {/* {!places || places.length === 0 ? ( */}
            {!places || places.length === 0
              ? [1, 2, 3, 4, 5].map((value, index) => {
                  return (
                    <FC.Skeletons.VerticalPlaceCard
                      key={value + index}
                      style={[
                        Styles.spacings.me_10,
                        index === 0 && Styles.spacings.ms_10,
                      ]}
                    />
                  );
                })
              : places.map((place: any, index: number) => {
                  return (
                    <FC.VerticalPlaceCard
                      place={place}
                      placeIndex={index}
                      key={place.place_id}
                      style={[
                        Styles.spacings.me_12,
                        index === 0 && Styles.spacings.ms_18,
                      ]}
                      typeOfBriefPlace={typePlace}
                    />
                  );
                })}
          </ScrollView>
          {/* </FC.TypeScrollView> */}
        </View>
        {/* end place */}

        {/* Blog */}
        <View style={[{ backgroundColor: theme.background }]}>
          <TouchableOpacity
            style={styles.category_header}
            onPress={() => router.push("/blogs")}
          >
            <FC.AppText>
              {/* {_languageData["title_blog"][language.code]} */}
              Blog
            </FC.AppText>
            <Ionicons name="chevron-forward-outline" size={25} color="black" />
          </TouchableOpacity>
          {/* <FC.TypeScrollView> */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={[{ backgroundColor: theme.background }]}
            contentContainerStyle={[{ flexGrow: 1 }, Styles.spacings.pb_18]}
          >
            {!blogs || blogs.length === 0
              ? [1, 2, 3, 4, 5].map((value, index) => {
                  return <FC.Skeletons.VerticalBlogCard key={value + index} />;
                })
              : blogs.map((blog: any, index: number) => {
                  return <FC.VerticalBlogCard blog={blog} key={index} />;
                })}
          </ScrollView>
          {/* </FC.TypeScrollView> */}
        </View>
        {/* end blog */}
      </View>
    </ScrollView>
  );
}
