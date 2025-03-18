import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// Import from components
import { FC } from "@/components";

// Import from hooks
import { useTheme } from "@/hooks/useTheme";

export default function HomeScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  const navigateToOverlayScreen = () => {
    // Sử dụng đường dẫn đơn giản không có dấu ngoặc đơn
    router.push("/chatbot");
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.background,
      }}
    >
      <FC.AppText style={{ marginBottom: 24 }}>Welcome to dongnaitravel</FC.AppText>

      <TouchableOpacity 
        style={[styles.chatButton, { backgroundColor: theme.primary }]} 
        onPress={navigateToOverlayScreen}
      >
        <Ionicons name="chatbubble-ellipses" size={24} color="#fff" style={styles.buttonIcon} />
        <FC.AppText style={styles.buttonText}>Chat Bot</FC.AppText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  }
});
