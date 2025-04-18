import React from "react";
import { View, FlatList } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// Import from assets
import BlogQualitiesData from "@/assets/json/blog-qualities.json";

// Import from components
import { FC } from "@/components";

// Import from hooks
import { useStateManager } from "@/hooks/useStateManager";
import { useBlogs } from "@/hooks/useBlog";
import { useLanguage } from "@/hooks/useLanguage";
import { useTheme } from "@/hooks/useTheme";

// Import from styles
import { Styles } from "@/styles";

// Import screen configs (Import from local)
// Import states
import { StateManager } from "@/screens/blogs/state";

// Import styles
import { styles } from "@/screens/blogs/styles";

// Import utils
import { BlogsScreenUtils } from "@/screens/blogs/utils";

export default function BlogsScreen() {
  const { blogs, currentType, status, blogTypes, blogsDispatchers } =
    useBlogs();
  const { theme } = useTheme();
  const { language } = useLanguage();

  const [state, stateFns] = useStateManager(
    StateManager.getInitialState(),
    StateManager.getStateFns
  );

  const types = React.useMemo(() => {
    return blogTypes.map((blogType) => ({
      value: blogType.value,
      label: blogType.name,
    }));
  }, [blogTypes]);

  const _languageData = (language.data as any)["blogsScreen"] as any;

  React.useEffect(() => {
    // Fetch blogs when list is empty
    if (!blogs || blogs.length === 0) {
      blogsDispatchers.fetchBlogs(state.currentType);
    }
    // Fetch blogs when type is changed
    else if (currentType !== state.currentType) {
      blogsDispatchers.clear();
    }
  }, [state.currentType, blogs]);

  // Fetch types of blog
  React.useEffect(() => {
    blogsDispatchers.fetchBlogTypes();
  }, []);

  return (
    <View style={{ backgroundColor: theme.background }}>
      {state.isOnTop && (
        <View
          style={[
            Styles.spacings.ph_18,
            {
              backgroundColor: theme.background,
              position: "relative",
              zIndex: 2,
            },
          ]}
        >
          <FC.RectangleButton
            type="highlight"
            defaultColor="type_5"
            style={[{ justifyContent: "space-between" }, Styles.spacings.mt_12]}
            onPress={() => {
              router.navigate("/blogs/create");
            }}
          >
            {(isActive, currentLabelStyle) => (
              <>
                <FC.AppText
                  size="h2"
                  style={[{ width: 140 }, currentLabelStyle]}
                >
                  {_languageData["banner_button"][language.code]}
                </FC.AppText>
                <Ionicons name="pencil" style={currentLabelStyle} size={25} />
              </>
            )}
          </FC.RectangleButton>
        </View>
      )}
      <FlatList
        data={blogs ? blogs : []}
        style={[
          styles.scroll_view_container,
          { backgroundColor: theme.background },
        ]}
        contentContainerStyle={{
          paddingBottom: 200,
          backgroundColor: theme.background,
        }}
        onMomentumScrollEnd={() =>
          BlogsScreenUtils.handleOnMomentumScrollEnd(
            state,
            blogs,
            blogsDispatchers.fetchBlogs
          )
        }
        onEndReached={(e) => BlogsScreenUtils.handleOnEndReached(state)}
        onScroll={(e) =>
          BlogsScreenUtils.handleOnScroll(e, stateFns.setIsOnTop)
        }
        scrollEventThrottle={1000}
        stickyHeaderHiddenOnScroll
        stickyHeaderIndices={[0]}
        ListEmptyComponent={
          <View style={[Styles.spacings.mh_18, Styles.spacings.mb_12]}>
            {[1, 2, 3, 4, 5].map((value, index) => (
              <FC.Skeletons.HorizontalBlogCard key={value + index} />
            ))}
          </View>
        }
        ListHeaderComponent={
          <FC.ButtonsScrollBar
            buttonContents={types}
            buttonType="capsule"
            onButtonPress={(content) => stateFns.setCurrentType(content.value)}
            scrollStyle={[Styles.spacings.ps_18, Styles.spacings.pv_12]}
            containerStyle={[
              Styles.spacings.pv_10,
              { backgroundColor: theme.background },
            ]}
          />
        }
        renderItem={(item) => (
          <View style={Styles.spacings.ph_18}>
            <FC.HorizontalBlogCard data={item.item} type={state.currentType} />
          </View>
        )}
        keyExtractor={(item) => item._id as string}
        onRefresh={() => {
          blogsDispatchers.clear();
        }}
        refreshing={status.isFetching}
      />
    </View>
  );
}
