import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  temperature_banner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#E3F2FD",
    borderRadius: 16,
    padding: 16,
    // marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  temperature_left: {
    alignItems: "flex-start",
    gap: 4,
  },
  temperature_right: {
    alignItems: "flex-end",
    gap: 4,
  },
  temperature_details: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
});
