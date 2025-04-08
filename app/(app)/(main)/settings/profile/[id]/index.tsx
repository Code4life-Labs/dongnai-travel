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
  Modal,
  ActivityIndicator
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
import { UserManager } from "@/objects/user";

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

// Định nghĩa interface cho kiểu dữ liệu Follow
interface Follow {
  _id: string;
  target: {
    _id: string;
    [key: string]: any;
  };
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ route, navigation }) => {
  // 1. Hooks and Context
  const { user: currentAuthUser, token } = useAuth();
  const { theme } = useTheme();
  const { language } = useLanguage();
  const { blogs, status, blogsDispatchers } = useBlogs();
  const dispatch = useDispatch();
  const { id } = useLocalSearchParams();
  const _languageData = language.data.blogScreenSetting;

  // 2. State Management
  const [profileUser, setProfileUser] = useState<any>(null);
  const [isMyProfile, setIsMyProfile] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploadImageType, setUploadImageType] = useState<'UploadCoverPhoto' | 'UploadAvatar' | null>(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState<boolean>(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [userBlogs, setUserBlogs] = useState<any[]>([]);
  const [sortType, setSortType] = useState<'newest' | 'oldest'>('newest');
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [showImageViewer, setShowImageViewer] = useState<boolean>(false);
  const [selectedViewImage, setSelectedViewImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [followLoading, setFollowLoading] = useState<boolean>(false);

  // 3. Effects
  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true);
      try {
        // Check if viewing own profile or someone else's
        const profileId = id as string;
        const isOwner = currentAuthUser?._id === profileId;
        setIsMyProfile(isOwner);
        
        if (isOwner) {
          // Viewing own profile
          setProfileUser(currentAuthUser);
          console.log('Viewing own profile:', currentAuthUser?.username);
        } else {
          // Viewing someone else's profile - fetch their data
          console.log('Fetching profile for user ID:', profileId);
          try {
            // Fetch the user data for the profile being viewed
            const users = await UserManager.Api.getUsersAsync({
              limit: 1,
              skip: 0,
              // Add any additional filters if needed
            });
            
            // Find the user with matching ID
            const targetUser = users?.find(user => user._id === profileId);
            
            if (targetUser) {
              setProfileUser(targetUser);
              console.log('Fetched profile data for:', targetUser.username);
            } else {
              console.error('User not found with ID:', profileId);
              // Handle user not found case
              Alert.alert('Error', 'User profile not found');
            }
          } catch (error) {
            console.error('Error fetching user profile:', error);
            Alert.alert('Error', 'Failed to load user profile');
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (currentAuthUser) {
      fetchProfileData();
    }
  }, [currentAuthUser, id]);

  useEffect(() => {
    if (profileUser?._id) {
      console.log('Fetching blogs for user:', profileUser._id);
      blogsDispatchers.fetchBlogs(profileUser._id);
    }
  }, [profileUser?._id]);

  useEffect(() => {
    if (blogs) {
      // Make sure we're only showing blogs from this specific user
      const filteredBlogs = blogs.filter(blog => blog.author?._id === profileUser?._id);
      setUserBlogs(filteredBlogs);
    }
  }, [blogs, profileUser?._id]);

  useEffect(() => {
    const checkFollowStatus = async () => {
      if (!currentAuthUser || !profileUser || isMyProfile) return;
      
      try {
        // Lấy danh sách người dùng đang follow
        const follows = await UserManager.Api.getFollowsAsync(currentAuthUser._id);
        
        // Kiểm tra xem profileUser có trong danh sách follows không
        // Xử lý cả trường hợp follows là mảng trực tiếp hoặc nằm trong response.data
        const followsArray = Array.isArray(follows) ? follows : (follows?.data || []);
        
        const isFollowed = followsArray.some((follow: Follow) => {
          // Kiểm tra cấu trúc của mỗi follow object
          if (!follow || !follow.target) return false;
          
          // So sánh ID
          return follow.target._id === profileUser._id;
        });
        
        setIsFollowing(isFollowed);
      } catch (error) {
        console.error('Error checking follow status:', error);
      }
    };
    
    if (profileUser && currentAuthUser) {
      console.log("Profile user:", profileUser._id);
      console.log("Current user:", currentAuthUser._id);
      console.log("Is my profile:", isMyProfile);
      checkFollowStatus();
    }
  }, [profileUser, currentAuthUser, isMyProfile]);

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

  // Add this function at the component level (outside any useEffect)
  const handleFollowToggle = async () => {
    if (!currentAuthUser || !profileUser) {
      console.error("Missing user data:", { currentAuthUser, profileUser });
      return;
    }
    
    // Kiểm tra không follow chính mình
    if (currentAuthUser._id === profileUser._id) {
      Alert.alert('Error', 'You cannot follow yourself');
      return;
    }

    setFollowLoading(true);
    try {
      console.log("Current user ID:", currentAuthUser._id);
      console.log("Target user ID:", profileUser._id);
      console.log("Current follow status:", isFollowing);
      
      if (isFollowing) {
        console.log("Attempting to unfollow user");
        const result = await UserManager.Api.unfollowUserAsync(profileUser._id);
        console.log("Unfollow result:", result);
        setIsFollowing(false);
      } else {
        console.log("Attempting to follow user");
        const result = await UserManager.Api.followUserAsync(profileUser._id);
        console.log("Follow result:", result);
        setIsFollowing(true);
      }
    } catch (error: any) {
      console.error('Error toggling follow status:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      // Hiển thị thông tin lỗi chi tiết hơn
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
      Alert.alert('Error', `Failed to update follow status: ${errorMessage}`);
    } finally {
      setFollowLoading(false);
    }
  };

  // 5. Render Functions
  const renderUserInfo = () => (
    <View style={styles.user_block}>
      <View style={styles.header_container}>
        
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={[styles.user_name, { color: theme.onBackground }]}>
            {profileUser?.displayName || profileUser?.username}
          </Text>
          <Text style={[styles.user_username, { color: theme.onBackground }]}>
            @{profileUser?.username}
          </Text>
          
          {!isMyProfile && currentAuthUser && (
            <TouchableOpacity
              style={[
                styles.follow_button,
                { 
                  backgroundColor: isFollowing ? theme.background : theme.primary,
                  borderColor: theme.primary,
                  borderWidth: isFollowing ? 1 : 0,
                  marginTop: 10
                }
              ]}
              onPress={() => {
                console.log("Follow feature clicked - feature in development");
                Alert.alert(
                  'Feature in Development',
                  'The follow feature is currently under development and will be available soon.',
                  [{ text: 'OK', onPress: () => console.log('Follow alert closed') }]
                );
              }}
              disabled={followLoading}
            >
              <Text style={{ 
                color: isFollowing ? theme.primary : theme.onPrimary,
                fontWeight: '500'
              }}>
                {isFollowing ? 'Following' : 'Follow'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      
        
      <View style={styles.user_info_follow}>
        <Text style={[styles.user_follower, { color: theme.onBackground }]}>
          {profileUser?.followerIds?.length || 0} {_languageData.user_follower[language.code]}
        </Text>
        <Text>
          <Entypo name="dot-single" size={20} color={theme.onBackground} />
        </Text>
        <Text style={[styles.user_following, { color: theme.onBackground }]}>
          {profileUser?.followingIds?.length || 0} {_languageData.user_following[language.code]}
        </Text>
      </View>

      <View style={styles.user_infos}>
        <View style={styles.user_info_block}>
          <Text style={[styles.user_info_title, { color: theme.onBackground }]}>
            {_languageData.information[language.code]}
          </Text>
          
          {(profileUser?.displayName) && (
            <View style={styles.user_info_other}>
              <AntDesign
                style={[styles.user_info_other_icon, { color: theme.onBackground }]}
                name="user"
              />
              <Text style={[styles.user_info_other_content, { color: theme.onBackground }]}>
                {[profileUser?.displayName].filter(Boolean).join(' ')}
              </Text>
            </View>
          )}

          <View style={styles.user_info_other}>
            <AntDesign
              style={[styles.user_info_other_icon, { color: theme.onBackground }]}
              name="mail"
            />
            <Text style={[styles.user_info_other_content, { color: theme.onBackground }]}>
              {profileUser?.email}
            </Text>
          </View>

          {profileUser?.birthday && (
            <View style={styles.user_info_other}>
              <AntDesign
                style={[styles.user_info_other_icon, { color: theme.onBackground }]}
                name="calendar"
              />
              <Text style={[styles.user_info_other_content, { color: theme.onBackground }]}>
                {new Date(profileUser.birthday).toLocaleDateString()}
              </Text>
            </View>
          )}

          {profileUser?.userInfo?.userAddress && (
            <View style={styles.user_info_other}>
              <AntDesign
                style={[styles.user_info_other_icon, { color: theme.onBackground }]}
                name="enviromento"
              />
              <Text style={[styles.user_info_other_content, { color: theme.onBackground }]}>
                <Text>{_languageData.live_in[language.code]} </Text>
                <Text style={styles.user_info_address}>
                  {profileUser.userInfo.userAddress}
                </Text>
              </Text>
            </View>
          )}

          {profileUser?.userSocial?.userFacebook && (
            <View style={styles.user_info_other}>
              <MaterialCommunityIcons
                style={[styles.user_info_other_icon, { color: theme.onBackground }]}
                name="facebook"
              />
              <FC.AppText
                key={1}
                style={styles.user_info_other_content}
                hyperLink={profileUser.userSocial.userFacebook}
              >
                {profileUser.userSocial.userFacebook}
              </FC.AppText>
            </View>
          )}

          {profileUser?.userSocial?.userInstagram && (
            <View style={styles.user_info_other}>
              <Entypo
                style={[styles.user_info_other_icon, { color: theme.onBackground }]}
                name="instagram"
              />
              <FC.AppText
                key={2}
                style={styles.user_info_other_content}
                hyperLink={profileUser.userSocial.userInstagram}
              >
                {profileUser.userSocial.userInstagram}
              </FC.AppText>
            </View>
          )}
        </View>
      </View>
      <View style={[styles.line_horizontal, { borderBottomColor: theme.onBackground }]} />
      {isMyProfile && (
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
      )}
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
          {/* <TouchableOpacity 
            style={[styles.btn_manage_blog, { backgroundColor: theme.primary }]}
            onPress={() => router.push("/(app)/(main)/blogs/manage")}
          >
            <Text style={[styles.btn_manage_blog_name, { color: theme.onPrimary }]}>
              {_languageData.manage_blogs[language.code]}
            </Text>
          </TouchableOpacity> */}
        </>
      )}

      <View>
        <View style={styles.blog_title_container}>
          <View style={styles.blog_header}>
            <Text style={[styles.blog_title, { color: theme.onBackground }]}>
              {isMyProfile 
                ? _languageData.blog_list[language.code] 
                : `${profileUser?.username || ''}'s blogs`}
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
        
        {status.isFetching || isLoading ? (
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
              if (!status.isFetching && profileUser?._id) {
                blogsDispatchers.fetchBlogs(profileUser._id);
              }
            }}
            onEndReachedThreshold={0.5}
          />
        ) : (
          <View style={styles.empty_blog_container}>
            <Text style={[styles.empty_blog_text, { color: theme.onBackground }]}>
              {isMyProfile 
                ? "You haven't created any blogs yet"
                : `${profileUser?.username || 'This user'} hasn't created any blogs yet`}
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  // 6. Main Render
  if (isLoading) {
    return (
      <View style={[styles.loading_container, { backgroundColor: theme.background }]}>
        <FC.Skeletons.HorizontalBlogCard />
      </View>
    );
  }

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
                  onPress={() => profileUser?.coverPhoto && handleViewImage(profileUser.coverPhoto)}
                >
                  {profileUser?.coverPhoto ? (
                    <Image source={{ uri: profileUser.coverPhoto }} style={styles.imageCover} />
                  ) : (
                    <View style={[styles.imageCover, { backgroundColor: theme.onSecondary }]} />
                  )}
                </TouchableOpacity>
                
                {/* Avatar section */}
                <View style={styles.circle_avatar}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => profileUser?.avatar && handleViewImage(profileUser.avatar)}
                  >
                    {profileUser?.avatar ? (
                      <Image
                        source={{ uri: profileUser.avatar }}
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
                          {profileUser?.username?.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
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

