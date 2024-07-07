import React from "react";
import { View, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Import from assets
import PlaceQualitiesData from "@/assets/json/place_qualities.json";

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

// Import types
import type { ExploreLocalData } from "@/screens/explore/type";

export default function ExploreScreen() {
  const { places, placesDispatchers } = usePlaces();
  const { theme } = useTheme();
  const { language } = useLanguage();

  const [state, stateFns] = useStateManager(
    StateManager.getInitialState(),
    StateManager.getStateFns
  );

  const localData = React.useRef<ExploreLocalData>({
    status: {
      isFirstFetch: true,
      isEndReach: false,
      isReload: false,
    },
  });

  React.useEffect(() => {
    if (!places || places.length === 0) {
      placesDispatchers.get(state.currentType);
    }
  }, [state.currentType]);

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
            style={Styles.spacings.mt_12}
          >
            {(isActive, currentLabelStyle) => (
              <>
                <Ionicons
                  name="chevron-forward-outline"
                  style={currentLabelStyle}
                  size={25}
                />
                {/* {(language.data as any).banner_button[language.code]} */}
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
        onMomentumScrollEnd={() =>
          ExploreScreenUtils.handleOnMomentumScrollEnd(
            localData.current,
            places,
            placesDispatchers.get
          )
        }
        onEndReached={(e) =>
          ExploreScreenUtils.handleOnEndReached(localData.current)
        }
        onScroll={(e) =>
          ExploreScreenUtils.handleOnScroll(e, stateFns.setIsOnTop)
        }
        scrollEventThrottle={1000}
        stickyHeaderHiddenOnScroll
        stickyHeaderIndices={[0]}
        ListEmptyComponent={
          <View style={[Styles.spacings.mh_18, Styles.spacings.mb_12]}>
            {[1, 2, 3].map((value, index) => (
              <FC.Seletons.HorizontalPlaceCard key={value + index} />
            ))}
          </View>
        }
        ListHeaderComponent={
          <FC.ButtonsScrollBar
            buttonContents={(PlaceQualitiesData as any)[language.code]}
            buttonType="capsule"
            onButtonPress={(content) => stateFns.setCurrentType(content.value)}
            scrollStyle={[Styles.spacings.ms_18, Styles.spacings.pv_12]}
            containerStyle={[
              Styles.spacings.pv_10,
              { backgroundColor: theme.background },
            ]}
          />
        }
        renderItem={(item) => (
          <View style={Styles.spacings.ph_18}>
            {/* <HorizontalPlaceCard
              typeOfBriefPlace={type}
              place={item.item}
              placeIndex={item.index}
            /> */}
            <FC.AppText>{item.item.name}</FC.AppText>
          </View>
        )}
        keyExtractor={(item) => item._id as string}
        onRefresh={() => {
          placesDispatchers.clear();
        }}
        refreshing={false}
      />
    </View>
  );
}
