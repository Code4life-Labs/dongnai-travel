import React from "react";
import { View, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

// Import from assets
import PlaceQualitiesData from "@/assets/json/place-qualities.json";

// Import from components
import { FC } from "@/components";

// Import from hooks
import { useStateManager } from "@/hooks/useStateManager";
import { usePlaces } from "@/hooks/usePlace";
import { useLanguage } from "@/hooks/useLanguage";
import { useTheme } from "@/hooks/useTheme";

// Import from styles
import { Styles } from "@/styles";

// Import screen configs (Import from local)
// Import states
import { StateManager } from "@/screens/explore/state";

// Import styles
import { styles } from "@/screens/explore/styles";

// Import utils
import { ExploreScreenUtils } from "@/screens/explore/utils";

export default function ExploreScreen() {
  const { places, currentType, status, placeTypes, placesDispatchers } =
    usePlaces();
  const { theme } = useTheme();
  const { language } = useLanguage();

  const [state, stateFns] = useStateManager(
    StateManager.getInitialState(),
    StateManager.getStateFns
  );

  const types = React.useMemo(() => {
    return placeTypes.map((placeType) => ({
      value: placeType.value,
      label: placeType.name,
    }));
  }, [placeTypes]);

  const _languageData = (language.data as any)["exploreScreen"] as any;

  React.useEffect(() => {
    // Fetch places when list is empty
    if (!places || places.length === 0) {
      placesDispatchers.fetchPlaces(state.currentType);
    }
    // Fetch places when type is changed
    else if (currentType !== state.currentType) {
      placesDispatchers.clear();
    }
  }, [state.currentType, places]);

  // Fetch types of place
  React.useEffect(() => {
    placesDispatchers.fetchPlaceTypes();
  }, []);

  console.log("Place types:", placeTypes);

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
            activeColor="type_1"
            defaultColor="type_5"
            style={[{ justifyContent: "space-between" }, Styles.spacings.mt_12]}
          >
            {(isActive, currentLabelStyle) => (
              <>
                <FC.AppText size="h2" style={{ width: 140 }}>
                  {_languageData["banner_button"][language.code]}
                </FC.AppText>
                <Ionicons
                  name="chevron-forward-outline"
                  style={currentLabelStyle}
                  size={25}
                />
              </>
            )}
          </FC.RectangleButton>
        </View>
      )}
      <FlatList
        data={places ? places : []}
        style={[
          styles.scroll_view_container,
          { backgroundColor: theme.background },
        ]}
        contentContainerStyle={{
          paddingBottom: 200,
          backgroundColor: theme.background,
        }}
        onMomentumScrollEnd={() => {
          ExploreScreenUtils.handleOnMomentumScrollEnd(state, places, () =>
            placesDispatchers.fetchPlaces(state.currentType)
          );
        }}
        onEndReached={(e) => {
          ExploreScreenUtils.handleOnEndReached(state);
        }}
        onScroll={(e) =>
          ExploreScreenUtils.handleOnScroll(e, stateFns.setIsOnTop)
        }
        scrollEventThrottle={1000}
        stickyHeaderHiddenOnScroll
        stickyHeaderIndices={[0]}
        ListEmptyComponent={
          <View style={[Styles.spacings.mh_18, Styles.spacings.mb_12]}>
            {[1, 2, 3, 4, 5].map((value, index) => (
              <FC.Skeletons.HorizontalPlaceCard key={value + index} />
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
            <FC.HorizontalPlaceCard data={item.item} type={state.currentType} />
          </View>
        )}
        keyExtractor={(item) => item._id as string}
        onRefresh={() => {
          placesDispatchers.clear();
        }}
        refreshing={status.isFetching}
      />
    </View>
  );
}
