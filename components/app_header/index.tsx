import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";

//
import AppText from "@/components/app_text";
import CircleButton from "@/components/buttons/CircleButton";

// Import from hooks
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";

// Import styles
import { Styles } from "@/styles";
import styles from "./styles";

// Import types
import type { AppHeaderProps } from "./type";

/**
 * __Creator__: @NguyenAnhTuan1912
 *
 * Đây sẽ là phần header của screen, mỗi screen sẽ có một header khác nhau, tuy nhiên thì cấu trúc cơ bản của nó là giống nhau.
 * Header sẽ được chia làm 3 phần, phần trái, giữa và phải. Header mặc định sẽ có một nút để back và một nút tìm kiếm.
 * @param props - Props của component.
 * @returns
 */
const AppHeader = ({
  boxShadowType,
  screenName,
  back,
  navigation,
  route,
  options,
  setLeftPart,
  setCenterPart,
  setRightPart,
}: AppHeaderProps) => {
  const { language } = useLanguage();
  const { theme, themeMode } = useTheme();

  const [numberOfVisited, setNumberOfVisited] = useState(0);

  const canSetLeftPart =
    typeof setLeftPart === "function" && Boolean(setLeftPart);
  const canSetCenterPart =
    typeof setCenterPart === "function" && Boolean(setCenterPart);
  const canSetRightPart =
    typeof setRightPart === "function" && Boolean(setRightPart);
  const canSetBackButton = back || options?.canBack;

  const title =
    options?.title !== "" && options?.title
      ? options?.title
      : screenName !== "" && screenName
        ? screenName
        : route.name;
  const transparent = options?.isTransparent;
  const headerStyle = {
    ...styles.container,
    ...Styles.boxShadows.type_1,
    backgroundColor: theme.background,
    ...(transparent ? { backgroundColor: "rgba(255, 255, 255, 0)" } : {}),
  };

  return (
    <View style={[headerStyle]}>
      <View
        style={{
          ...styles.header_col,
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        {/* Phần bên trái */}
        {canSetLeftPart
          ? setLeftPart()
          : canSetBackButton && (
              <CircleButton
                defaultColor="type_5"
                boxShadowType="type_1"
                typeOfButton="opacity"
                onPress={() => navigation.goBack()}
                setIcon={(isActive, currentLabelStyle) => (
                  <Ionicons
                    name="chevron-back-outline"
                    size={18}
                    style={currentLabelStyle}
                  />
                )}
              />
            )}
      </View>
      {/* Phần ở giữa */}
      <View
        style={{
          ...styles.header_col,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {canSetCenterPart ? (
          setCenterPart()
        ) : (
          <AppText weight="lighter" size="h5" style={{ textAlign: "center" }}>
            {title}
          </AppText>
        )}
      </View>

      {/* Phần bên phải */}
      <View
        style={{
          ...styles.header_col,
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        {canSetRightPart ? (
          setRightPart()
        ) : (
          <>
            <CircleButton
              defaultColor="type_5"
              boxShadowType="type_1"
              typeOfButton="opacity"
              setIcon={<Ionicons name="search-outline" size={18} />}
              onPress={() => {
                navigation.navigate("GlobalNavigator", {
                  screen: "SearchScreen",
                });
              }}
            />
          </>
        )}
        {title === language.data.home[language.code] && (
          <View style={{ paddingLeft: 10 }}>
            <CircleButton
              defaultColor="type_5"
              boxShadowType="type_1"
              typeOfButton="opacity"
              onPress={() => navigation.navigate("Notification")}
              setIcon={
                <Ionicons
                  name="notifications-sharp"
                  size={18}
                  style={{ color: numberOfVisited !== 0 ? "#FFC72C" : "" }}
                />
              }
            />
            {numberOfVisited > 0 && (
              <View
                style={{
                  height: 15,
                  width: 15,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#CE2029",
                  borderRadius: 7.5,
                  position: "absolute",
                  right: 0,
                  top: 0,
                }}
              >
                <AppText
                  style={{
                    fontSize: 10,
                  }}
                >
                  {numberOfVisited}
                </AppText>
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

export default AppHeader;
