import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Image, TextInput, TextInputProps } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import { useDispatch } from 'react-redux';

// Import components
import { FC } from "@/components";

// Import hooks
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";

// Import actions
import { userActions } from "@/states/redux/user";
import { UserManager } from "@/objects/user";

interface ProfileFormData {
  avatar: string;
  displayName: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  birthday: number;
}

interface CustomInputProps extends TextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
}

export default function EditProfile() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { theme } = useTheme();
  const { language } = useLanguage();
  const { user: currentAuthUser } = useAuth();
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState<ProfileFormData>({
    avatar: currentAuthUser?.avatar || '',
    displayName: currentAuthUser?.displayName || '',
    username: currentAuthUser?.username || '',
    email: currentAuthUser?.email || '',
    firstName: currentAuthUser?.firstName || '',
    lastName: currentAuthUser?.lastName || '',
    birthday: currentAuthUser?.birthday || 0
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Kiểm tra xem có phải đang edit profile của chính user đó không
    if (id !== currentAuthUser?._id) {
      router.back();
    }
  }, [id, currentAuthUser]);

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]?.uri) {
        const imageUri = result.assets[0].uri;
        
        // Upload ảnh và lấy URL từ API
        const uploadedImageUrl = await UserManager.Api.uploadAvatar(imageUri);
        
        // Cập nhật state local
        setFormData(prev => ({
          ...prev,
          avatar: uploadedImageUrl
        }));

        // Dispatch action để cập nhật avatar trong Redux
        dispatch(userActions.updateUserAvatar(uploadedImageUrl));
      }
    } catch (error) {
      console.error('Error picking/uploading image:', error);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      // Gọi API để cập nhật thông tin user
      const updatedUserData = await UserManager.Api.updateProfile({
        displayName: formData.displayName,
        firstName: formData.firstName,
        lastName: formData.lastName,
      });

      // Dispatch action để cập nhật user trong Redux
      dispatch(userActions.updateUser(updatedUserData));
      
      router.back();
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const CustomInput = ({ label, value, onChangeText, ...props }: CustomInputProps) => (
    <View style={{ marginBottom: 16 }}>
      <FC.AppText style={{ marginBottom: 8, color: theme.onBackground }}>
        {label}
      </FC.AppText>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        style={{
          padding: 12,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: theme.onBackground,
          color: theme.onBackground,
          backgroundColor: theme.subBackground
        }}
        placeholderTextColor={theme.onSubBackground}
        {...props}
      />
    </View>
  );

  return (
    <ScrollView 
      style={{ 
        flex: 1, 
        backgroundColor: theme.background,
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: theme.onBackground 
      }}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.onBackground} />
        </TouchableOpacity>
        <FC.AppText size="h2">Chỉnh sửa trang cá nhân</FC.AppText>
        <TouchableOpacity 
          onPress={handleSave}
          disabled={loading}
        >
          <FC.AppText 
            style={{ 
              color: theme.primary,
              opacity: loading ? 0.5 : 1 
            }}
          >
            Lưu
          </FC.AppText>
        </TouchableOpacity>
      </View>

      {/* Avatar Section */}
      <View style={{ alignItems: 'center', padding: 20 }}>
        <TouchableOpacity onPress={handlePickImage}>
          {formData.avatar ? (
            <Image
              source={{ uri: formData.avatar }}
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
              }}
            />
          ) : (
            <View style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: theme.onBackground,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Ionicons name="camera" size={32} color={theme.onBackground} />
            </View>
          )}
        </TouchableOpacity>
        <FC.AppText 
          style={{ 
            marginTop: 8,
            color: theme.primary 
          }}
        >
          Chỉnh sửa ảnh hoặc avatar
        </FC.AppText>
      </View>

      {/* Form Fields */}
      <View style={{ padding: 16 }}>
        <CustomInput
          label="Tên"
          value={formData.displayName}
          onChangeText={(text) => setFormData(prev => ({ ...prev, displayName: text }))}
          placeholder="Nhập tên hiển thị"
        />

        <CustomInput
          label="Tên người dùng"
          value={formData.username}
          onChangeText={(text) => setFormData(prev => ({ ...prev, username: text }))}
          placeholder="Nhập tên người dùng"
        />

        <CustomInput
          label="Email"
          value={formData.email}
          onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
          placeholder="Nhập email"
          keyboardType="email-address"
          editable={false}
        />

        <CustomInput
          label="Họ"
          value={formData.lastName}
          onChangeText={(text) => setFormData(prev => ({ ...prev, lastName: text }))}
          placeholder="Nhập họ"
        />

        <CustomInput
          label="Tên"
          value={formData.firstName}
          onChangeText={(text) => setFormData(prev => ({ ...prev, firstName: text }))}
          placeholder="Nhập tên"
        />
      </View>
    </ScrollView>
  );
}
