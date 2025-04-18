import React from "react";
import { View, Image, TouchableWithoutFeedback, Keyboard } from "react-native";
import { Link, useRouter } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useForm, Controller } from "react-hook-form";

// Import from components
import { FC } from "@/components";

// Import from constants
import { REGEXES } from "@/constants/regexes";

// Import from hooks
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";

// Import objects
import { UserManager } from "@/objects/user";

// Import from styles
import { Styles } from "@/styles";

// Import styles
import { styles } from "@/screens/signin/styles";

export default function SignInScreen() {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const router = useRouter();

  const { canRemember, authDispatchers } = useAuth();

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
  const _languageData = (language.data as any)["signInScreen"];

  const submit = async function (data: any) {
    authDispatchers.signin(data);
  };

  return (
    <KeyboardAwareScrollView
      extraScrollHeight={40}
      style={[styles.container, { backgroundColor: theme.background }]}
      showsVerticalScrollIndicator={false}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <View style={styles.content}>
            <FC.AppText size="h0" color="primary" style={Styles.spacings.mb_18}>
              {_languageData.text_header[language.code]}
            </FC.AppText>
            <Image
              style={styles.image}
              source={require("@/assets/images/illutration1.png")}
            />
            <Controller
              control={control}
              rules={{
                required: {
                  value: true,
                  message:
                    _formLanguageData.field_required_message[language.code],
                },
              }}
              name="emailName"
              render={({ field: { onChange, onBlur, value } }) => (
                <FC.Input
                  label={_languageData.email_or_username[language.code]}
                  hint={_languageData.enter_email_or_username[language.code]}
                  isPassword={false}
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                  isError={
                    errors.emailName !== undefined && Boolean(errors.emailName)
                  }
                />
              )}
            />
            {errors.emailName && (
              <FC.AppText
                size="body1"
                style={[styles.text_error, Styles.spacings.mt_6]}
              >
                {errors.emailName?.message}
              </FC.AppText>
            )}

            <Controller
              control={control}
              rules={{
                required: {
                  value: true,
                  message:
                    _formLanguageData.field_required_message[language.code],
                },
                pattern: {
                  value: REGEXES.USER.PASSWORD,
                  message:
                    _formLanguageData.password_rule_message[language.code],
                },
                minLength: {
                  value: 8,
                  message:
                    _formLanguageData.field_min_length_message[language.code],
                },
              }}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <FC.Input
                  label={_languageData.password[language.code]}
                  hint={_languageData.enter_password[language.code]}
                  isPassword={true}
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                  isError={
                    errors.password !== undefined && Boolean(errors.password)
                  }
                />
              )}
            />
            {errors.password && (
              <FC.AppText
                size="body1"
                style={[styles.text_error, Styles.spacings.mt_6]}
              >
                {errors.password?.message}
              </FC.AppText>
            )}

            <View style={styles.container_settings}>
              <FC.CheckBoxText
                label={_languageData.remember_me[language.code]}
                onPress={() => authDispatchers.rememberAccount(!canRemember)}
                isChecked={canRemember}
              />
              <FC.RectangleButton
                isTransparent
                style={Styles.spacings.ph_0}
                onPress={() => router.navigate("/forgot-password")}
              >
                <FC.AppText size="h5" color="secondary">
                  {_languageData.forgot_password[language.code]}
                </FC.AppText>
              </FC.RectangleButton>
            </View>

            <FC.RectangleButton
              type="opacity"
              shape="rounded_8"
              style={[Styles.spacings.mt_12, Styles.spacings.pv_16]}
              onPress={handleSubmit(submit)}
            >
              {_languageData.text_header[language.code]}
            </FC.RectangleButton>
          </View>
        </View>
      </TouchableWithoutFeedback>
      <View style={styles.footer}>
        <FC.AppText
          size="h5"
          color="secondary"
          style={[
            Styles.spacings.mt_6,
            Styles.spacings.mb_12,
            { alignSelf: "center" },
          ]}
          onPress={() => {
            UserManager.Storage.remove().then(() => {
              router.navigate("/home");
            });
          }}
        >
          {_languageData.sign_in_as_gest[language.code]}
        </FC.AppText>
        <FC.AppText style={styles.labelSocial}>
          {_languageData.or_signin_with[language.code]}
        </FC.AppText>
        <View style={styles.containerSocialBtn}>
          <FC.RectangleButton isOnlyContent>
            <Image
              style={styles.imageSocial}
              source={require("@/assets/images/facebook.png")}
            />
          </FC.RectangleButton>

          <FC.RectangleButton isOnlyContent style={Styles.spacings.mh_16}>
            <Image
              style={styles.imageSocial}
              source={require("@/assets/images/google.png")}
            />
          </FC.RectangleButton>

          <FC.RectangleButton isOnlyContent>
            <Image
              style={styles.imageSocial}
              source={require("@/assets/images/twitter.png")}
            />
          </FC.RectangleButton>
        </View>
        <View style={styles.containerSignup}>
          <FC.AppText style={styles.labelNoAccount}>
            {_languageData.no_account[language.code]}
          </FC.AppText>
          <FC.AppText
            onPress={() => router.navigate("/sign-up")}
            color="secondary"
            size="h5"
            style={styles.labelSignup}
          >
            {_languageData.sign_up[language.code]}
          </FC.AppText>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
