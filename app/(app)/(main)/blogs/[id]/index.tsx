import { View, ScrollView, Image, Animated } from "react-native";
import React from "react";
import { router, useNavigation } from "expo-router";
import { useRoute } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Markdown from "react-native-markdown-display";

// Import components
import { FC } from "@/components";
import BlogDetailSkeleton from "@/screens/blog-detail/components/skeleton";

// Import hooks
import { useTheme } from "@/hooks/useTheme";
import { useAuthState } from "@/hooks/useAuth";
import { useBlogDetails } from "@/hooks/useBlog";

// Import objects
import { BlogManager } from "@/objects/blog";

// Import utils
import { NumberUtils } from "@/utils/number";
import { DatetimeUtils } from "@/utils/datetime";

// Import styles
import { Styles } from "@/styles";
import { styles } from "@/screens/blog-detail/styles";

// Import types
import type { Blog } from "@/objects/blog/type";
import type { NativeSyntheticEvent, NativeScrollEvent } from "react-native";

export default function BlogDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params as any;

  const { user } = useAuthState();
  const { theme } = useTheme();
  const { blog, blogDispatchers } = useBlogDetails(id);

  const [relatedBlogs, setRelatedBlogs] = React.useState<Array<Blog>>([]);

  // Dành để tranform thằng Float Buttons
  const floatButtonTranslateYAnim = React.useRef(new Animated.Value(0)).current;
  const offSetY = React.useRef(0);

  const handleOnScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    let { contentOffset } = e.nativeEvent;
    let diff = contentOffset.y - (offSetY.current || 0);
    if (diff > 0) {
      toggleFloatButtonsVisible(1);
    } else {
      toggleFloatButtonsVisible(0);
    }
    offSetY.current = contentOffset.y;
  };

  const handleLikeButton = function () {
    BlogManager.toggleLike(
      blog,
      blogDispatchers.likeBlog,
      blogDispatchers.unlikeBlog
    );
  };

  const toggleFloatButtonsVisible = (value: number) => {
    Animated.spring(floatButtonTranslateYAnim, {
      toValue: value,
      useNativeDriver: true,
    }).start();
  };

  React.useEffect(() => {
    if (blog) navigation.setOptions({ title: blog.name });
    console.log("Id:", id);
    console.log("Blog:", blog);
    blogDispatchers.fetchBlogDetail(id);
    // import("@/assets/mock-data/blog/content.json").then((data) => {
    //   setContent(data.data);
    // });

    if (relatedBlogs.length === 0) {
      BlogManager.Api.getBlogsAsync({
        limit: 5,
        skip: 0,
        type: blog.type._id,
      })
        .then((data) => {
          if (!data || data.length === 0) return;
          setRelatedBlogs(data);
        })
        .catch(console.error);
    }
    return function () {
      // clearBlogDetails(id);
    };
  }, [id]);

  if (!blog) {
    return <BlogDetailSkeleton />;
  }

  const type = blog.type.name ? blog.type.name : "";
  const displayAuthorName =
    blog.author.lastName && blog.author.firstName
      ? blog.author.lastName + " " + blog.author.firstName
      : blog.author.displayName;

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView
        style={[styles.bd_container, { backgroundColor: theme.background }]}
        contentContainerStyle={{ paddingBottom: 120 }}
        onScroll={handleOnScroll}
        scrollEventThrottle={1000}
      >
        {/* Author, Blog information section */}
        <View
          style={[
            styles.bd_header,
            Styles.spacings.mt_12,
            { borderBottomColor: theme.outline },
          ]}
        >
          <View
            style={[
              styles.bd_row,
              Styles.spacings.mb_12,
              { justifyContent: "space-between" },
            ]}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FC.CircleButton
                isOnlyContent
                defaultColor="type_6"
                setIcon={
                  blog.author.avatar ? (
                    <Image
                      style={styles.avatar}
                      source={{ uri: blog.author.avatar }}
                    />
                  ) : (
                    <Ionicons
                      style={{ margin: -6 }}
                      size={48}
                      name="person-circle-outline"
                    />
                  )
                }
              />

              {/* Author name and other information  */}
              <View style={Styles.spacings.ms_12}>
                <FC.AppText size="h5">{displayAuthorName}</FC.AppText>
                <FC.AppText size="sub1">{`${DatetimeUtils.getShortDateStr(blog.createdAt!)} - ${DatetimeUtils.toMinute(blog.readTime!)} min read`}</FC.AppText>
              </View>
            </View>

            {/* Follow button */}
            <FC.RectangleButton
              defaultColor="type_5"
              shape="capsule"
              style={Styles.spacings.pv_0}
            >
              {blog.isLiked ? 'Following' : 'Follow'}
            </FC.RectangleButton>
          </View>

          <View style={[styles.bd_row, Styles.spacings.mb_12]}>
            <FC.AppText size="h2">{blog.name}</FC.AppText>
          </View>

          <View style={[styles.bd_row, Styles.spacings.mb_12]}>
            <FC.CircleButton
              defaultColor="type_5"
              style={Styles.spacings.me_8}
              type="highlight"
              setIcon={<Ionicons name="share-outline" size={14} />}
              onPress={() => {}}
            />
            <FC.CircleButton
              defaultColor="type_5"
              style={Styles.spacings.me_8}
              type="highlight"
              setIcon={<Ionicons name="flag" size={14} />}
            />
          </View>

          {/* Tags */}
          <View style={styles.bd_row}>
            <FC.AppText size="body2" style={Styles.spacings.me_12}>
              <Ionicons name="pricetag-outline" /> Thể loại:
            </FC.AppText>
            <FC.RectangleButton
              defaultColor="type_5"
              type="highlight"
              shape="rounded_4"
              style={[
                Styles.spacings.ph_8,
                Styles.spacings.pv_0,
                Styles.spacings.me_6,
              ]}
            >
              {type}
              {/* {
                (isActive, currentLabelStyle) => (<FC.AppText size="body3" style={currentLabelStyle}>{blog.type}</FC.AppText>)
              } */}
            </FC.RectangleButton>
          </View>

          {/* Speech, tạm thời vẫn chưa có, cho nên là chờ ở đây thôi */}
          <FC.Speech
            text={blog.plainContent}
            // content={blog.content?.speech}
            langCode="vi"
            style={Styles.spacings.mt_12}
          />
        </View>

        {/* Blog content */}
        <View style={styles.bd_content_container}>
          {blog.content && <Markdown>{blog.content}</Markdown>}
        </View>

        {/* Blog images */}
        <View style={styles.bd_content_container}>
          <ScrollView
            style={Styles.spacings.mb_12}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {blog.images &&
              blog.images.map((url, index) => {
                let actualStyle: Array<any> = [
                  styles.bd_content_image_button,
                  Styles.spacings.me_18,
                ];
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

        {/* Related blogs */}
        <View
          style={[
            styles.bd_content_container,
            {
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            },
          ]}
        >
          <FC.AppText size="h3" numberOfLines={1} style={Styles.spacings.mb_6}>
            Related Blogs
          </FC.AppText>
          <FC.CircleButton
            isTransparent
            type="highlight"
            setIcon={<Ionicons name="chevron-forward-outline" size={18} />}
          />
        </View>
        <View>
          {relatedBlogs.length === 0 ? (
            <FC.NoData />
          ) : (
            relatedBlogs.map((relatedBlog: any, index) => (
              <FC.HorizontalBlogCard
                key={relatedBlog._id}
                type={relatedBlog.type}
                data={relatedBlog}
              />
            ))
          )}
        </View>
      </ScrollView>

      {/* Float container */}
      <Animated.View
        style={[
          styles.float_button_container,
          {
            backgroundColor: theme.subBackground,
            transform: [
              {
                translateY: floatButtonTranslateYAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 100],
                }),
              },
            ],
          },
        ]}
      >
        <View
          style={[
            Styles.spacings.me_6,
            {
              flexDirection: "row",
              alignItems: "center",
            },
          ]}
        >
          <FC.CircleButton
            isActive={blog.isLiked}
            defaultColor="type_5"
            activeColor="type_1"
            style={Styles.spacings.me_6}
            type="highlight"
            setIcon={
              <Ionicons
                name={blog.isLiked ? "heart" : "heart-outline"}
                size={14}
              />
            }
            onPress={handleLikeButton}
          />
          <FC.AppText size="body2">
            {NumberUtils.toMetricNumber(blog.totalFavorites!)}
          </FC.AppText>
        </View>
        <View style={styles.seperate} />
        <View
          style={[
            Styles.spacings.me_12,
            { flexDirection: "row", alignItems: "center" },
          ]}
        >
          <FC.CircleButton
            defaultColor="type_5"
            style={Styles.spacings.me_6}
            type="highlight"
            onPress={() => {
              router.navigate({
                pathname: "/blogs/[id]/comments",
                params: { id: blog._id },
              });
            }}
            setIcon={<Ionicons name="chatbox-outline" size={14} />}
          />
          <FC.AppText size="body2">
            {NumberUtils.toMetricNumber(blog.totalComments!)}
          </FC.AppText>
        </View>
      </Animated.View>
    </View>
  );
}
