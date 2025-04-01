import React from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

// Import components
import { FC } from "@/components";

// Import objects
import { PlaceManager } from "@/objects/place";
import { BlogManager } from "@/objects/blog";
import { UserManager } from "@/objects/user";

// Import hooks
import { useStateManager } from "@/hooks/useStateManager";
import { useTheme } from "@/hooks/useTheme";

import { StateManager, SEARCH_TYPES } from "@/screens/search/state";

// Import styles
import { Styles } from "@/styles";

// Import types
import type { Place } from "@/objects/place/type";
import type { Blog } from "@/objects/blog/type";
import type { User } from "@/objects/user/type";
import type { SearchResult } from "@/screens/search/types";

export default function SearchScreen() {
  const { theme } = useTheme();
  const [state, stateFns] = useStateManager(
    StateManager.getInitialState(),
    StateManager.getStateFns
  );

  // Mock API function - Thay thế bằng API thực tế sau này
  const searchAPI = async (text: string): Promise<SearchResult[]> => {
    if (state.type === "place") {
      return await PlaceManager.Api.getPlacesAsync({
        limit: 999999,
        name: text,
      });
    }

    if (state.type === "blog") {
      return (
        (await BlogManager.Api.getBlogsAsync({
          limit: 999999,
          name: text,
        })) || []
      );
    }

    return (
      (await UserManager.Api.getUsersAsync({
        limit: 999999,
        name: text,
      })) || []
    );
  };

  const handleSearchCallback = (searchString: string, data: SearchResult[]) => {
    stateFns.setSearchResults(data);
  };

  const renderSearchResult = (item: SearchResult) => {
    if (state.type === "place") {
      return (
        <View
          style={[
            styles.resultItem,
            { backgroundColor: theme.background },
            Styles.spacings.pv_12,
            Styles.spacings.ph_18,
          ]}
        >
          {(item as Place).photos[0] ? (
            <Image
              style={[
                { width: "15%", aspectRatio: 1 },
                Styles.spacings.me_12,
                Styles.shapes.rounded_8,
              ]}
              source={{ uri: (item as Place).photos[0] }}
            />
          ) : (
            <View
              style={[
                {
                  width: "10%",
                  aspectRatio: 1,
                  alignItems: "center",
                  justifyContent: "center",
                },
                Styles.spacings.me_12,
                Styles.shapes.rounded_8,
              ]}
            >
              <Ionicons size={24} name="globe" />
            </View>
          )}
          <FC.AppText style={{ width: "80%" }}>
            {(item as Place).name}
          </FC.AppText>
        </View>
      );
    }

    if (state.type === "blog") {
      return (
        <View
          style={[
            styles.resultItem,
            { backgroundColor: theme.background },
            Styles.spacings.pv_12,
            Styles.spacings.ph_18,
          ]}
        >
          {(item as Blog).coverImage ? (
            <Image
              style={[
                { width: "15%", aspectRatio: 1 },
                Styles.spacings.me_12,
                Styles.shapes.rounded_8,
              ]}
              source={{ uri: (item as Blog).coverImage }}
            />
          ) : (
            <View
              style={[
                {
                  width: "10%",
                  aspectRatio: 1,
                  alignItems: "center",
                  justifyContent: "center",
                },
                Styles.spacings.me_12,
                Styles.shapes.rounded_8,
              ]}
            >
              <Ionicons size={24} name="paper" />
            </View>
          )}
          <FC.AppText style={{ width: "80%" }}>
            {(item as Blog).name}
          </FC.AppText>
        </View>
      );
    }

    return (
      <View
        style={[
          styles.resultItem,
          { backgroundColor: theme.background },
          Styles.spacings.pv_12,
          Styles.spacings.ph_18,
        ]}
      >
        {(item as User).avatar ? (
          <Image
            style={[
              { width: "15%", aspectRatio: 1 },
              Styles.spacings.me_12,
              Styles.shapes.rounded_8,
            ]}
            source={{ uri: (item as User).avatar }}
          />
        ) : (
          <View
            style={[
              {
                width: "10%",
                aspectRatio: 1,
                alignItems: "center",
                justifyContent: "center",
              },
              Styles.spacings.me_12,
              Styles.shapes.rounded_8,
            ]}
          >
            <Ionicons size={24} name="person" />
          </View>
        )}

        <FC.AppText style={{ width: "80%" }}>
          {(item as User).displayName}
        </FC.AppText>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      {/* Ensure full height */}
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={Styles.spacings.p_18}>
          <FC.Search
            placeHolder="Tìm kiếm địa điểm..."
            callBack={handleSearchCallback}
            apis={[searchAPI]}
          />
          <ScrollView style={Styles.spacings.mt_18} horizontal>
            {SEARCH_TYPES.map((type) => (
              <FC.RectangleButton
                isActive={type === state.type}
                defaultColor="type_3"
                key={type}
                onPress={() => {
                  stateFns.changeSearchType(type);
                  stateFns.setSearchResults([]);
                }}
                style={Styles.spacings.me_12}
              >
                {type}
              </FC.RectangleButton>
            ))}
          </ScrollView>
        </View>
        <FlatList
          data={state.searchResults}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={() => (
            <View style={Styles.spacings.p_18}>
              <FC.AppText style={{ textAlign: "center" }}>
                Search result is empty, type some keywords to find...
              </FC.AppText>
            </View>
          )}
          renderItem={({ item }) => renderSearchResult(item)}
          keyExtractor={(item) => item._id}
          style={{ flex: 1 }}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});
