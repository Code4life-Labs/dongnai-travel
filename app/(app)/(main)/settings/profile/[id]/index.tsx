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
  Dimensions,
  Alert,
  FlatList
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Feather from "react-native-vector-icons/Feather";
import { useDispatch, useSelector } from "react-redux";
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import Ionicons from "react-native-vector-icons/Ionicons";

import { FC } from "@/components";
import ModalShowImage from "@/components/modal_show_image/ModalShowImage";

// Import hook
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";
import { useBlogs } from "@/hooks/useBlog";

import styles from "@/screens/profile/styles";
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
  const [isMyProfile, setIsMyProfile] = useState<boolean>(true);
  const [openTermCondition, setOpenTermCondition] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploadImageType, setUploadImageType] = useState<'UploadCoverPhoto' | 'UploadAvatar' | null>(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState<boolean>(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const dispatch = useDispatch();
  const { id } = useLocalSearchParams();

  // Add these new hooks and states
  const { blogs, status, blogsDispatchers } = useBlogs();
  const [userBlogs, setUserBlogs] = useState<any[]>([]);

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

  // Add this useEffect to fetch user's blogs
  useEffect(() => {
    if (currentUser?._id) {
      console.log('Fetching blogs for user:', currentUser._id);
      blogsDispatchers.fetchBlogs(currentUser._id);
    }
  }, [currentUser?._id]);

  // Add this useEffect to update userBlogs when blogs changes
  useEffect(() => {
    if (blogs) {
      console.log('Blogs data:', {
        total: blogs.length,
        blogs: blogs.map(blog => ({
          id: blog._id,
          name: blog.name,  // Use name instead of title
          author: blog.author?.username || blog.author?._id,
          createdAt: blog.createdAt,
          content: blog.content,
          coverImage: blog.coverImage
        }))
      });
      setUserBlogs(blogs);
    }
  }, [blogs]);

  const pickImageFromLibrary = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (!result.canceled && result.assets && result.assets[0]?.uri) {
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

  const renderUserInfo = () => (
    <View style={styles.user_block}>
      <View style={styles.header_container}>
        
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={[styles.user_name, { color: theme.onBackground }]}>
            {currentUser?.displayName || currentUser?.username}
          </Text>
          <Text style={[styles.user_username, { color: theme.onBackground }]}>
            @{currentUser?.username}
          </Text>
        </View>
      </View>
      
      {/* <TouchableOpacity 
        style={styles.edit_button}
        // onPress={() => {
        //   // TODO: Navigate to edit profile screen
        //   console.log('Navigate to edit profile');
        // }}
      >
        <Entypo 
          name="phosphor-dots-three-fill" 
          size={24} 
          color={theme.onPrimary}
        />
      </TouchableOpacity> */}
        
      <View style={styles.user_info_follow}>
        <Text style={[styles.user_follower, { color: theme.onBackground }]}>
          {currentUser?.followerIds?.length || 0} {_languageData.user_follower[language.code]}
        </Text>
        <Text>
          <Entypo name="dot-single" size={20} color={theme.onBackground} />
        </Text>
        <Text style={[styles.user_following, { color: theme.onBackground }]}>
          {currentUser?.followingIds?.length || 0} {_languageData.user_following[language.code]}
        </Text>
      </View>

      <View style={styles.user_infos}>
        <View style={styles.user_info_block}>
          <Text style={[styles.user_info_title, { color: theme.onBackground }]}>
            {_languageData.information[language.code]}
          </Text>
          
          {(currentUser?.firstName || currentUser?.lastName) && (
            <View style={styles.user_info_other}>
              <AntDesign
                style={[styles.user_info_other_icon, { color: theme.onBackground }]}
                name="user"
              />
              <Text style={[styles.user_info_other_content, { color: theme.onBackground }]}>
                {[currentUser?.firstName, currentUser?.lastName].filter(Boolean).join(' ')}
              </Text>
            </View>
          )}

          <View style={styles.user_info_other}>
            <AntDesign
              style={[styles.user_info_other_icon, { color: theme.onBackground }]}
              name="mail"
            />
            <Text style={[styles.user_info_other_content, { color: theme.onBackground }]}>
              {currentUser?.email}
            </Text>
          </View>

          {currentUser?.birthday && (
            <View style={styles.user_info_other}>
              <AntDesign
                style={[styles.user_info_other_icon, { color: theme.onBackground }]}
                name="calendar"
              />
              <Text style={[styles.user_info_other_content, { color: theme.onBackground }]}>
                {new Date(currentUser.birthday).toLocaleDateString()}
              </Text>
            </View>
          )}

          {currentUser?.userInfo?.userAddress && (
            <View style={styles.user_info_other}>
              <AntDesign
                style={[styles.user_info_other_icon, { color: theme.onBackground }]}
                name="enviromento"
              />
              <Text style={[styles.user_info_other_content, { color: theme.onBackground }]}>
                <Text>{_languageData.live_in[language.code]} </Text>
                <Text style={styles.user_info_address}>
                  {currentUser.userInfo.userAddress}
                </Text>
              </Text>
            </View>
          )}

          {currentUser?.userSocial?.userFacebook && (
            <View style={styles.user_info_other}>
              <MaterialCommunityIcons
                style={[styles.user_info_other_icon, { color: theme.onBackground }]}
                name="facebook"
              />
              <FC.AppText
                key={1}
                style={styles.user_info_other_content}
                hyperLink={currentUser.userSocial.userFacebook}
              >
                {currentUser.userSocial.userFacebook}
              </FC.AppText>
            </View>
          )}

          {currentUser?.userSocial?.userInstagram && (
            <View style={styles.user_info_other}>
              <Entypo
                style={[styles.user_info_other_icon, { color: theme.onBackground }]}
                name="instagram"
              />
              <FC.AppText
                key={2}
                style={styles.user_info_other_content}
                hyperLink={currentUser.userSocial.userInstagram}
              >
                {currentUser.userSocial.userInstagram}
              </FC.AppText>
            </View>
          )}
        </View>
      </View>
      <View style={[styles.line_horizontal, { borderBottomColor: theme.onBackground }]} />
      <TouchableOpacity 
        style={[styles.info_row, { alignSelf: 'flex-start' }]}
        onPress={handleEditProfile}
      >
        <Entypo
          name="dots-three-vertical"
          size={16}
          style={{ marginRight: 10, color: theme.onBackground }}
        />
        <Text style={{ color: theme.onBackground }}>
          {language.code === 'vi' ? 'Chỉnh sửa thông tin cá nhân' : 'Edit your profile information'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const handleEditProfile = () => {
    if (!currentAuthUser) {
      Alert.alert('Error', 'You must be logged in to edit your profile');
      return;
    }
    
    const profileId = String(currentAuthUser._id);
    router.push(`/settings/profile/${profileId}/edit-profile`);
  };

  const handleThreeDotsPress = () => {
    if (isMyProfile) {
      setMenuVisible(true);
    }
  };

  // Add this render function for blog items
  const renderBlogItem = ({ item }: { item: any }) => (
    <View style={Styles.spacings.mb_12}>
      <FC.HorizontalBlogCard 
        data={{
          _id: item._id,
          name: item.name,
          content: item.content,
          coverImage: item.coverImage,
          createdAt: item.createdAt,
          readTime: item.readTime,
          isLiked: item.isLiked,
          totalFavorites: item.totalFavorites,
          author: {
            _id: item.author._id,
            firstName: item.author.firstName,
            lastName: item.author.lastName,
            displayName: item.author.displayName,
            avatar: item.author.avatar
          },
          type: item.type?.value || 'review'
        }}
        type={item.type?.value || 'review'}
      />
    </View>
  );

  // Modify the blog_block section in renderUserInfo
  const renderBlogSection = () => (
    <View style={styles.blog_block}>
      {isMyProfile && (
        <>
          <TouchableOpacity
            style={[styles.btn_create_blog, { backgroundColor: theme.primary }]}
            onPress={() => router.push("/blogs/create")}
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
          <TouchableOpacity 
            style={[styles.btn_manage_blog, { backgroundColor: theme.primary }]}
            onPress={() => router.push("/blogs/manage")}
          >
            <Text style={[styles.btn_manage_blog_name, { color: theme.onPrimary }]}>
              {_languageData.manage_blogs[language.code]}
            </Text>
          </TouchableOpacity>
        </>
      )}

      <View>
        <View style={styles.blog_title_container}>
          <Text style={[styles.blog_title, { color: theme.onBackground }]}>
            {isMyProfile ? _languageData.blog_list[language.code] : `${currentUser?.username}'s blogs`}
          </Text>
        </View>
        
        {status.isFetching ? (
          <View style={styles.loading_container}>
            {[1, 2, 3].map((_, index) => (
              <FC.Skeletons.HorizontalBlogCard key={index} />
            ))}
          </View>
        ) : userBlogs.length > 0 ? (
          <FlatList
            data={userBlogs}
            renderItem={renderBlogItem}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.blog_list}
            onEndReached={() => {
              if (!status.isFetching) {
                blogsDispatchers.fetchBlogs(currentUser._id);
              }
            }}
            onEndReachedThreshold={0.5}
          />
        ) : (
          <View style={styles.empty_blog_container}>
            <Text style={[styles.empty_blog_text, { color: theme.onBackground }]}>
              {isMyProfile 
                ? "You haven't created any blogs yet"
                : `${currentUser?.username} hasn't created any blogs yet`}
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  // Add these styles to your existing styles
  const localStyles = StyleSheet.create({
    blogItem: {
      marginBottom: 16,
      borderRadius: 8,
      overflow: 'hidden',
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    blogCoverImage: {
      width: '100%',
      height: 150,
    },
    blogContent: {
      padding: 12,
    },
    blogTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    blogDescription: {
      fontSize: 14,
      marginBottom: 8,
    },
    blogMeta: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    blogDate: {
      fontSize: 12,
    },
    blogStats: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    blogStatText: {
      fontSize: 12,
      marginLeft: 4,
      marginRight: 12,
    },
    loadingContainer: {
      padding: 16,
    },
    blogList: {
      padding: 16,
    },
    emptyBlogContainer: {
      padding: 16,
      alignItems: 'center',
    },
    emptyBlogText: {
      fontSize: 14,
    },
  });

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
              {currentUser?.avatar ? (
                <Image
                  source={{ uri: currentUser.avatar }}
                  style={{
                    height: 120,
                    width: 120,
                    borderRadius: 60,
                    resizeMode: 'cover'
                  }}
                />
              ) : (
                <View style={[styles.circle_avatar, { backgroundColor: theme.onSecondary }]}>
                  <Text style={[styles.avatar_placeholder, { color: theme.onBackground }]}>
                    {currentUser?.username?.charAt(0).toUpperCase()}
                  </Text>
                </View>
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

          {renderUserInfo()}
          {renderBlogSection()}
        </View>
      </ScrollView>

      <FC.BottomSheetScroll
        haveBtn={false}
        isOpen={isBottomSheetOpen}
        close={handleCloseBottomSheet}
        snapPoints={["1000", "50%"]}
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

      <FC.BottomSheetScroll
        haveBtn={false}
        isOpen={menuVisible}
        close={() => setMenuVisible(false)}
        snapPoints={["25%", "25%"]}
        haveOverlay
        bottomSheetScrollViewStyle={{ paddingHorizontal: 16 }}
        handleLabelBtn={() => {}}
      >
        <View>
          <TouchableOpacity
            style={styles.menu_item}
            onPress={() => {
              setMenuVisible(false);
              handleEditProfile();
            }}
          >
            <Ionicons
              name="pencil"
              size={20}
              style={{ marginRight: 10 }}
              color={theme.onBackground}
            />
            <Text style={{ color: theme.onBackground }}>Edit Profile</Text>
          </TouchableOpacity>
          
          {/* Add other menu items as needed */}
        </View>
      </FC.BottomSheetScroll>
    </>
  );
};

export default ProfileScreen;

