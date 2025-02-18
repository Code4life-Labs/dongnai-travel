import React from "react";
import { View, Image, TouchableWithoutFeedback, Keyboard } from "react-native";
import { Link, router } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useForm, Controller } from "react-hook-form";

// Import from components
import { FC } from "@/components";

// Import from constants
import { REGEXES } from "@/constants/regexes";

// Import from hooks
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";

// Import from styles
import { Styles } from "@/styles";

// Import from utils

import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

// Import screen configs (Import from local)
// Import states
import { StateManager } from "@/screens/signin/state";

// Import styles
import { styles } from "@/screens/signin/styles";

export default function ResetPasswordScreen() {
  const { theme } = useTheme();
  const { language } = useLanguage();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: "",
      emailName: "",
    },
  });

  const _formLanguageData = (language.data as any)["form"];
  const _languageData = (language.data as any)["signUnScreen"];

  return;
}
