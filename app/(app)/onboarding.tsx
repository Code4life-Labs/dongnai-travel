import React from "react";
import { View, Text, StyleSheet, Button, Image } from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";
import { router } from "expo-router";

// Import hooks
import { useStatus } from "@/hooks/useStatus";

// Import styles
import { Styles } from "@/styles";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    padding: 10,
    justifyContent: "center",
  },
  titleStyle: {
    padding: 10,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  introTitleStyle: {
    fontSize: 25,
    color: "white",
    textAlign: "center",
    marginBottom: 16,
    fontWeight: "bold",
  },
  introImageStyle: {
    width: 330,
    height: 330,
  },
  introTextStyle: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
    paddingVertical: 30,
  },
});

const slides = [
  {
    key: "s1",
    text: "You can sefile and post your pictures anywhere at any time",
    title: "Sefile and Post",
    source: (
      <Image
        style={styles.introImageStyle}
        source={require("@/assets/images/aboarding1.png")}
      />
    ),
    backgroundColor: "#52DD79",
  },
  {
    key: "s2",
    title: "Sharing Happiness",
    text: "Sharing happiness by sharing your memories in social media platform",
    source: (
      <Image
        style={styles.introImageStyle}
        source={require("@/assets/images/aboarding2.png")}
      />
    ),
    backgroundColor: "#51AEFF",
  },
  {
    key: "s3",
    title: "Video call",
    text: "Connect with your friends through video call",
    source: (
      <Image
        style={styles.introImageStyle}
        source={require("@/assets/images/aboarding3.png")}
      />
    ),
    backgroundColor: "#22BCB5",
  },
  {
    key: "s4",
    title: "Conecting people",
    text: "Make new friends around the world",
    source: (
      <Image
        style={styles.introImageStyle}
        source={require("@/assets/images/aboarding4.png")}
      />
    ),
    backgroundColor: "#BA68C8",
  },
];

export default function OnboardingScreen(props: any) {
  const { status, statusDispatchers } = useStatus();

  const renderItem = ({ item }: { item: any }) => {
    return (
      <View
        style={[
          {
            flex: 1,
            backgroundColor: item.backgroundColor,
            alignItems: "center",
            justifyContent: "center",
            paddingBottom: 100,
          },
          Styles.spacings.ph_18,
        ]}
      >
        <Text style={styles.introTitleStyle}>{item.title}</Text>
        {item.source}
        <Text style={styles.introTextStyle}>{item.text}</Text>
      </View>
    );
  };

  React.useEffect(() => {
    if (!status.isFirstTimeLaunch) router.replace("/");
  }, [status.isFirstTimeLaunch]);

  return (
    <AppIntroSlider
      data={slides}
      renderItem={renderItem}
      onDone={() => {
        statusDispatchers.setIsFirstTimeLaunch(false);
      }}
      onSkip={() => {
        statusDispatchers.setIsFirstTimeLaunch(false);
      }}
      showSkipButton={true}
    ></AppIntroSlider>
  );
}
