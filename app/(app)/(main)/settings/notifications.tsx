import { useState } from 'react';
import { FC } from '@/components';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function NotificationSettings() {
    const [isEnabled, setIsEnabled] = useState(true);

    const options = [
        { label: 'Enable', value: true },
        { label: 'Disable', value: false }
    ];

    const handleChange = (value: boolean) => {
        setIsEnabled(!value);
        console.log('Notification status:', !value ? 'Enabled' : 'Disabled');
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.subtitle}>App Notifications</Text>
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
                <Text style={styles.description}>
                    {isEnabled 
                        ? 'You will receive notifications about updates and new activities'
                        : 'You will not receive notifications from the app'
                    }
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f0f0f0',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
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
        color: '#666',
    },
    toggleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    toggleButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        marginRight: 10,
    },
    activeButton: {
        backgroundColor: '#4CAF50',
    },
    inactiveButton: {
        backgroundColor: '#9e9e9e',
    },
    toggleText: {
        fontSize: 16,
        fontWeight: '600',
    },
    activeText: {
        color: '#ffffff',
    },
    inactiveText: {
        color: '#ffffff',
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
