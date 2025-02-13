import { View, Image } from "react-native";

// Import components
import AppText from "../app_text";

// Import types
import type { ViewStyle, ImageStyle } from "react-native";

type NoDataProps = {
  title?: string;
  style?: ViewStyle;
  imageStyle?: ImageStyle;
};

export default function NoData({
  title = "There isn't data",
  style,
  imageStyle,
}: NoDataProps) {
  return (
    <View
      style={[
        {
          display: "flex",
          justifyContent: "center",
        },
        style,
      ]}
    >
      <AppText>{title}</AppText>
      <Image
        source={require("@/assets/images/no-data.png")}
        style={[
          {
            height: 300,
            width: 300,
            alignSelf: "center",
          },
          imageStyle,
        ]}
      />
    </View>
  );
}
