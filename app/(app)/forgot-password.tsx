import { View, TouchableWithoutFeedback, Image, Keyboard } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "expo-router";

// Import components
import { FC } from "@/components";

// Import from hooks
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";

// Import styles
import { Styles } from "@/styles";
import { styles } from "@/screens/forgot-password/styles";

import { REGEXES } from "@/constants/regexes";

export default function ForgotPasswordScreen() {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
    },
  });

  const _formLanguageData = (language.data as any)["form"];
  const _languageData = (language.data as any)["forgotPasswordScreen"];

  const handleSendOTP = function (data: any) {
    // // Phuong: Call api to generate otp send to email
    // sendOtpAPI({
    //   email: data.email,
    // }).then((res) => {
    //   console.log(
    //     "🚀 ~ file: ForgotPasswordScreen.jsx:29 ~ sendOtpAPI ~ res",
    //     res
    //   );
    //   // Phuong: And then
    //   router.replace("/otp");
    // });
    router.replace("/otp");
  };

  return (
    <KeyboardAwareScrollView
      extraScrollHeight={-100}
      style={[styles.container, { backgroundColor: theme.background }]}
      showsVerticalScrollIndicator={false}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1, alignItems: "center" }}>
          <View style={styles.content}>
            <FC.AppText size="h0" color="primary" style={styles.textHeader}>
              {_languageData.text_header[language.code]}
            </FC.AppText>
            <Image
              style={styles.image}
              source={require("@/assets/images/illutration2.png")}
            />

            <FC.AppText size="body0" style={styles.textInfo}>
              {_languageData.desc[language.code]}
            </FC.AppText>

            <Controller
              control={control}
              rules={{
                required: {
                  value: true,
                  message:
                    _formLanguageData.field_required_message[language.code],
                },
                pattern: {
                  value: REGEXES.USER.EMAIL,
                  message: _formLanguageData.email_rule_message[language.code],
                },
              }}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <FC.Input
                  label={_languageData.email_address[language.code]}
                  hint={_languageData.enter_email_address[language.code]}
                  isPassword={false}
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                  isError={Boolean(errors.email)}
                />
              )}
            />
            {errors.email && (
              <FC.AppText size="body1" style={styles.textError}>
                {errors.email?.message}
              </FC.AppText>
            )}

            {/* <ButtonText
              label={_languageData.send_otp[language.code]}
              onPress={handleSubmit(handleSendOTP)}
            />

            <TouchableOpacity
              onPress={() => navigation.pop()}
              style={styles.containerLabel}
            >
              <FC.AppText style={styles.labelSignin}>{_languageData.go_back[language.code]}</FC.AppText>
            </TouchableOpacity> */}

            <FC.RectangleButton
              style={[Styles.spacings.mt_12, Styles.spacings.pv_16]}
              onPress={handleSubmit(handleSendOTP)}
            >
              {_languageData.send_otp[language.code]}
            </FC.RectangleButton>

            <FC.RectangleButton isTransparent onPress={() => router.back()}>
              {_languageData.go_back[language.code]}
            </FC.RectangleButton>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAwareScrollView>
  );
}
