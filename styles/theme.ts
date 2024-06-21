const colorNames = {
  primary: "primary",
  onPrimary: "onPrimary",
  secondary: "secondary",
  onSecondary: "onSecondary",
  tertiary: "tertiary",
  onTertiary: "onTertiary",
  background: "background",
  onBackground: "onBackground",
  subBackground: "subBackground",
  onSubBackground: "onSubBackground",
  outline: "outline",
  onOutline: "onOutline",
  subOutline: "subOutline",
  onSubOutline: "onSubOutline",
};

const data = {
  light: {
    primary: "#112D4E",
    onPrimary: "#EDF5FF",
    secondary: "#3F72AF",
    onSecondary: "#F6F6F6",
    tertiary: "#769FCD",
    onTertiary: "#FFFFFF",
    background: "#ECF1F6",
    onBackground: "#0B1015",
    subBackground: "#FAFAFA",
    onSubBackground: "#1A2229",
    outline: "#A6AEB7",
    onOutline: "#455466",
    subOutline: "#C1C7CF",
    onSubOutline: "#6A798B",
  },
  dark: {
    primary: "#4F8BCF",
    onPrimary: "#FEFEFE",
    secondary: "#2E68A9",
    onSecondary: "#F6F6F6",
    tertiary: "#284464",
    onTertiary: "#FFFFFF",
    background: "#17212C",
    onBackground: "#FAFAFA",
    subBackground: "#242F3A",
    onSubBackground: "#F3F3F3",
    outline: "#596779",
    onOutline: "#D4DDE7",
    subOutline: "#6F8197",
    onSubOutline: "#D4DDE7",
  },
};

export const theme = { colorNames, data };
export type ThemeData = typeof data;
export type UThemeSchemes = keyof typeof data;
export type UColorNames = keyof typeof colorNames;
