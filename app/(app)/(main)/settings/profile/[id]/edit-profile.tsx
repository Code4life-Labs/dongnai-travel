import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import Ionicons from "react-native-vector-icons/Ionicons";

// Import hooks
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage } from '@/hooks/useLanguage';

// Import objects
import { UserManager } from '@/objects/user';

// Import styles
import styles from '@/screens/edit-profile/styles'
import { Styles } from '@/styles';

export default function EditProfileScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { user, token, authDispatchers } = useAuth();
  const { theme } = useTheme();
  const { language } = useLanguage();
  
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    displayName: '',
    bio: '',
    phoneNumber: '',
    address: '',
    birthday: null as Date | null,
    username: '',
  });
  
  const [avatar, setAvatar] = useState<string | null>(null);
  const [coverPhoto, setCoverPhoto] = useState<string | null>(null);
  const [newAvatar, setNewAvatar] = useState<any>(null);
  const [newCoverPhoto, setNewCoverPhoto] = useState<any>(null);

  // Load user data when component mounts or user changes
  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        displayName: user.displayName || '',
        bio: user.bio || '',
        phoneNumber: user.phoneNumber || '',
        address: user.address || '',
        birthday: user.birthday ? new Date(user.birthday) : null,
        username: user.username || '',
      });
      setAvatar(user.avatar || null);
      setCoverPhoto(user.coverPhoto || null);
    }
  }, [user]);

  // Check authorization
  useEffect(() => {
    if (user && id) {
      const userId = String(user._id);
      const paramId = String(id);
      
      const isAuthorized = userId === paramId || user.role?.value === 'Admin';
      
      if (!isAuthorized) {
        Alert.alert('Unauthorized', 'You cannot edit this profile');
      }
    }
  }, [user, id, router]);

  // Handle input changes
  const handleChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Pick image from gallery
  const pickImage = async (type: 'avatar' | 'cover') => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: type === 'avatar' ? [1, 1] : [16, 9],
        quality: 0.8,
      });

      if (!result.canceled) {
        if (type === 'avatar') {
          setAvatar(result.assets[0].uri);
          setNewAvatar(result.assets[0]);
        } else {
          setCoverPhoto(result.assets[0].uri);
          setNewCoverPhoto(result.assets[0]);
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image');
    }
  };

  // Submit form
  const handleSubmit = async () => {
    if (!user || !token) {
      Alert.alert('Error', 'You must be logged in to update your profile');
      return;
    }

    try {
      setLoading(true);

      // Create FormData for file uploads
      const formData = new FormData();
      
      // Add only non-empty fields to formData
      Object.keys(profileData).forEach(key => {
        const value = profileData[key as keyof typeof profileData];
        // Only append if value exists and is not an empty string
        if (value && value.toString().trim() !== '') {
          const formValue = value instanceof Date ? value.toISOString() : value;
          formData.append(key, formValue as string);
        }
      });
      
      // Add avatar if changed
      if (newAvatar) {
        // Log để kiểm tra thông tin tệp
        console.log('Avatar file info:', {
          uri: newAvatar.uri,
          type: newAvatar.type || 'image/jpeg',
          name: newAvatar.fileName || 'avatar.jpg'
        });
        
        formData.append('newAvatar', {
          uri: newAvatar.uri,
          type: newAvatar.type || 'image/jpeg',
          name: newAvatar.fileName || 'avatar.jpg',
        } as any);
        
        // If replacing an existing avatar, send the old one for deletion
        if (user?.avatar && user.avatar !== newAvatar.uri) {
          formData.append('deletedAvatar', user.avatar);
        }
      }
      
      // Add cover photo if changed
      if (newCoverPhoto) {
        formData.append('newCoverPhoto', {
          uri: newCoverPhoto.uri,
          type: 'image/jpeg',
          name: 'cover.jpg',
        } as any);
        
        // If replacing an existing cover photo, send the old one for deletion
        if (user?.coverPhoto && user.coverPhoto !== newCoverPhoto.uri) {
          formData.append('deletedCoverPhoto', user.coverPhoto);
        }
      }
      
      // Kiểm tra FormData trước khi gửi
      const formDataEntries = [];
      for (let [key, value] of (formData as any).entries()) {
        formDataEntries.push({ key, value: typeof value === 'object' ? 'File object' : value });
      }
      console.log('FormData entries:', formDataEntries);
      
      const response = await UserManager.Api.updateProfile(id as string, formData, token);
      
      // Log phản hồi đầy đủ để kiểm tra
      console.log('Full API response:', response);
      
      // Update user in state
      if (response && response.data) {
        console.log('User data from response:', response.data);
        authDispatchers.setUser(response.data);
        
        // Navigate back
        // Alert.alert('Success', 'Profile updated successfully', [
        //   { text: 'OK', onPress: () => router.back() }
        // ]);
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Cover Photo */}
      <View style={styles.coverPhotoContainer}>
        {coverPhoto ? (
          <>
            <Image source={{ uri: coverPhoto }} style={styles.coverPhoto} />
            <TouchableOpacity 
              style={styles.editCoverButton} 
              onPress={() => pickImage('cover')}
            >
              <Ionicons name="camera" size={20} color="#fff" />
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity 
            style={[styles.placeholderCover, { backgroundColor: theme.onBackground }]} 
            onPress={() => pickImage('cover')}
          >
            <Text style={styles.placeholderText}>
              {language.code === 'vi' ? 'Thêm ảnh bìa' : 'Add Cover Photo'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        {avatar ? (
          <>
            <Image source={{ uri: avatar }} style={styles.avatar} />
            <TouchableOpacity 
              style={styles.editAvatarButton} 
              onPress={() => pickImage('avatar')}
            >
              <Ionicons name="camera" size={16} color="#fff" />
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity 
            style={[styles.placeholderAvatar, { backgroundColor: theme.onBackground }]} 
            onPress={() => pickImage('avatar')}
          >
            <Text style={styles.placeholderText}>
              {user?.username ? user.username.charAt(0).toUpperCase() : 'A'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      
      {/* Form */}
      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.onBackground }]}>
            {language.code === 'vi' ? 'Tên' : 'First Name'}
          </Text>
          <TextInput
            style={[styles.input, { color: theme.onBackground, borderColor: theme.onBackground }]}
            value={profileData.firstName}
            onChangeText={(text) => handleChange('firstName', text)}
            placeholder={language.code === 'vi' ? 'Tên' : 'First Name'}
            placeholderTextColor={theme.onBackground}
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.onBackground }]}>
            {language.code === 'vi' ? 'Họ' : 'Last Name'}
          </Text>
          <TextInput
            style={[styles.input, { color: theme.onBackground, borderColor: theme.onBackground }]}
            value={profileData.lastName}
            onChangeText={(text) => handleChange('lastName', text)}
            placeholder={language.code === 'vi' ? 'Họ' : 'Last Name'}
            placeholderTextColor={theme.onBackground}
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.onBackground }]}>
            {language.code === 'vi' ? 'Tên hiển thị' : 'Display Name'}
          </Text>
          <TextInput
            style={[styles.input, { color: theme.onBackground, borderColor: theme.onBackground }]}
            value={profileData.displayName}
            onChangeText={(text) => handleChange('displayName', text)}
            placeholder={language.code === 'vi' ? 'Tên hiển thị' : 'Display Name'}
            placeholderTextColor={theme.onBackground}
          />
        </View>
        
        <TouchableOpacity 
          style={[
            styles.submitButton, 
            { backgroundColor: theme.primary },
            loading && { opacity: 0.7 }
          ]} 
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.submitButtonText}>
              {language.code === 'vi' ? 'Lưu' : 'Save'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
