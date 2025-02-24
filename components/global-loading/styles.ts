import { StyleSheet } from "react-native";

// Import from styles
import { Styles } from "@/styles";

export const styles = StyleSheet.create({
  blur: {
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    opacity: 0.6,
    position: "absolute",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
});
