import React from "react";
import { View, FlatList } from "react-native";

// Import from components
import { FC } from "@/components";

// Import from hooks
import { useBlogs } from "@/hooks/useBlog";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";

// Import from styles
import { Styles } from "@/styles";

// Import types
import type { Blog } from "@/objects/blog/type";

export default function SavedBlogsScreen() {
  const { blogs, blogsDispatchers } = useBlogs();
  const { theme } = useTheme();
  const { language } = useLanguage();
  const { user } = useAuth();

  const _languageData = (language.data as any)["savedBlogsScreen"] as any;

  // Filter to get only the favorited blogs
  const favoritedBlogs = React.useMemo(() => {
    return blogs?.filter(blog => blog.isLiked) || [];
  }, [blogs]);

  // Fetch saved blogs when component mounts
  React.useEffect(() => {
    if (user?._id) {
      // Fetch all blogs to then filter client-side
      blogsDispatchers.fetchBlogs("all");
    }
  }, [user?._id]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <FlatList
        data={favoritedBlogs}
        style={[{ backgroundColor: theme.background }]}
        contentContainerStyle={{
          paddingBottom: 100,
          backgroundColor: theme.background,
        }}
        ListEmptyComponent={
          <View style={[Styles.spacings.mh_18, Styles.spacings.mb_12]}>
            {[1, 2, 3].map((value, index) => (
              <FC.Skeletons.HorizontalBlogCard key={`skeleton-${index}`} />
            ))}
          </View>
        }
        renderItem={({ item }) => (
          <View style={Styles.spacings.ph_18}>
            <FC.HorizontalBlogCard 
              data={item} 
              type={item.type || "default"} 
            />
          </View>
        )}
        keyExtractor={(item) => item._id || Math.random().toString()}
        onRefresh={() => {
          if (user?._id) {
            blogsDispatchers.clear();
            blogsDispatchers.fetchBlogs("all");
          }
        }}
        refreshing={false}
      />
    </View>
  );
}