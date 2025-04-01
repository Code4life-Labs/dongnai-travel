import { StyleSheet } from "react-native";

export const shapes = StyleSheet.create({
  capsule: {
    borderRadius: 1000,
  },

  circle: {
    borderRadius: 1000,
    aspectRatio: 1,
  },

  rounded_3: {
    borderRadius: 3,
  },

  rounded_4: {
    borderRadius: 4,
  },

  rounded_6: {
    borderRadius: 8,
  },

  rounded_8: {
    borderRadius: 8,
  },

  rounded_12: {
    borderRadius: 16,
  },

  rounded_16: {
    borderRadius: 16,
  },

  // Top right
  ronuded_top_right_3: {
    borderTopRightRadius: 3,
  },

  ronuded_top_right_4: {
    borderTopRightRadius: 4,
  },

  ronuded_top_right_6: {
    borderTopRightRadius: 6,
  },

  ronuded_top_right_8: {
    borderTopRightRadius: 8,
  },

  ronuded_top_right_12: {
    borderTopRightRadius: 12,
  },

  ronuded_top_right_16: {
    borderTopRightRadius: 16,
  },

  // Top left
  ronuded_top_left_3: {
    borderTopLeftRadius: 3,
  },

  ronuded_top_left_4: {
    borderTopLeftRadius: 4,
  },

  ronuded_top_left_6: {
    borderTopLeftRadius: 6,
  },

  ronuded_top_left_8: {
    borderTopLeftRadius: 8,
  },

  ronuded_top_left_12: {
    borderTopLeftRadius: 12,
  },

  ronuded_top_left_16: {
    borderTopLeftRadius: 16,
  },

  // Bottom right
  ronuded_bottom_right_3: {
    borderBottomRightRadius: 3,
  },

  ronuded_bottom_right_4: {
    borderBottomRightRadius: 4,
  },

  ronuded_bottom_right_6: {
    borderBottomRightRadius: 6,
  },

  ronuded_bottom_right_8: {
    borderBottomRightRadius: 8,
  },

  ronuded_bottom_right_12: {
    borderBottomRightRadius: 12,
  },

  ronuded_bottom_right_16: {
    borderBottomRightRadius: 16,
  },

  // Bottom left
  ronuded_bottom_left_3: {
    borderBottomLeftRadius: 3,
  },

  ronuded_bottom_left_4: {
    borderBottomLeftRadius: 4,
  },

  ronuded_bottom_left_6: {
    borderBottomLeftRadius: 6,
  },

  ronuded_bottom_left_8: {
    borderBottomLeftRadius: 8,
  },

  ronuded_bottom_left_12: {
    borderBottomLeftRadius: 12,
  },

  ronuded_bottom_left_16: {
    borderBottomLeftRadius: 16,
  },
});

export type UShapes = keyof typeof shapes;
