import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";

// Import components
import Search from "@/components/search/search";
import SearchResultList from "@/components/search/search-result-list";

// Import hooks
import { useTheme } from "@/hooks/useTheme";
import { SearchResult } from "@/app/types/search";

// Import types

export default function SearchScreen() {
  const { theme } = useTheme();
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  // Mock API function - Thay thế bằng API thực tế sau này
  const searchAPI = async (text: string): Promise<SearchResult[]> => {
    // Mock data
    return [
      {
        place_id: "1",
        name: "Địa điểm 1",
        _dataType: "place",
      },
      {
        place_id: "2",
        name: "Địa điểm 2",
        _dataType: "place",
      },
    ];
  };

  const handleSearchCallback = (searchString: string, data: SearchResult[]) => {
    setSearchResults(data);
  };

  const renderSearchResult = (item: SearchResult) => {
    return (
      <View style={[styles.resultItem, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.onBackground }}>{item.name}</Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Search
        placeHolder="Tìm kiếm địa điểm..."
        callBack={handleSearchCallback}
        apis={[searchAPI]}
      />
      <SearchResultList
        results={searchResults}
        resultListPosition="normal"
        renderResultItem={renderSearchResult}
        keyExtractor={(item) => item.place_id}
        scrollEnabled={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  resultItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});
