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

// Import component
import { HomeWeather } from "@/components/home_weather";

export default function HomeScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { language } = useLanguage();

  const _languageData = React.useMemo(
    () => (language.data as any)["homeScreen"] as any,
    [language.data]
  );

  const { places, placesDispatchers } = usePlaces();
  const { blogs, blogsDispatchers } = useBlogs();

  React.useEffect(() => {
    placesDispatchers.fetchPlaces();
    blogsDispatchers.fetchBlogs();
  }, []);

  const handleExplorePress = React.useCallback(() => {
    router.push("/explore");
  }, [router]);

  const handleBlogsPress = React.useCallback(() => {
    router.push("/blogs");
  }, [router]);

  const renderPlaceSkeleton = React.useCallback((value: number, index: number) => (
    <FC.Skeletons.VerticalPlaceCard
      key={`place-skeleton-${value}-${index}`}
      style={[
        Styles.spacings.me_10,
        index === 0 && Styles.spacings.ms_10,
      ]}
    />
  ), []);

  const renderPlace = React.useCallback((place: any, index: number) => (
    <FC.VerticalPlaceCard
      data={place}
      key={place._id}
      style={[
        Styles.spacings.me_12,
        index === 0 && Styles.spacings.ms_18,
      ]}
    />
  ), []);

  const renderBlogSkeleton = React.useCallback((value: number, index: number) => (
    <FC.Skeletons.VerticalBlogCard
      key={`blog-skeleton-${value}-${index}`}
      style={{
        marginLeft: index === 0 ? 16 : 0,
        marginRight: 16,
      }}
    />
  ), []);

  const renderBlog = React.useCallback((blog: any, index: number) => (
    <FC.VerticalBlogCard
      data={blog}
      key={blog._id}
      style={{
        marginLeft: index === 0 ? 16 : 0,
        marginRight: 16,
      }}
    />
  ), []);

  const isPlacesLoading = !places || places.length === 0;
  const isBlogsLoading = !blogs || blogs.length === 0;

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={styles.home_content}>
        {/* Header home */}
        <View style={styles.home_banner}>
          <HomeBannerSlider />
        </View>

        {/* Weather */}
        <View style={styles.home_temperature}>
          <HomeWeather />
        </View>

        {/* Place */}
        <View style={{ backgroundColor: theme.background }}>
          <TouchableOpacity
            style={[styles.category_header, Styles.spacings.ph_18]}
            onPress={handleExplorePress}
          >
            <FC.AppText size="h2">
              {_languageData["title_place"][language.code]}
            </FC.AppText>
            <Ionicons name="chevron-forward-outline" size={25} color={theme.onBackground} />
          </TouchableOpacity>

          <ScrollView
            horizontal
            contentContainerStyle={[{ flexGrow: 1 }, Styles.spacings.pb_18]}
            showsHorizontalScrollIndicator={false}
          >
            {isPlacesLoading
              ? [1, 2, 3, 4, 5].map(renderPlaceSkeleton)
              : places.map(renderPlace)}
          </ScrollView>
        </View>

        {/* Blog */}
        <View style={{ backgroundColor: theme.background }}>
          <TouchableOpacity
            style={[styles.category_header, Styles.spacings.ph_18]}
            onPress={handleBlogsPress}
          >
            <FC.AppText size="h2">
              {_languageData["title_blog"][language.code]}
            </FC.AppText>
            <Ionicons name="chevron-forward-outline" size={25} color={theme.onBackground} />
          </TouchableOpacity>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ backgroundColor: theme.background }}
            contentContainerStyle={[{ flexGrow: 1 }, Styles.spacings.pb_18]}
          >
            {isBlogsLoading
              ? [1, 2, 3, 4, 5].map(renderBlogSkeleton)
              : blogs.map(renderBlog)}
          </ScrollView>
        </View>
      </View>
    </ScrollView>
  );
}
