import React from "react";
import { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  Image,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  LayoutChangeEvent,
  Button,
  Animated,
  Dimensions
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Feather from "react-native-vector-icons/Feather";
import { useDispatch, useSelector } from "react-redux";
// import * as ImagePicker from 'expo-image-picker';

import styles from "@/screens/profile/styles";
import { FC } from "@/components";
import ModalShowImage from "@/components/modal_show_image/ModalShowImage";

// Import hook
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";

import { Styles } from "@/styles";
import { dimension } from "@/styles/dimension";
import { theme as appTheme } from "@/styles/theme";
import {  userActions } from "@/states/redux/user";
// import { uploadImage } from "@/utils/imageUpload";

interface ProfileScreenProps {
  route: {
    params: {
      id: string;
    };
  };
  navigation: any;
  theme: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ route, navigation }) => {
  const { user: currentAuthUser } = useAuth();
  const { theme } = useTheme();
  const { language } = useLanguage();
  const _languageData = language.data.blogScreenSetting;
  
  const [currentUser, setCurrentUser] = useState<any>(currentAuthUser);
  const [isMyProfile, setIsMyProfile] = useState<boolean>(false);
  const [openTermCondition, setOpenTermCondition] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploadImageType, setUploadImageType] = useState<'UploadCoverPhoto' | 'UploadAvatar' | null>(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState<boolean>(false);

  const dispatch = useDispatch();

  /**
   * Check if this is the current user's profile and set appropriate data
   */
  useEffect(() => {
    // In ra thông tin user đã đăng nhập
    console.log('Thông tin user đã đăng nhập:', {
      id: currentAuthUser?._id,
      username: currentAuthUser?.username,
      email: currentAuthUser?.email,
      fullUser: currentAuthUser
    });

    const profileId = route?.params?.id;
    const isOwner = currentAuthUser?._id === profileId;
    setIsMyProfile(isOwner);
    
    if (isOwner) {
      setCurrentUser(currentAuthUser);
    } else {
      // TODO: Add API call to fetch other user's profile data
      // UserManager.Api.getUserProfile(profileId)
      //   .then(response => setCurrentUser(response.data))
      //   .catch(error => console.error('Error fetching user profile:', error));
    }
  }, [currentAuthUser, route?.params?.id]);

  const pickImageFromLibrary = async () => {
    try {
      const result = await ImagePicker.launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 2000,
        maxHeight: 2000,
      });

      if (result.assets && result.assets[0]?.uri) {
        const imageUri = result.assets[0].uri;
        
        if (uploadImageType === 'UploadAvatar') {
          // Giả sử API trả về user object đã được cập nhật
          const updatedUser = await userActions.updateUserAvatar(imageUri);
          // Cập nhật user trong Redux state
          dispatch(userActions.updateUser(updatedUser));
        } else if (uploadImageType === 'UploadCoverPhoto') {
          const updatedUser = await userActions.updateUserCoverPhoto(imageUri);
          // Cập nhật user trong Redux state
          dispatch(userActions.updateUser(updatedUser));
        }

        handleCloseBottomSheet();
      }
    } catch (error) {
      console.error('Error picking image:', error);
      alert('Có lỗi xảy ra khi chọn ảnh. Vui lòng thử lại.');
    }
  };

  const handleOpenBottomSheet = () => {
    setIsBottomSheetOpen(true);
  };

  const handleCloseBottomSheet = () => {
    setIsBottomSheetOpen(false);
    setOpenTermCondition(false);
  };

  const renderCoverPhoto = () => (
    <View style={[{ 
      height: 210, 
      width: "100%", 
      overflow: 'hidden', 
      backgroundColor: theme.onBackground 
    }]}>
      {currentUser?.coverPhoto && (
        <ImageBackground
          source={{ uri: currentUser.coverPhoto }}
          style={{
            width: '100%',
            height: '100%',
          }}
          resizeMode="cover"
        >
          <TouchableOpacity
            onPress={() => {
              setSelectedImage(currentUser.coverPhoto);
              setOpenTermCondition(true);
            }}
            style={{
              width: '100%',
              height: '100%',
            }}
          />
        </ImageBackground>
      )}
    </View>
  );

  return (
    <>
      <ScrollView style={[styles.wrapper, { backgroundColor: theme.background }]}>
        <View style={styles.container}>
          <View style={{ width: dimension.screenWidth }}>
            <View>
              {renderCoverPhoto()}
              {isMyProfile && (
                <TouchableOpacity
                  style={styles.circle_icon}
                  onPress={() => {
                    setUploadImageType('UploadCoverPhoto');
                    handleOpenBottomSheet();
                  }}
                >
                  <AntDesign name="camerao" style={styles.icon_camera} />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.profile_avatar}>
            <View style={styles.circle_avatar}>
              {currentUser?.avatar && (
                <Image
                  source={{ uri: currentUser.avatar }}
                  style={{
                    height: 120,
                    width: 120,
                    borderRadius: 60,
                    resizeMode: 'cover'
                  }}
                />
              )}
              {isMyProfile && (
                <TouchableOpacity
                  style={styles.avatar_icon}
                  onPress={() => {
                    setUploadImageType('UploadAvatar');
                    handleOpenBottomSheet();
                  }}
                >
                  <AntDesign
                    name="camerao"
                    style={styles.icon_camera}
                    color={appTheme.colorNames.onTertiary}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.user_block}>
            <View style={{ alignItems: "center" }}>
              <Text style={[styles.user_name, { color: theme.onBackground }]}>
                {currentUser?.username}
              </Text>
            </View>
            <View style={styles.user_info_follow}>
              <Text style={[styles.user_follower, { color: theme.onOutline }]}>
                {currentUser?.followerIds?.length} {_languageData.user_follower[language.code]}
              </Text>
              <Text>
                <Entypo name="dot-single" size={20} color={theme.onBackground} />
              </Text>
              <Text style={[styles.user_following, { color: theme.onOutline }]}>
                {currentUser?.followingIds?.length} {_languageData.user_following[language.code]}
              </Text>
            </View>

            <View style={styles.round_rectang_button_container}>
              <FC.RectangleButton
                shape="rounded_8"
                isActive
                activeColor="type_1"
                style={{
                  flex: 0.4,
                  backgroundColor: appTheme.colorNames.onSecondary
                }}
                onPress={() => navigation.navigate("ViewStatsScreen")}
              >
                {(isActive, currentLabelStyle) => (
                  <Text style={currentLabelStyle}>{_languageData.view_stats[language.code]}</Text>
                )}
              </FC.RectangleButton>

              <FC.RectangleButton
                shape="rounded_8"
                onPress={() => navigation.navigate("EditProfileScreen")}
                style={{
                  flex: 0.4
                }}
              >
                {(isActive, currentLabelStyle) => (
                  <Text style={currentLabelStyle}>
                    <Feather name="edit-2" /> {_languageData.edit_profile[language.code]}
                  </Text>
                )}
              </FC.RectangleButton>

              <FC.RectangleButton
                shape="rounded_8"
                style={{ flex: 0.05 }}
              >
                {(isActive, currentLabelStyle) => (
                  <Text style={[currentLabelStyle, { marginLeft: -3 }]}>
                    <Entypo name="dots-three-vertical" size={20} />
                  </Text>
                )}
              </FC.RectangleButton>
            </View>

            <View style={styles.user_infos}>
              <View style={styles.user_info_block}>
                <Text style={[styles.user_info_title, { color: theme.onBackground }]}>
                  {_languageData.bio[language.code]}
                </Text>
                <Text style={[styles.user_bio_content, { color: theme.onOutline }]}>
                  {currentUser?.userBio}
                </Text>
              </View>
            </View>

            <View style={styles.user_infos}>
              <View style={styles.user_info_block}>
                <Text style={[styles.user_info_title, { color: theme.onBackground }]}>
                  {_languageData.information[language.code]}
                </Text>
                <View style={styles.user_info_other}>
                  <AntDesign
                    style={[styles.user_info_other_icon, { color: theme.onBackground }]}
                    name="enviromento"
                  />
                  <Text style={[styles.user_info_other_content, { color: theme.onOutline }]}>
                    <Text>{_languageData.live_in[language.code]} </Text>
                    <Text style={styles.user_info_address}>
                      {currentUser?.userInfo?.userAddress}
                    </Text>
                  </Text>
                </View>
                <View style={styles.user_info_other}>
                  <MaterialCommunityIcons
                    style={[styles.user_info_other_icon, { color: theme.onBackground }]}
                    name="facebook"
                  />
                  <FC.AppText
                    key={1}
                    style={styles.user_info_other_content}
                    hyperLink={currentUser?.userSocial?.userFacebook}
                  >
                    {currentUser?.userSocial?.userFacebook}
                  </FC.AppText>
                </View>
                <View style={styles.user_info_other}>
                  <Entypo
                    style={[styles.user_info_other_icon, { color: theme.onBackground }]}
                    name="instagram"
                  />
                  <FC.AppText
                    key={2}
                    style={styles.user_info_other_content}
                    hyperLink={currentUser?.userSocial?.userInstagram}
                  >
                    {currentUser?.userSocial?.userInstagram}
                  </FC.AppText>
                </View>
              </View>
            </View>
            <View style={[styles.line_horizontal, { borderBottomColor: theme.onBackground }]} />
          </View>

          <View style={styles.blog_block}>
            <TouchableOpacity
              style={[styles.btn_create_blog, { backgroundColor: theme.primary }]}
              onPress={() => navigation.navigate("CreatePostScreen")}
            >
              <MaterialCommunityIcons
                style={{ color: theme.onPrimary, marginRight: 6 }}
                name="pencil-outline"
                size={18}
              />
              <Text style={[styles.btn_create_blog_name, { color: theme.onPrimary }]}>
                {_languageData.write_new_blog[language.code]}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn_manage_blog, { backgroundColor: theme.primary }]}>
              <Text style={[styles.btn_manage_blog_name, { color: theme.onPrimary }]}>
                {_languageData.manage_blogs[language.code]}
              </Text>
            </TouchableOpacity>
            <View>
              <View style={styles.blog_title_container}>
                <Text style={[styles.blog_title, { color: theme.onPrimary }]}>
                  {_languageData.blog_list[language.code]}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <FC.BottomSheetScroll
        haveBtn={false}
        isOpen={isBottomSheetOpen}
        close={handleCloseBottomSheet}
        snapPoints={["30%", "50%", "74%"]}
        haveOverlay
        bottomSheetScrollViewStyle={{ paddingHorizontal: 16 }}
        handleLabelBtn={() => {}}
      >
        <View>
          <TouchableOpacity
            style={styles.choice_setting_image}
            onPress={pickImageFromLibrary}
          >
            <Entypo
              name="images"
              size={25}
              style={styles.choice_setting_icon}
            />
            <Text style={styles.choice_setting_image_name}>
              {_languageData.choice_setting[language.code]}
            </Text>
          </TouchableOpacity>
        </View>
      </FC.BottomSheetScroll>

      <ModalShowImage 
        visible={openTermCondition}
        imageUrl={selectedImage}
        onClose={() => setOpenTermCondition(false)}
      />
    </>
  );
};

export default ProfileScreen;

