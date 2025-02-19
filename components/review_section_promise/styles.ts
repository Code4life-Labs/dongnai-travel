import { StyleSheet } from "react-native";

// Import styles
import { Styles } from "@/styles";

export const styles = StyleSheet.create({
  seperate: {
    width: "100%",
    borderBottomWidth: 1,
    marginVertical: 10,
  },
  contentContainer: {
    // paddingHorizontal: 18
  },
  authenContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 45,
    height: 45,
    marginRight: 10,
  },
  nameAuthorRatingContainer: {
    display: "flex",
    flexDirection: "column",
  },
  authorName: {
    marginBottom: 3,
  },
  textContent: {
    marginTop: 10,
  },
});
