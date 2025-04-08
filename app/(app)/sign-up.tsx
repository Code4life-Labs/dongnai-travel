import React from "react";
import { View } from "react-native";
import { Link, useRouter } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useForm, Controller } from "react-hook-form";
import Octicons from "react-native-vector-icons/Octicons";

// Import from components
import { FC } from "@/components";

// Import from constants
import { REGEXES } from "@/constants/regexes";

// Import from hooks
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";
import { useStateManager } from "@/hooks/useStateManager";

// Import screen configs (Import from local)
// Import states
import { StateManager } from "@/screens/signup/state";

// Import styles
import { Styles } from "@/styles";
import { styles } from "@/screens/signup/styles";

export default function SignUpScreen() {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const router = useRouter();

  const _formLanguageData = (language.data as any)["form"];
  const _languageData = (language.data as any)["signUpScreen"];
  const termsConditions = (language.data as any)["termsConditions"];

  const [state, stateFns] = useStateManager(
    StateManager.getInitialState(),
    StateManager.getStateFns
  );

  // const { signup } = useAuthActions();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      birthday: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async function (data: any) {
    // await signup(data, {
    //   checkConditionFirst: () => {
    //     if (!isChecked)
    //       dispatch(
    //         updateNotif({
    //           appearNotificationBottomSheet: true,
    //           contentNotificationBottomSheet:
    //             _languageData.prompt_check[language.code],
    //         })
    //       );
    //     return isChecked;
    //   },
    //   callWhenResolve: () => {
    //     // Back to sign in screen
    //     router.replace("/(auth)");
    //   },
    // });
  };

  const handleDateChange = (e: any, date: Date) => {
    console.log(
      "🚀 ~ file: SignupScreen.js:88 ~ handleDateChange ~ date",
      date
    );
    console.log("🚀 ~ file: SignupScreen.js:88 ~ handleDateChange ~ e", e);
    stateFns.setTimestamp(e.timeStamp);
    stateFns.setDate(date);
  };

  return (
    <>
      <KeyboardAwareScrollView
        extraScrollHeight={40}
        style={[
          styles.containerScrollView,
          { backgroundColor: theme.background },
        ]}
        // behavior={Platform.OS === "ios" ? "padding" : "height"}
        showsVerticalScrollIndicator={false}
      >
        {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        </TouchableWithoutFeedback> */}
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          <View style={styles.content}>
            <FC.AppText size="h0" color="primary" style={Styles.spacings.mb_18}>
              {_languageData?.text_header[language.code]}
            </FC.AppText>

            <FC.AppText size="h5" style={Styles.spacings.mb_12}>
              {_languageData?.intro_youself[language.code]}
            </FC.AppText>

            <Controller
              control={control}
              rules={{
                required: {
                  value: true,
                  message:
                    _formLanguageData.field_required_message[language.code],
                },
              }}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <FC.Input
                  label={_languageData?.email[language.code]}
                  hint={_languageData?.enter_email[language.code]}
                  isPassword={false}
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                  isError={Boolean(errors.email)}
                  containerStyle={{
                    marginTop: 0,
                  }}
                />
              )}
            />
            {errors.email && (
              <FC.AppText style={styles.textError}>
                {errors.email?.message}
              </FC.AppText>
            )}

            <View style={styles.fullname}>
              <View style={styles.containerError}>
                <Controller
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message:
                        _formLanguageData.field_required_message[language.code],
                    },
                    minLength: {
                      value: 2,
                      message:
                        _formLanguageData.at_least2chars_rule_message[
                          language.code
                        ],
                    },
                  }}
                  name="firstName"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <FC.Input
                      label={_languageData?.first_name[language.code]}
                      hint={_languageData?.enter_first_name[language.code]}
                      isPassword={false}
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      isError={Boolean(errors.firstName)}
                    />
                  )}
                />
                {errors.firstName && (
                  <FC.AppText style={styles.textError}>
                    {errors.firstName?.message}
                  </FC.AppText>
                )}
              </View>
              <View style={styles.fillView} />
              <View style={styles.containerError}>
                <Controller
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message:
                        _formLanguageData.field_required_message[language.code],
                    },
                    minLength: {
                      value: 2,
                      message:
                        _formLanguageData.at_least2chars_rule_message[
                          language.code
                        ],
                    },
                  }}
                  name="lastName"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <FC.Input
                      label={_languageData?.last_name[language.code]}
                      hint={_languageData?.enter_last_name[language.code]}
                      isPassword={false}
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      isError={Boolean(errors.lastName)}
                    />
                  )}
                />
                {errors.lastName && (
                  <FC.AppText style={styles.textError}>
                    {errors.lastName?.message}
                  </FC.AppText>
                )}
              </View>
            </View>

            <Controller
              control={control}
              rules={{
                required: {
                  value: true,
                  message:
                    _formLanguageData.field_required_message[language.code],
                },
                pattern: {
                  value: REGEXES.USER.BIRTHDAY,
                  message:
                    _formLanguageData.birthday_rule_message[language.code],
                },
              }}
              name="birthday"
              render={({ field: { onChange, onBlur, value } }) => (
                <FC.Input
                  label={_languageData?.birthday[language.code]}
                  hint={_languageData?.enter_birthday[language.code]}
                  isPassword={false}
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                  isError={Boolean(errors.birthday)}
                />
              )}
            />
            {errors.birthday && (
              <FC.AppText style={styles.textError}>
                {errors.birthday?.message}
              </FC.AppText>
            )}

            <FC.AppText
              size="h5"
              style={[Styles.spacings.mb_12, Styles.spacings.mt_18]}
            >
              {_languageData?.fill_info[language.code]}
            </FC.AppText>

            <Controller
              control={control}
              rules={{
                required: {
                  value: true,
                  message:
                    _formLanguageData.field_required_message[language.code],
                },
                minLength: {
                  value: 8,
                  message:
                    _formLanguageData.field_min_length_message[language.code],
                },
              }}
              name="username"
              render={({ field: { onChange, onBlur, value } }) => (
                <FC.Input
                  label={_languageData?.username[language.code]}
                  hint={_languageData?.enter_username[language.code]}
                  isPassword={false}
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                  isError={Boolean(errors.username)}
                  containerStyle={{
                    marginTop: 0,
                  }}
                />
              )}
            />
            {errors.username && (
              <FC.AppText style={styles.textError}>
                {errors.username?.message}
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
                  label={_languageData?.password[language.code]}
                  hint={_languageData?.enter_password[language.code]}
                  isPassword={true}
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                  isError={Boolean(errors.password)}
                />
              )}
            />
            {errors.password && (
              <FC.AppText style={styles.textError}>
                {errors.password?.message}
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
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <FC.Input
                  label={_languageData?.confirm_password[language.code]}
                  hint={_languageData?.enter_confirm_password[language.code]}
                  isPassword={true}
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                  isError={Boolean(errors.confirmPassword)}
                />
              )}
            />
            {errors.confirmPassword && (
              <FC.AppText style={styles.textError}>
                {errors.confirmPassword?.message}
              </FC.AppText>
            )}

            <View style={[styles.terms, Styles.spacings.mv_12]}>
              <FC.AppText style={styles.textRead}>
                {_languageData?.read_our[language.code]}
              </FC.AppText>
              {/* <FC.RectangleButton
                onPress={() => setOpenTermCondition(true)}
              >
                {_languageData?.term_condition[language.code]}
              </FC.RectangleButton> */}
              <FC.AppText
                color="secondary"
                onPress={() => stateFns.setIsTermConditionsVisible(true)}
                style={Styles.spacings.ms_6}
              >
                {_languageData?.term_condition[language.code]}
              </FC.AppText>
              {language.code === "vi" && (
                <FC.AppText style={styles.textRead}>của chúng tôi</FC.AppText>
              )}
            </View>
            {state.isCheckBoxVisible && (
              <View style={styles.containerReFor}>
                <FC.CheckBoxText
                  isChecked={state.isChecked}
                  label={_languageData?.agree[language.code]}
                  onPress={() => stateFns.setIsChecked(!state.isChecked)}
                />
              </View>
            )}
            <FC.RectangleButton
              shape="rounded_8"
              onPress={handleSubmit(onSubmit)}
              style={[Styles.spacings.mt_12, Styles.spacings.pv_16]}
            >
              {_languageData?.text_header[language.code]}
            </FC.RectangleButton>
          </View>

          <View style={styles.containerSignup}>
            <FC.AppText>
              {_languageData?.have_account[language.code]}
            </FC.AppText>
            <FC.RectangleButton
              isTransparent
              isOnlyContent
              onPress={() => router.back()}
            >
              <FC.AppText
                size="h5"
                color="secondary"
                style={[styles.labelSignup, Styles.spacings.ms_6]}
              >
                {_languageData?.sign_in[language.code]}
              </FC.AppText>
            </FC.RectangleButton>
          </View>
        </View>
      </KeyboardAwareScrollView>
      <FC.BottomSheetScroll
        bottomSheetScrollViewStyle={{ backgroundColor: theme.background }}
        isOpen={state.isTermConditionsVisible}
        close={() => {
          stateFns.setIsTermConditionsVisible(false);
          stateFns.setIsCheckBoxVisible(true);
        }}
        handleLabelBtn={() => {
          stateFns.setIsTermConditionsVisible(false);
          stateFns.setIsCheckBoxVisible(true);
          stateFns.setIsChecked(true);
        }}
        labelBtn={_languageData.agree_short[language.code]}
        snapPoints={["25%", "100%"]}
      >
        {termsConditions[language.code].map((item: any) => (
          <View key={`term-${item.id}`}>
            <FC.AppText
              size="h4"
              style={[styles.headerText, Styles.spacings.mt_18]}
            >
              {item.headerText}
            </FC.AppText>
            {item.paragraphs.map((paragraph: any, index: number) => (
              <View key={`paragraph-${index}`}>
                <FC.AppText style={styles.paragraph}>
                  {paragraph.content}
                </FC.AppText>
                {paragraph.childContent &&
                  paragraph.childContent.map((child: any, index: number) => (
                    <View key={`childcontent-${index}`}>
                      <View style={styles.childContentContainer}>
                        <Octicons
                          name="dot-fill"
                          size={14}
                          color={theme.onBackground}
                        />
                        <FC.AppText style={styles.childContent}>
                          {child}
                        </FC.AppText>
                      </View>
                    </View>
                  ))}
              </View>
            ))}
          </View>
        ))}
      </FC.BottomSheetScroll>
    </>
  );
}
