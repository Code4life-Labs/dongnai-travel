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

  // Thêm hàm kiểm tra thay đổi
  const hasChanges = () => {
    // Kiểm tra thay đổi trong text fields
    const hasTextChanges = 
      profileData.firstName !== (user?.firstName || '') ||
      profileData.lastName !== (user?.lastName || '') ||
      profileData.displayName !== (user?.displayName || '');

    // Kiểm tra thay đổi ảnh
    const hasAvatarChange = newAvatar !== null;
    const hasCoverChange = newCoverPhoto !== null;

    return hasTextChanges || hasAvatarChange || hasCoverChange;
  };

  // Submit form
  const handleSubmit = async () => {
    if (!user || !token) {
      Alert.alert('Error', 'You must be logged in to update your profile');
      return;
    }

    // Kiểm tra có thay đổi không
    if (!hasChanges()) {
      Alert.alert(
        language.code === 'vi' ? 'Thông báo' : 'Notice',
        language.code === 'vi' 
          ? 'Không phát hiện thay đổi nào. Bạn có muốn quay lại?' 
          : 'No changes detected. Do you want to go back?',
        [
          {
            text: language.code === 'vi' ? 'Ở lại' : 'Stay',
            style: 'cancel',
          },
          {
            text: language.code === 'vi' ? 'Quay lại' : 'Go back',
            onPress: () => router.back(),
          },
        ]
      );
      return;
    }

    try {
      setLoading(true);

      // Log current user and token for debugging
      console.log('Current user:', user._id);
      console.log('Token:', token.substring(0, 20) + '...');

      // Create FormData object
      const formData = new FormData();
      
      // Add basic profile data with detailed logging
      Object.keys(profileData).forEach(key => {
        const value = profileData[key as keyof typeof profileData];
        console.log(`Processing field ${key}:`, value);
        
        if (value !== null && value !== undefined && value !== '') {
          if (key === 'birthday' && typeof value === 'object' && value !== null && 'toISOString' in value) {
            formData.append(key, (value as any).toISOString());
          } else {
            formData.append(key, String(value));
          }
        }
      });

      // Handle avatar upload with detailed logging
      if (newAvatar) {
        console.log('Processing avatar:', {
          uri: newAvatar.uri,
          type: newAvatar.type,
          name: newAvatar.fileName
        });

        const fileExtension = newAvatar.uri.split('.').pop() || 'jpg';
        const fileName = `avatar-${Date.now()}.${fileExtension}`;
        
        const avatarFile = {
          uri: newAvatar.uri,
          type: `image/${fileExtension}`,
          name: fileName,
        };

        console.log('Prepared avatar file:', avatarFile);
        formData.append('newAvatar', avatarFile as any);
      }

      // Handle cover photo upload with detailed logging
      if (newCoverPhoto) {
        console.log('Processing cover photo:', {
          uri: newCoverPhoto.uri,
          type: newCoverPhoto.type,
          name: newCoverPhoto.fileName
        });

        const fileExtension = newCoverPhoto.uri.split('.').pop() || 'jpg';
        const fileName = `cover-${Date.now()}.${fileExtension}`;
        
        const coverFile = {
          uri: newCoverPhoto.uri,
          type: `image/${fileExtension}`,
          name: fileName,
        };

        console.log('Prepared cover file:', coverFile);
        formData.append('newCoverPhoto', coverFile as any);
      }

      // Log final FormData content
      console.log('Final FormData entries:');
      for (let pair of (formData as any).entries()) {
        console.log(pair[0], ':', typeof pair[1] === 'object' ? 'File' : pair[1]);
      }

      // Make API call with detailed error handling
      try {
        const response = await UserManager.Api.updateProfile(id as string, formData, token);
        console.log('API Response:', response);

        if (response?.data) {
          // Cập nhật thông tin người dùng trong Redux store
          authDispatchers.setUser(response.data);
          
          // Hiển thị thông báo thành công và quay lại màn hình profile
          Alert.alert(
            'Success', 
            language.code === 'vi' ? 'Cập nhật thông tin thành công' : 'Profile updated successfully',
            [
              {
                text: 'OK',
                onPress: () => {
                  // Quay lại màn hình profile sau khi cập nhật thành công
                  router.back();
                }
              }
            ]
          );
        }
      } catch (apiError: any) {
        console.error('API Error Details:', {
          status: apiError.response?.status,
          data: apiError.response?.data,
          message: apiError.message,
        });
        throw apiError;
      }

    } catch (error: any) {
      console.error('Error updating profile:', error);
      Alert.alert(
        'Error',
        language.code === 'vi' 
          ? `Không thể cập nhật thông tin: ${error.response?.data?.message || error.message}`
          : `Could not update profile: ${error.response?.data?.message || error.message}`
      );
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
