import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useSafeAreaConfig } from '@/hooks/useSafeArea';

export default function MapLayout() {
  const { setUseSafeArea } = useSafeAreaConfig();

  useEffect(() => {
    // Tắt safe area khi vào route map để hiển thị bản đồ toàn màn hình
    console.log('Map screen: Disabling SafeAreaView');
    setUseSafeArea(false);
    
    return () => {
      // Bật lại safe area khi rời khỏi route map
      console.log('Map screen: Re-enabling SafeAreaView');
      setUseSafeArea(true);
    };
  }, []);

  return (
    <Stack screenOptions={{ 
      headerShown: false,
      animation: 'fade',
      contentStyle: { backgroundColor: 'transparent' }
    }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
