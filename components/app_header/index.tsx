import { View } from "react-native";
import React from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// Import from components
import AppText from "@/components/app_text";
import CircleButton from "@/components/buttons/CircleButton";

// Import from hooks
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";

// Import from styles
import { Styles } from "@/styles";

// Import from utils
import { BooleanUtils } from "@/utils/boolean";

// Import from local
// Import components
import CenterPart from "./HeaderCenterPart";
import RightPart from "./HeaderRightPart";
import { StackLeftPart, TabLeftPart } from "./HeaderLeftPart";

// Import styles
import { styles } from "./styles";

// Import types
import type { AppStackHeaderProps, AppTabHeaderProps } from "./type";

/**
 * __Creator__: @NguyenAnhTuan1912
 *
 * Render a header for screen, including 3 parts: left, center and right.
 * @param props - Props của component.
 * @returns
 */
export default function AppHeader(
  props: AppStackHeaderProps | AppTabHeaderProps
) {
  const { language } = useLanguage();
  const { theme, currentScheme } = useTheme();

  const headerStyle = [
    styles.container,
    Styles.boxShadows.type_1,
    { backgroundColor: theme.background },
    props.options?.isTransparent
      ? { backgroundColor: "rgba(255, 255, 255, 0)" }
      : {},
  ];

  const LeftPart = router.canGoBack() ? (
    <StackLeftPart {...(props as AppStackHeaderProps)} />
  ) : (
    <TabLeftPart {...(props as AppTabHeaderProps)} />
  );

  return (
    <View style={headerStyle}>
      {LeftPart}
      {/* <StackLeftPart {...props} /> */}
      <CenterPart {...props} />
      <RightPart {...props} />
    </View>
  );
}

// {title === language.data.home[language.code] && (
//   <View style={{ paddingLeft: 10 }}>
//     <CircleButton
//       defaultColor="type_5"
//       boxShadowType="type_1"
//       type="opacity"
//       onPress={() => props.navigation.navigate("Notification")}
//       setIcon={
//         <Ionicons
//           name="notifications-sharp"
//           size={18}
//           style={{ color: numberOfVisited !== 0 ? "#FFC72C" : "" }}
//         />
//       }
//     />
//     {numberOfVisited > 0 && (
//       <View
//         style={{
//           height: 15,
//           width: 15,
//           alignItems: "center",
//           justifyContent: "center",
//           backgroundColor: "#CE2029",
//           borderRadius: 7.5,
//           position: "absolute",
//           right: 0,
//           top: 0,
//         }}
//       >
//         <AppText
//           style={{
//             fontSize: 10,
//           }}
//         >
//           {numberOfVisited}
//         </AppText>
//       </View>
//     )}
//   </View>
// )}
// </View>
