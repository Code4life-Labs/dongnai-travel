import { Link, Stack } from "expo-router";
import { View, StyleSheet } from "react-native";

// Import components
import { FC } from "@/components";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View style={styles.container}>
        <FC.AppText>This screen doesn't exist.</FC.AppText>
        <Link href="/" style={styles.link}>
          <FC.AppText>Go to home screen!</FC.AppText>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
