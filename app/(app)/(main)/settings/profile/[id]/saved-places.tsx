import React from "react";

import { View, FlatList } from "react-native";



// Import from components

import { FC } from "@/components";



// Import from hooks

import { usePlaces } from "@/hooks/usePlace";

import { useTheme } from "@/hooks/useTheme";

import { useLanguage } from "@/hooks/useLanguage";

import { useAuth } from "@/hooks/useAuth";



// Import from styles

import { Styles } from "@/styles";



// Import types

import type { Place } from "@/objects/place/type";



export default function SavedPlacesScreen() {

  const { places, placesDispatchers } = usePlaces();

  const { theme } = useTheme();

  const { language } = useLanguage();

  const { user } = useAuth();



  const _languageData = (language.data as any)["savedPlacesScreen"] as any;



  // Filter to get only the favorited places

  const favoritedPlaces = React.useMemo(() => {

    return places?.filter(place => place.isFavorited) || [];

  }, [places]);



  // Fetch saved places when component mounts

  React.useEffect(() => {

    if (user?._id) {

      // Fetch all places to then filter client-side

      placesDispatchers.fetchPlaces("all");

    }

  }, [user?._id]);



  return (

    <View style={{ flex: 1, backgroundColor: theme.background }}>

      <FlatList

        data={favoritedPlaces}

        style={[{ backgroundColor: theme.background }]}

        contentContainerStyle={{

          paddingBottom: 100,

          backgroundColor: theme.background,

        }}

        ListEmptyComponent={

          <View style={[Styles.spacings.mh_18, Styles.spacings.mb_12]}>

            {[1, 2, 3].map((value, index) => (

              <FC.Skeletons.HorizontalPlaceCard key={`skeleton-${index}`} />

            ))}

          </View>

        }

        renderItem={({ item }) => (

          <View style={Styles.spacings.ph_18}>

            <FC.HorizontalPlaceCard 

              data={item} 

              type={item.types?.[0]?.value || "default"} 

            />

          </View>

        )}

        keyExtractor={(item) => item._id || Math.random().toString()}

        onRefresh={() => {

          if (user?._id) {

            placesDispatchers.clear();

            placesDispatchers.fetchPlaces("all");

          }

        }}

        refreshing={false}

      />

    </View>

  );

}
