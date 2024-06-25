import { StyleSheet } from "react-native";

// Import types
import type { ThemeData, UThemeSchemes } from "@/styles/theme";

/**
 * Hàm này dùng để lấy trong màu cho buttons theo type. Một button sẽ có 3 loại cặp màu
 * `active`, `inactive` và một màu đặc biệt là disable.
 * - `active`: là màu của button khi được focus, press hoặc checked.
 * - `inactive`: là màu bình thường của button.
 * Hiện tại thì mình có 3 màu phân cấp là primary, secondary và tertiary => 3 types. Nên
 * `active` và `inactive` sẽ có 3 types (riêng disable chỉ có 1).
 *
 * Và một button sẽ có một cặp màu như sau (nếu chỉ tính một loại cặp màu):
 * - `label`: nhãn của button, gồm chữ và icon...
 * - `background`: màu nền của button...
 * @param theme
 * @param scheme
 */
export function getButtonColors(theme: ThemeData[UThemeSchemes]) {
  return {
    disable: {
      type_1: {
        lbl: theme.onSubOutline,
        btn: theme.onSecondary,
      },
    },
    active: {
      type_1: {
        lbl: theme.onPrimary,
        btn: theme.primary,
      },
      type_2: {
        lbl: theme.onSecondary,
        btn: theme.secondary,
      },
      type_3: {
        lbl: theme.onTertiary,
        btn: theme.tertiary,
      },
      type_4: {
        lbl: theme.onBackground,
        btn: theme.background,
      },
      type_5: {
        lbl: theme.onSubBackground,
        btn: theme.subBackground,
      },
      type_6: {
        lbl: theme.outline,
        btn: theme.onOutline,
      },
      type_7: {
        lbl: theme.subOutline,
        btn: theme.onSubOutline,
      },
    },
    inactive: {
      type_1: {
        lbl: theme.primary,
        btn: theme.onPrimary,
      },
      type_2: {
        lbl: theme.secondary,
        btn: theme.onSecondary,
      },
      type_3: {
        lbl: theme.tertiary,
        btn: theme.onTertiary,
      },
      type_4: {
        lbl: theme.onBackground,
        btn: theme.background,
      },
      type_5: {
        lbl: theme.onSubBackground,
        btn: theme.subBackground,
      },
      type_6: {
        lbl: theme.onOutline,
        btn: theme.outline,
      },
      type_7: {
        lbl: theme.onSubOutline,
        btn: theme.subOutline,
      },
    },
  };
}

export type ButtonColors = ReturnType<typeof getButtonColors>;

export type UButtonColorTypes = keyof ReturnType<
  typeof getButtonColors
>["active"];

export type UButtonInActiveColorTypes = keyof ReturnType<
  typeof getButtonColors
>["inactive"];

export type UButtonDisableColorTypes = keyof ReturnType<
  typeof getButtonColors
>["disable"];
