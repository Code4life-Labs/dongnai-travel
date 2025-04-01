import { StyleSheet } from "react-native";

import { Styles } from "@/styles";

export const styles = StyleSheet.create({
  scroll_view_container: {
    height: Styles.dimension.screenHeight,
  },

  place_cards_container: {
    ...Styles.spacings.mh_6,
  },
});
