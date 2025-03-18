import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, FlatList, Text } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Place } from '@/objects/map/types';
import { useTheme } from '@/hooks/useTheme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
  onPlaceSelect: (place: Place) => void;
  suggestions: Place[];
}

export interface SearchBarRef {
  focus: () => void;
  blur: () => void;
  clear: () => void;
}

const SearchBar = forwardRef<SearchBarRef, SearchBarProps>(
  ({ value, onChangeText, onClear, onPlaceSelect, suggestions }, ref) => {
    const { theme } = useTheme();
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = React.useRef<TextInput>(null);

    useImperativeHandle(ref, () => ({
      focus: () => {
        inputRef.current?.focus();
      },
      blur: () => {
        inputRef.current?.blur();
      },
      clear: () => {
        inputRef.current?.clear();
        onClear();
      },
    }));

    const handleClear = () => {
      inputRef.current?.clear();
      onClear();
    };

    const renderSuggestionItem = ({ item }: { item: Place }) => {
      return (
        <TouchableOpacity
          style={[styles.suggestionItem, { backgroundColor: theme.background }]}
          onPress={() => {
            onPlaceSelect(item);
            setIsFocused(false);
            inputRef.current?.blur();
          }}
        >
          <MaterialIcons name="place" size={20} color={theme.primary} style={styles.itemIcon} />
          <View style={styles.itemContent}>
            <Text style={[styles.itemTitle, { color: theme.text }]} numberOfLines={1}>{item.name}</Text>
            {item.address && (
              <Text style={[styles.itemSubtitle, { color: theme.textLight }]} numberOfLines={1}>
                {item.address}
              </Text>
            )}
          </View>
        </TouchableOpacity>
      );
    };

    return (
      <View style={styles.container}>
        <View
          style={[
            styles.searchContainer,
            { backgroundColor: theme.card },
            isFocused && styles.searchContainerFocused,
          ]}
        >
          <View style={styles.inputContainer}>
            <Feather name="search" size={20} color={theme.textLight} style={styles.searchIcon} />
            <TextInput
              ref={inputRef}
              style={[styles.input, { color: theme.text }]}
              placeholder="Tìm kiếm địa điểm..."
              placeholderTextColor={theme.textLight}
              value={value}
              onChangeText={onChangeText}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              returnKeyType="search"
            />
            {value !== '' && (
              <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
                <Feather name="x" size={20} color={theme.textLight} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Suggestions list */}
        {isFocused && suggestions.length > 0 && (
          <View style={[styles.suggestionsContainer, { backgroundColor: theme.card }]}>
            <FlatList
              data={suggestions}
              renderItem={renderSuggestionItem}
              keyExtractor={(item) => item.id}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    zIndex: 1,
  },
  searchContainer: {
    borderRadius: 8,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  searchContainerFocused: {
    borderColor: '#FF5722',
    borderWidth: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 44,
    fontSize: 16,
  },
  clearButton: {
    padding: 5,
  },
  suggestionsContainer: {
    marginTop: 5,
    borderRadius: 8,
    maxHeight: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  itemIcon: {
    marginRight: 10,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '500',
  },
  itemSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
});

export default SearchBar; 