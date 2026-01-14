import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  temperature_banner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#E3F2FD",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  weatherContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  temperatureSection: {
    flex: 0.3,
    alignItems: "center",
  },
  temperatureText: {
    color: "#0D47A1",
  },
  weatherInfoSection: {
    flex: 0.7,
    paddingHorizontal: 12,
  },
  cityName: {
    color: "#1565C0",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  weatherDescription: {
    color: "#1E88E5",
    fontSize: 14,
  },
  metricsContainer: {
    flexDirection: "row",
    marginTop: 8,
  },
  metricItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  metricIcon: {
    marginRight: 4,
  },
  metricText: {
    color: "#424242",
    fontSize: 12,
  },
});
