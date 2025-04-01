import React from "react";
import { View, ActivityIndicator } from "react-native";

// Import from hooks
import { useStatus } from "@/hooks/useStatus";
import { useTheme } from "@/hooks/useTheme";

// Import local
// Import styles
import { styles } from "./styles";

/**
 * Render a loading indicator
 * @returns
 * @FromSunNews
 * @NguyenAnhTuan1912
 */
export default function GlobalLoading() {
  const { theme } = useTheme();
  const { status } = useStatus();

  if (status.isLoading)
    return (
      <>
        <View style={[styles.blur, { backgroundColor: theme.primary }]} />
        <View style={styles.container}>
          <ActivityIndicator size="large" color={theme.onPrimary} />
        </View>
      </>
    );

  return null;
}
