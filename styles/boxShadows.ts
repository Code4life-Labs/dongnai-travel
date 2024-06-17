import { StyleSheet } from "react-native";

export const boxShadows = StyleSheet.create({
  type_1: {
    shadowColor: "#000000",
    shadowOffset: { width: 2, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3.4,
    elevation: 4,
  },

  type_2: {
    shadowColor: "#000000",
    shadowOffset: { width: 2, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 4.65,
    elevation: 6,
  },

  type_3: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5.46,
    elevation: 9,
  },

  type_4: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.3,
    shadowRadius: 7.49,
    elevation: 12,
  },

  type_5: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.53,
    shadowRadius: 13.97,
    elevation: 21,
  },
});
