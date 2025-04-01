import { View, Image } from "react-native";

// Import components
import AppText from "../app_text";

// Import hooks
import { useTheme } from "@/hooks/useTheme";

// Import utils
import { DatetimeUtils } from "@/utils/datetime";

// Import styles
import { styles } from "./styles";

// Import types
import type { Report } from "@/objects/report/type";

type ReportCardProps = {
  data: Report;
};

/**
 * Use this function to render report card
 * @param props
 */
export default function ReportCard(props: ReportCardProps) {
  const { theme } = useTheme();

  if (!props.data) return;

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        {props.data.reporter.avatar ? (
          <Image
            source={{ uri: props.data.reporter.avatar }}
            style={styles.avatar}
          />
        ) : (
          <View style={styles.placeholderAvatar}>
            <AppText style={{ color: theme.background }}>
              {props.data.reporter.firstName.charAt(0)}
            </AppText>
          </View>
        )}
        <View>
          <AppText style={styles.reporterName}>
            {props.data.reporter.displayName}
          </AppText>
          <AppText style={styles.date}>
            {DatetimeUtils.getShortDateStr(props.data.createdAt)}
          </AppText>
        </View>
      </View>
      <AppText style={styles.reason}>Reason: {props.data.reason.name}</AppText>
      <AppText style={styles.description}>{props.data.description}</AppText>
      <AppText style={styles.status}>Status: {props.data.status.name}</AppText>
    </View>
  );
}
