import { StyleSheet } from "react-native";

// Tuan: Trong file này không có color. Color thì tự custom sau.
// Tuan: Và cái này có thể thay đổi cho phù hợp. Hiện tại type chỉ đang là test thôi.
const _fontSize12 = 12;
const _fontSize14 = 14;
const _fontSize16 = 16;
const _fontSize18 = 18;
const _fontSize20 = 20;
const _fontSize24 = 24;
const _fontSize30 = 30;
const _fontSize35 = 35;
const _fontSize40 = 40;
const _fontSize45 = 45;

const _fontDecoration = {
  dashed: "dashed",
  dotted: "dotted",
  double: "double",
  solid: "solid",
};

const size = StyleSheet.create({
  sz_12: {
    fontSize: _fontSize12,
  },
  sz_14: {
    fontSize: _fontSize14,
  },
  sz_16: {
    fontSize: _fontSize16,
  },
  sz_18: {
    fontSize: _fontSize18,
  },
  sz_20: {
    fontSize: _fontSize20,
  },
  sz_24: {
    fontSize: _fontSize24,
  },
  sz_30: {
    fontSize: _fontSize30,
  },
});

const decoration = StyleSheet.create({
  decoDashed: {
    textDecorationStyle: _fontDecoration.dashed as any,
  },
  decoDotted: {
    textDecorationStyle: _fontDecoration.dotted as any,
  },
  decoDouble: {
    textDecorationStyle: _fontDecoration.double as any,
  },
  decoSolid: {
    textDecorationStyle: _fontDecoration.solid as any,
  },
});

const fonts = {
  normal: {
    bolder: {
      // Title
      h0: { fontFamily: "Roboto-Black", fontSize: _fontSize30 },
      h1: { fontFamily: "Roboto-Black", fontSize: _fontSize24 },
      h2: { fontFamily: "Roboto-Black", fontSize: _fontSize20 },
      h3: { fontFamily: "Roboto-Black", fontSize: _fontSize18 },
      h4: { fontFamily: "Roboto-Black", fontSize: _fontSize16 },
      h5: { fontFamily: "Roboto-Black", fontSize: _fontSize14 },

      // Body
      body0: { fontFamily: "Roboto-Medium", fontSize: _fontSize16 },
      body1: { fontFamily: "Roboto-Medium", fontSize: _fontSize14 },
      body2: { fontFamily: "Roboto-Medium", fontSize: _fontSize12 },

      // Sub
      sub0: { fontFamily: "Roboto-Regular", fontSize: _fontSize14 },
      sub1: { fontFamily: "Roboto-Regular", fontSize: _fontSize12 },
    },

    normal: {
      // Title
      h0: { fontFamily: "Roboto-Bold", fontSize: _fontSize30 },
      h1: { fontFamily: "Roboto-Bold", fontSize: _fontSize24 },
      h2: { fontFamily: "Roboto-Bold", fontSize: _fontSize20 },
      h3: { fontFamily: "Roboto-Bold", fontSize: _fontSize18 },
      h4: { fontFamily: "Roboto-Bold", fontSize: _fontSize16 },
      h5: { fontFamily: "Roboto-Bold", fontSize: _fontSize14 },

      // Body
      body0: { fontFamily: "Roboto-Regular", fontSize: _fontSize16 },
      body1: { fontFamily: "Roboto-Regular", fontSize: _fontSize14 },
      body2: { fontFamily: "Roboto-Regular", fontSize: _fontSize12 },

      // Sub
      sub0: { fontFamily: "Roboto-Light", fontSize: _fontSize14 },
      sub1: { fontFamily: "Roboto-Light", fontSize: _fontSize12 },
    },

    lighter: {
      // Title
      h0: { fontFamily: "Roboto-Medium", fontSize: _fontSize30 },
      h1: { fontFamily: "Roboto-Medium", fontSize: _fontSize24 },
      h2: { fontFamily: "Roboto-Medium", fontSize: _fontSize20 },
      h3: { fontFamily: "Roboto-Medium", fontSize: _fontSize18 },
      h4: { fontFamily: "Roboto-Medium", fontSize: _fontSize16 },
      h5: { fontFamily: "Roboto-Medium", fontSize: _fontSize14 },

      // Body
      body0: { fontFamily: "Roboto-Light", fontSize: _fontSize16 },
      body1: { fontFamily: "Roboto-Light", fontSize: _fontSize14 },
      body2: { fontFamily: "Roboto-Light", fontSize: _fontSize12 },

      // Sub
      sub0: { fontFamily: "Roboto-Thin", fontSize: _fontSize14 },
      sub1: { fontFamily: "Roboto-Thin", fontSize: _fontSize12 },
    },

    title: {
      h0: { fontFamily: "Roboto-Black", fontSize: _fontSize45 },
      h1: { fontFamily: "Roboto-Black", fontSize: _fontSize40 },
      h2: { fontFamily: "Roboto-Black", fontSize: _fontSize35 },
      h3: { fontFamily: "Roboto-Black", fontSize: _fontSize30 },
    },
  },

  italic: {
    bolder: {
      // Title
      h0: { fontFamily: "Roboto-BlackItalic", fontSize: _fontSize30 },
      h1: { fontFamily: "Roboto-BlackItalic", fontSize: _fontSize24 },
      h2: { fontFamily: "Roboto-BlackItalic", fontSize: _fontSize20 },
      h3: { fontFamily: "Roboto-BlackItalic", fontSize: _fontSize18 },
      h4: { fontFamily: "Roboto-BlackItalic", fontSize: _fontSize16 },
      h5: { fontFamily: "Roboto-BlackItalic", fontSize: _fontSize14 },

      // Body
      body0: { fontFamily: "Roboto-MediumItalic", fontSize: _fontSize16 },
      body1: { fontFamily: "Roboto-MediumItalic", fontSize: _fontSize14 },
      body2: { fontFamily: "Roboto-MediumItalic", fontSize: _fontSize12 },

      // Sub
      sub0: { fontFamily: "Roboto-Italic", fontSize: _fontSize14 },
      sub1: { fontFamily: "Roboto-Italic", fontSize: _fontSize12 },
    },

    normal: {
      // Title
      h0: { fontFamily: "Roboto-BoldItalic", fontSize: _fontSize30 },
      h1: { fontFamily: "Roboto-BoldItalic", fontSize: _fontSize24 },
      h2: { fontFamily: "Roboto-BoldItalic", fontSize: _fontSize20 },
      h3: { fontFamily: "Roboto-BoldItalic", fontSize: _fontSize18 },
      h4: { fontFamily: "Roboto-BoldItalic", fontSize: _fontSize16 },
      h5: { fontFamily: "Roboto-BoldItalic", fontSize: _fontSize14 },

      // Body
      body0: { fontFamily: "Roboto-Italic", fontSize: _fontSize16 },
      body1: { fontFamily: "Roboto-Italic", fontSize: _fontSize14 },
      body2: { fontFamily: "Roboto-Italic", fontSize: _fontSize12 },

      // Sub
      sub0: { fontFamily: "Roboto-LightItalic", fontSize: _fontSize14 },
      sub1: { fontFamily: "Roboto-LightItalic", fontSize: _fontSize12 },
    },

    lighter: {
      // Title
      h0: { fontFamily: "Roboto-MediumItalic", fontSize: _fontSize30 },
      h1: { fontFamily: "Roboto-MediumItalic", fontSize: _fontSize24 },
      h2: { fontFamily: "Roboto-MediumItalic", fontSize: _fontSize20 },
      h3: { fontFamily: "Roboto-MediumItalic", fontSize: _fontSize18 },
      h4: { fontFamily: "Roboto-MediumItalic", fontSize: _fontSize16 },
      h5: { fontFamily: "Roboto-MediumItalic", fontSize: _fontSize14 },

      // Body
      body0: { fontFamily: "Roboto-LightItalic", fontSize: _fontSize16 },
      body1: { fontFamily: "Roboto-LightItalic", fontSize: _fontSize14 },
      body2: { fontFamily: "Roboto-LightItalic", fontSize: _fontSize12 },

      // Sub
      sub0: { fontFamily: "Roboto-ThinItalic", fontSize: _fontSize14 },
      sub1: { fontFamily: "Roboto-ThinItalic", fontSize: _fontSize12 },
    },
  },
};

export const typography = {
  size,
  decoration,
  fonts,
};

export type UFontStyles = keyof typeof fonts;
export type UFontWeights = keyof (typeof fonts)[UFontStyles];
export type UFontSizes = keyof (typeof fonts)[UFontStyles][UFontWeights];
