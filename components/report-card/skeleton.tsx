import React from "react";
import { View } from "react-native";

// Import hooks
import { useTheme } from "@/hooks/useTheme";

// Import Skeleton component
import Skeleton from "../skeleton";

// Import styles
import { styles } from "./styles";

/**
 * This skeleton mimics the structure of the ReportCard while loading.
 */
export default function ReportCardSkeleton() {
  const { theme } = useTheme();

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        {/* Avatar skeleton */}
        <Skeleton width={40} height={40} style={styles.avatar} />

        <View style={{ flex: 1 }}>
          {/* Reporter name skeleton */}
          <Skeleton width={"60%"} height={16} style={{ marginBottom: 6 }} />
          {/* Date skeleton */}
          <Skeleton width={"40%"} height={12} />
        </View>
      </View>

      {/* Reason skeleton */}
      <Skeleton width={"80%"} height={14} style={{ marginTop: 12 }} />

      {/* Description skeleton */}
      <Skeleton width={"100%"} height={50} style={{ marginTop: 10 }} />

      {/* Status skeleton */}
      <Skeleton width={"30%"} height={12} style={{ marginTop: 10 }} />
    </View>
  );
}
