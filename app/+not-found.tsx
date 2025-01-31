import { Link, Stack, useRouter } from "expo-router";
import { View, StyleSheet } from "react-native";

// Import components
import { FC } from "@/components";

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View style={styles.container}>
        <FC.AppText>This screen doesn't exist.</FC.AppText>
        <FC.RectangleButton onPress={() => router.back()} style={styles.link}>
          Go back
        </FC.RectangleButton>
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
