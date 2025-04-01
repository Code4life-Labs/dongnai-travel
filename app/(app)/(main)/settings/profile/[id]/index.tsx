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
  FlatList,
  Modal
} from "react-native";

// Import icon
import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

// Import hook
import { useDispatch, useSelector } from "react-redux";
import { router, useLocalSearchParams } from 'expo-router';

// Import component
import { FC } from "@/components";


// Import hook
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";
import { useBlogs } from "@/hooks/useBlog";

import styles from "@/screens/profile/styles";
import { Styles } from "@/styles";

import { theme as appTheme } from "@/styles/theme";



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
  // 1. Hooks and Context
  const { user: currentAuthUser } = useAuth();
  const { theme } = useTheme();
  const { language } = useLanguage();
  const { blogs, status, blogsDispatchers } = useBlogs();
  const dispatch = useDispatch();
  const { id } = useLocalSearchParams();
  const _languageData = language.data.blogScreenSetting;

  // 2. State Management
  const [currentUser, setCurrentUser] = useState<any>(currentAuthUser);
  const [isMyProfile, setIsMyProfile] = useState<boolean>(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploadImageType, setUploadImageType] = useState<'UploadCoverPhoto' | 'UploadAvatar' | null>(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState<boolean>(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [userBlogs, setUserBlogs] = useState<any[]>([]);
  const [sortType, setSortType] = useState<'newest' | 'oldest'>('newest');
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [showImageViewer, setShowImageViewer] = useState<boolean>(false);
  const [selectedViewImage, setSelectedViewImage] = useState<string | null>(null);

  // 3. Effects
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
    }
  }, [currentAuthUser, route?.params?.id]);

  useEffect(() => {
    if (currentUser?._id) {
      console.log('Fetching blogs for user:', currentUser._id);
      blogsDispatchers.fetchBlogs(currentUser._id);
    }
  }, [currentUser?._id]);

  useEffect(() => {
    if (blogs) {
      setUserBlogs(blogs);
    }
  }, [blogs]);

  // 4. Helper Functions
  const sortBlogs = (blogs: any[]) => {
    return [...blogs].sort((a, b) => {
      if (sortType === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
    });
  };

  const handleEditProfile = () => {
    if (!currentAuthUser) {
      Alert.alert('Error', 'You must be logged in to edit your profile');
      return;
    }
    
    const profileId = String(currentAuthUser._id);
    router.push(`/settings/profile/${profileId}/edit-profile`);
  };

  const handleOpenBottomSheet = () => {
    setIsBottomSheetOpen(true);
  };

  const handleViewImage = (imageUrl: string) => {
    setSelectedViewImage(imageUrl);
    setShowImageViewer(true);
  };

  const handleCloseImageViewer = () => {
    setShowImageViewer(false);
    setSelectedViewImage(null);
  };

  // 5. Render Functions
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
          
          {(currentUser?.displayName) && (
            <View style={styles.user_info_other}>
              <AntDesign
                style={[styles.user_info_other_icon, { color: theme.onBackground }]}
                name="user"
              />
              <Text style={[styles.user_info_other_content, { color: theme.onBackground }]}>
                {[currentUser?.displayName].filter(Boolean).join(' ')}
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

  const renderBlogSection = () => (
    <View style={styles.blog_block}>
      {isMyProfile && (
        <>
          <TouchableOpacity
            style={[styles.btn_create_blog, { backgroundColor: theme.primary }]}
            onPress={() => router.push("/(app)/(main)/blogs/create")}
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
            onPress={() => router.push("/(app)/(main)/blogs/manage")}
          >
            <Text style={[styles.btn_manage_blog_name, { color: theme.onPrimary }]}>
              {_languageData.manage_blogs[language.code]}
            </Text>
          </TouchableOpacity>
        </>
      )}

      <View>
        <View style={styles.blog_title_container}>
          <View style={styles.blog_header}>
            <Text style={[styles.blog_title, { color: theme.onBackground }]}>
              {isMyProfile ? _languageData.blog_list[language.code] : `${currentUser?.username}'s blogs`}
            </Text>
            
            <TouchableOpacity 
              onPress={() => setShowSortOptions(true)}
              style={styles.sortButton}
            >
              <Ionicons 
                name="filter" 
                size={20} 
                color={theme.onBackground} 
              />
            </TouchableOpacity>
          </View>
        </View>
        
        {status.isFetching ? (
          <View style={styles.loading_container}>
            {[1, 2, 3].map((_, index) => (
              <FC.Skeletons.HorizontalBlogCard key={index} />
            ))}
          </View>
        ) : userBlogs.length > 0 ? (
          <FlatList
            data={sortBlogs(userBlogs)}
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

  // 6. Main Render
  return (
    <>
      <FlatList
        style={[styles.wrapper, { backgroundColor: theme.background }]}
        contentContainerStyle={styles.container}
        data={[1]}
        renderItem={() => (
          <>
            <View style={{ width: Styles.dimension.screenWidth }}>
              <View>
                {/* Cover photo section */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => currentUser?.coverPhoto && handleViewImage(currentUser.coverPhoto)}
                >
                  {currentUser?.coverPhoto ? (
                    <Image source={{ uri: currentUser.coverPhoto }} style={styles.imageCover} />
                  ) : (
                    <View style={[styles.imageCover, { backgroundColor: theme.onSecondary }]} />
                  )}
                </TouchableOpacity>
                
                {/* Avatar section */}
                <View style={styles.circle_avatar}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => currentUser?.avatar && handleViewImage(currentUser.avatar)}
                  >
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
                  </TouchableOpacity>
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
            </View>

            {renderUserInfo()}
            {renderBlogSection()}
          </>
        )}
        keyExtractor={() => 'profile'}
      />

      <FC.BottomSheetScroll
        haveBtn={false}
        isOpen={showSortOptions}
        close={() => setShowSortOptions(false)}
        snapPoints={["50%"]}
        haveOverlay
        bottomSheetScrollViewStyle={{ paddingHorizontal: 16 }}
        handleLabelBtn={() => {}}
      >
        <View>
          <TouchableOpacity
            style={[styles.sortOption, sortType === 'newest' && styles.selectedSort]}
            onPress={() => {
              setSortType('newest');
              setShowSortOptions(false);
            }}
          >
            <Text style={{ color: theme.onBackground }}>Mới nhất</Text>
            {sortType === 'newest' && (
              <Ionicons name="checkmark" size={20} color={theme.primary} />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.sortOption, sortType === 'oldest' && styles.selectedSort]}
            onPress={() => {
              setSortType('oldest');
              setShowSortOptions(false);
            }}
          >
            <Text style={{ color: theme.onBackground }}>Cũ nhất</Text>
            {sortType === 'oldest' && (
              <Ionicons name="checkmark" size={20} color={theme.primary} />
            )}
          </TouchableOpacity>
        </View>
      </FC.BottomSheetScroll>

      {/* Add Modal Image Viewer */}
      <Modal
        visible={showImageViewer}
        transparent={true}
        onRequestClose={handleCloseImageViewer}
      >
        <TouchableOpacity 
          style={styles.modalContainer}
          activeOpacity={1}
          onPress={handleCloseImageViewer}
        >
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={handleCloseImageViewer}
          >
            <AntDesign name="close" size={24} color="#fff" />
          </TouchableOpacity>
          
          {selectedViewImage && (
            <TouchableOpacity 
              activeOpacity={1}
              onPress={(e) => {
                e.stopPropagation();
              }}
            >
              <Image
                source={{ uri: selectedViewImage }}
                style={styles.fullScreenImage}
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default ProfileScreen;

