import * as React from "react";
import { ScrollView, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// Import from components
import { FC } from "@/components";

// Import from hooks
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";
import { usePlaces } from "@/hooks/usePlace";
import { useBlogs } from "@/hooks/useBlog";

// Import from styles
import { styles } from "@/screens/home/styles";
import { Styles } from "@/styles";
import HomeBannerSlider from "@/screens/home/components/HomeBannerSlider";

export default function HomeScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { language } = useLanguage();

  const _languageData = (language.data as any)["homeScreen"] as any;
  // const [weather, setWeather] = React.useState<any>(null);
  const [typePlace, setTypePlace] = React.useState("all");
  const [typeBlog, setTypeBlog] = React.useState("all");

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

  React.useEffect(() => {
    placesDispatchers.fetchPlaces();
    blogsDispatchers.fetchBlogs();
  }, []);

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
            <FC.Skeleton height="65%" />
          </View>
        </View>
        {/*  end weather */}
        {/* Place */}
        <View style={[{ backgroundColor: theme.background }]}>
          <TouchableOpacity
            style={[styles.category_header, Styles.spacings.ph_18]}
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
        </View>
        {/* end place */}

        {/* Blog */}
        <View style={[{ backgroundColor: theme.background }]}>
          <TouchableOpacity
            style={[styles.category_header, Styles.spacings.ph_18]}
            onPress={() => router.push("/blogs")}
          >
            <FC.AppText size="h2">
              {_languageData["title_blog"][language.code]}
            </FC.AppText>
            <Ionicons name="chevron-forward-outline" size={25} color="black" />
          </TouchableOpacity>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={[{ backgroundColor: theme.background }]}
            contentContainerStyle={[{ flexGrow: 1 }, Styles.spacings.pb_18]}
          >
            {!blogs || blogs.length === 0
              ? [1, 2, 3, 4, 5].map((value, index) => {
                  return (
                    <FC.Skeletons.VerticalBlogCard
                      key={value + index}
                      style={{
                        marginLeft: index === 0 ? 16 : 0,
                        marginRight: 16,
                      }}
                    />
                  );
                })
              : blogs.map((blog: any, index: number) => {
                  return (
                    <FC.VerticalBlogCard
                      blog={blog}
                      key={index}
                      style={{
                        marginLeft: index === 0 ? 16 : 0,
                        marginRight: 16,
                      }}
                    />
                  );
                })}
          </ScrollView>
        </View>
        {/* end blog */}
      </View>
    </ScrollView>
  );
}
