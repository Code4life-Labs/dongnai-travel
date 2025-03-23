import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  reporterName: { fontSize: 16, fontWeight: "bold" },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  placeholderAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  reason: { fontSize: 14, color: "#333", marginVertical: 4 },
  description: { fontSize: 14, color: "#666" },
  status: { fontSize: 13, color: "#007bff", marginTop: 6 },
  date: { fontSize: 12, color: "#999" },
});
