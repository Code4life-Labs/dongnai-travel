import { useState, useCallback, useMemo } from 'react';
import { FC } from '@/components';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage } from '@/hooks/useLanguage';

export default function NotificationSettings() {
  const [isEnabled, setIsEnabled] = useState(true);
  const { theme } = useTheme();
  const { language } = useLanguage();

  const handleChange = useCallback((value: boolean) => {
    setIsEnabled(!value);
  }, []);

  const statusText = useMemo(() => 
    isEnabled 
      ? 'You will receive notifications about updates and new activities'
      : 'You will not receive notifications from the app',
    [isEnabled]
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <Text style={[styles.subtitle, { color: theme.onBackground }]}>
          App Notifications
        </Text>
        <View style={styles.toggleContainer}>
          <FC.DropDown
            name={isEnabled ? 'Enable' : 'Disable'}
            isMode={true}
            handlePressButton={() => handleChange(isEnabled)}
          />
          <View style={[
            styles.statusIndicator,
            isEnabled ? styles.activeIndicator : styles.inactiveIndicator
          ]} />
        </View>
        <Text style={[styles.description, { color: theme.onSubBackground }]}>
          {statusText}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  content: {
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    marginTop: 8,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginLeft: 8,
  },
  activeIndicator: {
    backgroundColor: '#4CAF50',
  },
  inactiveIndicator: {
    backgroundColor: '#9e9e9e',
  },
});
