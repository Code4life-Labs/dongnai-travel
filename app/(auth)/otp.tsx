import React from "react";
import { View, Image, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

// Import from components
import { FC } from "@/components";

// Import from hooks
import { useStateManager } from "@/hooks/useStateManager";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";

// Import states
import { StateManager } from "@/screens/otp/state";

// Import styles
import { Styles } from "@/styles";
import { styles } from "@/screens/otp/styles";

export default function OtpScreen() {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const router = useRouter();

  const [state, stateFns] = useStateManager(
    StateManager.getInitialState(),
    StateManager.getStateFns
  );

  const lengthInput = 6;
  const _languageData = (language.data as any)["otpScreen"];
  let clockCall: any;
  let textInputRef = React.useRef<TextInput | null>(null);

  React.useEffect(() => {
    clockCall = setInterval(() => {
      if (state.countdownValue === 0) {
        stateFns.setEnableResend(true);
        stateFns.setCountDownValue(0);
        return clearInterval(clockCall);
      }
      stateFns.setCountDownValue(state.countdownValue - 1);
    }, 1000);
    return () => {
      clearInterval(clockCall);
    };
  }, [state.countdownValue]);

  const onChangeText = (data: any) => {
    // console.log("🚀 ~ file: OtpScreen.jsx:41 ~ onChangeText ~ val", val)
    // setOtpValue(val)
    // if (val.length === lengthInput) {
    //   verifyOtpAPI({
    //     otpCode: val,
    //     email: route.params?.email
    //   }).then((res) => {
    //     console.log("🚀 ~ file: OtpScreen.jsx:47 ~ onChangeText ~ res", res)
    //     if (res)
    //     navigation.replace('ResetPasswordScreen', {
    //       email: route.params?.email
    //     })
    //   })
    //   Keyboard.dismiss()
    // }
  };

  const handleResendOtp = () => {
    // if (enableResend) {
    //   sendOtpAPI({
    //     email: route.params?.email
    //   }).then((res) => {
    //     console.log("🚀 ~ file: OtpScreen.jsx:58 ~ sendOtpAPI ~ res", res)
    //     setOtpValue('')
    //     if (res) {
    //       setCountdown(10)
    //       setEnableResend(false)
    //     }
    //   })
    //   textInputRef.focus()
    // }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAwareScrollView
        extraScrollHeight={80}
        style={[styles.container, { backgroundColor: theme.background }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flex: 1, alignItems: "center" }}>
          <FC.AppText size="h0" color="primary" style={styles.textHeader}>
            {_languageData.text_header[language.code]}
          </FC.AppText>
          <Image
            style={styles.image}
            source={require("@/assets/images/illutration3.png")}
          />
          <FC.AppText size="body0" style={styles.label}>
            {_languageData.desc[language.code]}
          </FC.AppText>
          <View>
            <TextInput
              ref={textInputRef}
              onChangeText={onChangeText}
              style={styles.textInput}
              value={state.OTPCode}
              maxLength={lengthInput}
              returnKeyType="done"
              keyboardType="numeric"
            />
            <View style={styles.containerInput}>
              {Array(lengthInput)
                .fill("")
                .map((data, index) => (
                  <FC.RectangleButton
                    isTransparent
                    key={index}
                    onPress={() => textInputRef.current!.focus()}
                  >
                    <View
                      style={[
                        styles.cellView,
                        {
                          borderBottomColor:
                            index === state.OTPCode.length
                              ? "red"
                              : theme.onBackground,
                        },
                      ]}
                    ></View>
                  </FC.RectangleButton>
                ))}
            </View>
          </View>
          <View style={styles.bottomView}>
            <FC.RectangleButton
              defaultColor={state.enableResend ? "type_1" : "type_5"}
              disabled={!state.enableResend}
              style={Styles.spacings.mb_8}
              onPress={() => handleResendOtp()}
            >
              {(_, currentLabelStyles) => (
                <FC.AppText style={currentLabelStyles} size="h5">
                  Resend OTP{" "}
                  {state.countdownValue !== 0
                    ? `(${state.countdownValue})`
                    : ""}
                </FC.AppText>
              )}
            </FC.RectangleButton>
            <FC.RectangleButton
              isTransparent
              onPress={() => router.replace("/forgot-password")}
            >
              {(_, currentLabelStyles) => (
                <FC.AppText
                  size="h5"
                  color="secondary"
                  style={currentLabelStyles}
                >
                  Change your email
                </FC.AppText>
              )}
            </FC.RectangleButton>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
