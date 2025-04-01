import React from "react";
import { View, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

// Import from components
import { FC } from "@/components";

// Import from hooks
import { useStateManager } from "@/hooks/useStateManager";
import { useReports } from "@/hooks/useReport";
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
import { ReportsScreenUtils } from "@/screens/reports/utils";

export default function ReportsScreen() {
  const { reports, status, reportsDispatchers } = useReports();
  const { theme } = useTheme();
  const { language } = useLanguage();

  const [state, stateFns] = useStateManager(
    StateManager.getInitialState(),
    StateManager.getStateFns
  );

  const _languageData = (language.data as any)["exploreScreen"] as any;

  React.useEffect(() => {
    // Fetch reports when list is empty
    if (!reports || reports.length === 0) {
      reportsDispatchers.fetchReports();
      reportsDispatchers.fetchReportReasons();
      reportsDispatchers.fetchReportStatuses();
    }
  }, [state.currentType, reports]);

  return (
    <View style={{ backgroundColor: theme.background }}>
      <FlatList
        data={reports ? reports : []}
        style={[
          styles.scroll_view_container,
          { backgroundColor: theme.background },
        ]}
        contentContainerStyle={{
          paddingBottom: 200,
          backgroundColor: theme.background,
        }}
        onMomentumScrollEnd={() => {
          ReportsScreenUtils.handleOnMomentumScrollEnd(state, reports, () =>
            reportsDispatchers.fetchReports()
          );
        }}
        onEndReached={(e) => {
          ReportsScreenUtils.handleOnEndReached(state);
        }}
        scrollEventThrottle={1000}
        stickyHeaderHiddenOnScroll
        stickyHeaderIndices={[0]}
        ListEmptyComponent={
          <View style={[Styles.spacings.mh_18, Styles.spacings.mb_12]}>
            {[1, 2, 3, 4, 5].map((value, index) => (
              <FC.Skeletons.ReportCard key={value + index} />
            ))}
          </View>
        }
        renderItem={(item) => (
          <View
            style={[
              Styles.spacings.ph_18,
              { borderBottomWidth: 1, borderBottomColor: theme.outline },
            ]}
          >
            <FC.ReportCard data={item.item} />
          </View>
        )}
        keyExtractor={(item) => item._id as string}
        onRefresh={() => {
          reportsDispatchers.clearReports();
        }}
        refreshing={status.isRefreshing}
      />
    </View>
  );
}
