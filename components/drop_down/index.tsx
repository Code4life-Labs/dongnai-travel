import { FC } from "@/components"
import React, { useState, memo, useEffect }  from "react"
import {
  View,
  Text,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native"
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useDispatch } from "react-redux"


// Import styles
import { Styles } from "@/styles";
import styles from "./styles"

// Import hooks
import { useStateManager } from "@/hooks/useStateManager";
import { useLanguage } from "@/hooks/useLanguage";
import { useTheme } from "@/hooks/useTheme";

import { themeActions } from "@/states/redux/theme";
import { settingActions } from "@/states/redux/settings"

// Import states
import { StateManager } from "@/screens/settings/state";


interface NotificationSettings {
  updateFromFollowing: boolean;
  comments: boolean;
  events: boolean;
}

interface Theme {
  subBackground: string;
  onSubBackground: string;
  tertiary: string;
  outline: string;
  background: string;
}

interface DropDownProps {
  name: string;
  isMode?: boolean;
  isParagraph?: boolean;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  isDrop?: boolean;
  handlePressButton?: () => void;
  paragraphTitle?: string;
  idOption?: 'UPDATE_FROM_FOLLOWING' | 'COMMENTS' | 'EVENTS' | 'DARK_MODE';
  isFromFollowing?: boolean;
  isComment?: boolean;
  isEvent?: boolean;
}

const DropDown = ({
  name,
  isMode = false,
  isParagraph = false,
  children,
  icon,
  isDrop = true,
  handlePressButton = () => {},
  paragraphTitle,
  idOption,
}: DropDownProps) => {
  const dispatch = useDispatch();
  const { theme, toggleTheme } = useTheme();
  const { language } = useLanguage();
  const [state, stateFns] = useStateManager(
    StateManager.getInitialState(),
    StateManager.getStateFns
  );
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [selectedOption, setSelectedOption] = useState<boolean | null>(null)
  const [btnBgColor, setBtnBgColor] = useState<string>(theme.onTertiary)

  const _languageData = (language.data as any)["settingScreen"] as any;

  useEffect(() => {
    if (idOption ==='UPDATE_FROM_FOLLOWING' ) {
      setSelectedOption(state.notification.updateFromFollowing)
    }
    if (idOption === 'COMMENTS') {
      setSelectedOption(state.notification.comments)
    }
    if (idOption === 'EVENTS') {
      setSelectedOption(state.notification.events)
    }
    if (idOption === 'DARK_MODE') {
      setSelectedOption(state?.darkMode)
    }
  }, [state])


  const handleOptionChange = () => {
    let data: boolean | NotificationSettings
    
    if (idOption === 'DARK_MODE') {
      data = !selectedOption
      setSelectedOption(data);
      toggleTheme();
      dispatch(settingActions.updateDarkMode(data))
    } else {
      if (idOption ==='UPDATE_FROM_FOLLOWING') {
        data = {
          ...state.notification,
          updateFromFollowing: !selectedOption
        }
      } else if (idOption ==='COMMENTS') {
        data = {
          ...state.notification,
          comments: !selectedOption
        }
      } else if (idOption ==='EVENTS') {
        data = {
          ...state.notification,
          events: !selectedOption
        }
      } else {
        return;
      }
      dispatch(settingActions.updateNotification(data as NotificationSettings))
    }
  }

  if (Platform.OS === "android") {
    UIManager.setLayoutAnimationEnabledExperimental &&
      UIManager.setLayoutAnimationEnabledExperimental(true)
  }

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
    if (!isDrop) {
      handlePressButton()
    }
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
  }

  return (
    <View style={styles.dropdown}>
      <TouchableOpacity
        onPress={toggleDropdown}
        style={{ ...styles.dropdown_btn, backgroundColor: theme.subBackground }}
      >
        <View
          style={{
            justifyContent: "space-between",
            flexDirection: "row",
            width: "90%",
          }}
        >
          <Text style={{ ...styles.dropdown_label, color: theme.onSubBackground}}>
            {icon}
            <View style={{ alignItems: "center", paddingLeft: 12 }}>
              <Text
                style={{
                  fontSize: 16,
                  color: theme.onSubBackground,
                  fontWeight: "500",
                }}
              >
                {name}
              </Text>
            </View>
          </Text>
          {isMode && (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {selectedOption ? (
                <FC.AppText style={{...styles.dropdown_label,...styles.dropdown_label_mode, color: theme.onSubBackground}}>
                  {_languageData["open_dropdown"][language.code]}
                </FC.AppText>
              ) : (
                <FC.AppText style={{...styles.dropdown_label,...styles.dropdown_label_mode, color: theme.onSubBackground}}>
                  {_languageData["close_dropdown"][language.code]}
                  </FC.AppText>
              )}
            </View>
          )}
        </View>
        {isOpen && isDrop ? (
          <AntDesign name="down" size={22} color={theme.onSubBackground} />
        ) : (
          <AntDesign name="right" size={22} color={theme.onSubBackground} />
        )}
      </TouchableOpacity>
      {isOpen && isDrop && (
        <View style={{ paddingTop: 12 }}>
          {isMode &&
            <>
              <TouchableOpacity
                onPress={() => {
                  if (!selectedOption)
                    handleOptionChange()
                }}
              >
                <View style={styles.dropdown_content}>
                  <View style={[styles.circle_outline, { borderColor: theme.onSubBackground }]}>
                    {selectedOption && <View style={[styles.circle, { backgroundColor: theme.onSubBackground }]}></View> }
                  </View>
                  <Text style={[styles.option_name,{color: theme.onSubBackground}]}>{_languageData["open_dropdown"][language.code]}</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  if (selectedOption)
                    handleOptionChange()
                }}
              >
                <View style={styles.dropdown_content}>
                  <View style={[styles.circle_outline,{borderColor: theme.onSubBackground}]}>
                    {!selectedOption && <View style={[styles.circle, {backgroundColor: theme.onSubBackground}]}></View> }
                  </View>
                  <Text style={[styles.option_name,{color:theme.onSubBackground}]}>{_languageData["close_dropdown"][language.code]}</Text>
                </View>
              </TouchableOpacity>
            </>
          }
          {isParagraph && (
            <View style={{ paddingLeft: 12 }}>
              <Text
                numberOfLines={2}
                style={{
                  ...Styles.typography.fonts.normal.bolder.h5,
                  color: theme.onSubBackground,
                  paddingBottom: 4,
                }}
              >
                {paragraphTitle}
              </Text>
              <Text
                style={{
                  ...Styles.typography.fonts.normal.normal.sub0,
                  color: theme.onSubBackground
                }}
              >
                {children}
              </Text>
            </View>
          )}
          <View
            style={{
              borderBottomWidth: 1.5,
              borderBottomColor: theme.outline,
              marginTop: 12,
            }}
          ></View>
        </View>
      )}
    </View>
  )
}

export default DropDown
