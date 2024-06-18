import { 
	TouchableOpacity, 
	View,
	Animated,
	SafeAreaView
} from 'react-native'
import React, { useRef } from 'react'

import {
	getSocket
} from 'apis/socket'

import {
	useAuth
} from 'customHooks/useAuth'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useNavigation, useRoute } from '@react-navigation/native'
import Ionicons from 'react-native-vector-icons/Ionicons'

import ExploreNavigator from 'navigations/explore_navigator/ExploreNavigator'
import BlogsNavigator from 'navigations/blogs_navigator/BlogsNavigator'
import HomeScreen from 'screens/home/HomeScreen'
// import ExploreScreen from 'screens/explore/ExploreScreen'
// import BlogsScreen from 'screens/blogs/BlogsScreen'
import MapScreen from 'screens/map/MapScreen'
import SettingScreen from 'screens/settings/SettingScreen'
import SettingNavigator from 'navigations/setting_navigator/SettingNavigator'

import styles from './GroupBottomTabStyles'
import { app_dms } from 'globals/styles'
import HomeNavigator from 'navigations/home_navigator/HomeNavigator'

import { useEffect } from 'react'
import { getPrivateKeysAPI } from 'apis/axios'
import { useDispatch, useSelector } from 'react-redux'
import { updatePrivateKeys } from 'redux/manifold/ManifoldSlice'
import { useTheme } from 'customHooks/useTheme'
// Phương: Socket 

import { selectCurrentUser, updateTemporaryUserId } from 'redux/user/UserSlice'
import { updateUserLocation } from 'redux/map/mapSlice'

// Related to Expo
import * as Location from 'expo-location'
import { updateCurrentUser } from '../../redux/user/UserSlice'
import { updateCurrentNotifs, updateNewNotifs } from '../../redux/notifications/NotificationsSlice'
import { signInUserAPI } from '../../apis/axios'
import { selectCurrentWareHouse } from '../../redux/warehouse/WareHouseSlice'
import FunctionsUtility from '../../utilities/functions'
import { EMAIL_RULE } from '../../utilities/validators'
import StringUtility from 'utilities/string'

const tabIcon = {
	'HomeScreen': {
		inactive: 'home-outline',
		active: 'home',
		isHighlight: false,
		size: 25
	},
	'ExploreNavigator': {
		inactive: 'compass-outline',
		active: 'compass',
		isHighlight: false,
		size: 30
	},
	'MapScreen': {
		inactive: 'map-outline',
		active: 'map',
		isHighlight: true,
		size: 25
	},
	'BlogsNavigator': {
		inactive: 'newspaper-outline',
		active: 'newspaper',
		isHighlight: false,
		size: 25
	},
	'SettingScreen': {
		inactive: 'person-circle-outline',
		active: 'person-circle',
		isHighlight: false,
		size: 30
	}, 
}

// Tuan: ScreenWidth sẽ có độ dài là 375, vì t đang làm trên iphone 6.
// Vì dây là những biến nằm ngoài function component scope, cho nên các thông số được thay đổi khi file này được thực thi lại,
// có nghĩa là được load lại.
// Giải thích ở phần comment của https://github.com/FromSunNews/DongNaiTravelApp/issues/17
const iconContainerWidth = 30;
const numberOfIcons = 5;
const dotWidth = 5;
const bottomBarWidth = app_dms.screenWidth - 36;
const tabButtonsContainerWidth = bottomBarWidth - 44;
const tabButtonSpaceWidth = (tabButtonsContainerWidth - (iconContainerWidth * numberOfIcons)) / (numberOfIcons - 1);
const centerDotDistance = (iconContainerWidth / 2) - (dotWidth / 2);
const dotMoveDistance = tabButtonSpaceWidth + centerDotDistance + (iconContainerWidth - centerDotDistance);

const BottomTabBar = ({
	state,
	descriptors,
	navigation,
	tabOffsetValue
}) => {
	Animated.spring(tabOffsetValue, {
		toValue: dotMoveDistance * state.index + centerDotDistance,
		useNativeDriver: true
	}).start()
	//theme
	const { theme } = useTheme();

	return (
		<View style={[styles.tab_bottom_container,{backgroundColor: theme.primary}]}>
			<View style={styles.tab_bottom_buttons_container}>
				{state.routes.map((route, index) => {
					const { options } = descriptors[route.key];

					const isFocused = state.index === index;

					const handlePressTabButton = () => {
						const event = navigation.emit({
							type: 'tabPress',
							target: route.key,
							canPreventDefault: true,
						});

						if (!isFocused && !event.defaultPrevented) {
							// Bảo toàn params trong Screen với prop merge: true
							navigation.navigate({ name: route.name, merge: true });
						}
					};

					return (
						<TouchableOpacity
							accessibilityRole="button"
							accessibilityState={isFocused ? { selected: true } : {}}
							accessibilityLabel={options.tabBarAccessibilityLabel}
							onPress={handlePressTabButton}
							key={route.name}
							style={styles.tab_bottom_button}
						>
							<View style={tabIcon[route.name].isHighlight ? [styles.tab_bottom_hl_icon_conatiner, {backgroundColor: theme.secondary,
    borderColor: theme.background}] : styles.tab_bottom_icon_conatiner}>
								{
									tabIcon[route.name].isHighlight ?
										(<Ionicons
											size={tabIcon[route.name].size}
											name={isFocused ? tabIcon[route.name].active : tabIcon[route.name].inactive}
											style={isFocused ? [styles.tab_bottom_hl_icon_active, { color: theme.onPrimary }] : [styles.tab_bottom_hl_icon_inactive, {color: theme.background}]}
										/>) :
										(<Ionicons
											size={tabIcon[route.name].size}
											name={isFocused ? tabIcon[route.name].active : tabIcon[route.name].inactive}
											style={isFocused ? [styles.tab_bottom_icon_active, { color: theme.onPrimary }] : [styles.tab_bottom_icon_inactive, {color: theme.onSubOutline}]}
									/>)
								}
							</View>
						</TouchableOpacity>
					);
				})}
			</View>
			<Animated.View style={{...styles.tab_bottom_dot_animated_container, backgroundColor: theme.onPrimary, transform: [{ translateX: tabOffsetValue }]}}></Animated.View>
		</View>
	);
}

const Tab = createBottomTabNavigator()
const socketIoInstance = getSocket();

const GroupBottomTab = () => {
	// Phuong: https://reactnavigation.org/docs/bottom-tab-navigator/

	const navigation = useNavigation()
	const dispatch = useDispatch()
	const route = useRoute()
	const user = useSelector(selectCurrentUser)

	// console.log("🚀 ~ file: GroupBottomTab.jsx:148 ~ GroupBottomTab ~ user:", user)
	const {
		rememberedAccount,
		getFullUserInfo
	} = useAuth();

	const tabOffsetValue = useRef(new Animated.Value(centerDotDistance)).current
	const getWidth = () => {
		return (app_dms.screenWidth) / 5
	}

	useEffect(() => {
		getPrivateKeysAPI().then((res) => {
			console.log("🚀 ~ file: GroupBottomTab.jsx:154 ~ getPrivateKeysAPI ~ res:", res)
			dispatch(updatePrivateKeys(res))
		})

		// Kiểm tra xem có nên lấy thông tin user lại không 
		if (route.params?.isGetFullUserInfo) {
			console.log("🚀 ~ file: GroupBottomTab.jsx:182 ~ useEffect ~ route:", route)
			getFullUserInfo(rememberedAccount)
		}
		// Truyền thằng user hiện tại (đã đăng nhập hoặc chưa server để lưu thông tin)
		// kiểm tra thông tin id
		let userId
		if (user?._id)
			userId = user._id
		else {
			userId = StringUtility.getRandomID();
			console.log("🚀 ~ file: GroupBottomTab.jsx:175 ~ useEffect ~ userId:", userId)
			dispatch(updateTemporaryUserId(userId))
		}

		socketIoInstance.emit('c_user_login', userId)
	}, [])

	useEffect(() => {
		// Phương: Xin quyền cảu người dùng để lấy location
		(async () => {
			const { status } = await Location.requestForegroundPermissionsAsync()
			if (status !== 'granted') {
				return
			}
			
			const userLocation = await Location.getCurrentPositionAsync({
				enableHighAccuracy: true,
				accuracy: Location.Accuracy.BestForNavigation
			})

			const location = {
				latitude: userLocation.coords.latitude || 0,
				longitude: userLocation.coords.longitude || 0
			}
			console.log("🚀 ~ file: GroupBottomTab.jsx:197 ~ location:", location)
			// Lưu vào state
			dispatch(updateUserLocation(location))
		})()
	}, [])

	// useEffect này dùng để lắng nghe các sự kiện ở toàn bộ app
	useEffect(() => {
		// Lắng nghe sự kiện từ server (notìication)
		socketIoInstance.on('s_notification_to_user', (data) => {
			// nếu nhận được thì lưu vào state của thằng được follow
			dispatch(updateCurrentUser(data.userReceived))
			dispatch(updateNewNotifs(data.notif))
		})

		return () => socketIoInstance.removeListener('s_notification_to_user', (data) => {
			// nếu nhận được thì lưu vào state của thằng được follow
			dispatch(updateCurrentUser(data.userReceived))
			dispatch(updateNewNotifs(data.notif))
		})
	}, [])

	return (
		<View style={styles.container}>
			<Tab.Navigator
				tabBar={props => (<BottomTabBar {...props} tabOffsetValue={tabOffsetValue} />)}
				screenOptions={{
					'tabBarShowLabel': false,
					tabBarHideOnKeyboard: true
				}}
			>
					<Tab.Screen
						name={'HomeScreen'}
						component={HomeNavigator}
						options={{
							headerShown: false,
							tabBarHideOnKeyboard: true
						}}>
					</Tab.Screen>

					<Tab.Screen
						name={'ExploreNavigator'}
						component={ExploreNavigator}
						options={{
							headerShown: false,
							tabBarHideOnKeyboard: true
						}}>
					</Tab.Screen>

					<Tab.Screen
						name={'MapScreen'}
						component={MapScreen}
						options={{
							headerShown: false,
							tabBarHideOnKeyboard: true
						}}>
					</Tab.Screen>

					<Tab.Screen
						name={'BlogsNavigator'}
						component={BlogsNavigator}
						options={{
							headerShown: false,
							tabBarHideOnKeyboard: true
						}}>
				</Tab.Screen>

					<Tab.Screen
						name={'SettingScreen'}
						component={SettingNavigator}
						options={{
							headerShown: false,
							tabBarHideOnKeyboard: true
						}}>
					</Tab.Screen>
			</Tab.Navigator>
		</View>
	)
}

export default GroupBottomTab