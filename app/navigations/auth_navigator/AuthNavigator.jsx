// Phuong: screen này có trách nhiệm: điều hướng, xác thực, phân group màn hình
import { View, Text, Platform } from 'react-native'
import React, { useState } from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import {
  useAuthState
} from 'customHooks/useAuth'

import { useSelector } from 'react-redux'
import { selectCurrentWareHouse } from 'redux/warehouse/WareHouseSlice'
import { selectIsAuthenticated, selectUserRole } from 'redux/user/UserSlice'

import {
  USER_ROLES
} from 'utilities/constants'

import GroupBottomTab from 'navigations/group_bottom_tab/GroupBottomTab'
import BlogEditorNavigator from 'navigations/blog_editor_navigator/BlogEditorNavigator'
import GlobalNavigator from 'navigations/global_navigator/GlobalNavigator'
import SplashScreen from 'screens/splash/SplashScreen'
import OnboardingScreen from 'screens/onboarding/OnboardingScreen'
import SigninScreen from 'screens/signin/SigninScreen'
import SignupScreen from 'screens/signup/SignupScreen'
import CreatePost from 'screens/create_post/CreatePostScreen'
import ForgotPasswordScreen from 'screens/fogot_password/ForgotPasswordScreen'
import OtpScreen from 'screens/otp/OtpScreen'
import ResetPasswordScreen from 'screens/reset_password/ResetPasswordScreen'
import ProfileScreen from 'screens/profile_screen/ProfileScreen'
import BlogEditorScreen from 'screens/blog_editor/BlogEditorScreen'
import UnAuthenticationScreen from 'screens/unauthentication/UnAuthenticationScreen'
import {
  AppHeader,
  AppText
} from 'components'
import ChatBotNavigator from 'navigations/chatbot_navigator/ChatBotNavigator'
import OnboardingChatbot from 'screens/onaboarding_chatbot/OnboardingChatbot'
import MapScreen from 'screens/map/MapScreen'
import TestNavigator from 'navigations/test_navigator/TestNavigator'
import { withTheme } from 'hocs/withTheme'

/**
 * AuthNavigator sẽ chịu trách nhiệm cho việc xác thực người dùng thông qua `SplashScreen`.
 * Trong SpashScreen nó sẽ lấy một số thông số như là `isAuthenticated` và `isFirstTimeLaunch`,
 * để check xem người dùng có xác thực hay chưa? Nếu có rồi thì nó sẽ sign in người dùng lại.
 * Ngoài ra thì nó check xem là người dùng thiết bị này có phải là lần đầu sử dụng app hay không.
 */

// Phuong: https://reactnavigation.org/docs/getting-started
const AppStack = createNativeStackNavigator()

/**
 * Đây là root navigator của app.
 * @param {any} props 
 * @returns 
 */
const AuthNavigator = withTheme( ({navigation, theme}) => {
  const {
    isFirstTimeLaunch,
    isAuthenticated,
    userRole
  } = useAuthState()

  const initialRouteName = 'SplashScreen'

  return (
    <AppStack.Navigator initialRouteName={initialRouteName}>
      {/* Splash thì lúc nào cũng hiển thị cho người dùng */}
      <AppStack.Screen 
        name="SplashScreen" 
        component={SplashScreen} 
        options={{ headerShown: false }}
      />
      <AppStack.Screen
        name="TestNavigator"
        component={TestNavigator}
        options={{ headerShown: false }}
      />

      {/*
        Phuong: Kiểm tra xem đây có phải là lần đầu tiên người dùng chạy ứng dụng không?
        Phuong: Sẽ thay đổi state của thằng isFirstTimeLaunch = false khi người dùng bắt đầu vào trang SignIn
      */}
      {
        isFirstTimeLaunch &&
        <AppStack.Screen 
          name="OnboardingScreen" 
          component={OnboardingScreen}
          options={{ headerShown: false }} 
        />
      }
      
      {/* Phuong: user hay guest đều cho hiển thị */}
      <AppStack.Screen 
        name="GroupBottomTab" 
        component={GroupBottomTab} 
        options={{ headerShown: false }} 
      />

      {/* Phuong: Đối với signin va signup thì nếu mà người dùng đăng nhập r muốn logout ra thì vẫn phải hiện ra thôi*/}
       <AppStack.Screen 
        name="SigninScreen"
        component={SigninScreen} 
        options={{ headerShown: false }} 
      />
      <AppStack.Screen 
        name="SignupScreen" 
        component={SignupScreen} 
        options={{ headerShown: false }} 
      />
      <AppStack.Screen 
        name="ForgotPasswordScreen" 
        component={ForgotPasswordScreen} 
        options={{ headerShown: false }} 
      />
      <AppStack.Screen 
        name="OtpScreen" 
        component={OtpScreen} 
        options={{ headerShown: false }} 
      />
      <AppStack.Screen 
        name="ResetPasswordScreen" 
        component={ResetPasswordScreen} 
        options={{ headerShown: false }} 
      />
      <AppStack.Screen 
        name="BlogEditorNavigator" 
        component={BlogEditorNavigator} 
        options={{ headerShown: false, presentation: 'containedModal' }} 
      />
      <AppStack.Screen 
        name="GlobalNavigator" 
        component={GlobalNavigator} 
        options={{ headerShown: false }} 
      />

      <AppStack.Screen 
        name="ChatBotNavigator" 
        component={ChatBotNavigator} 
        options={{ headerShown: false}} 
      />

    <AppStack.Screen 
        name="MapFullScreen" 
        component={MapScreen} 
        options={{ headerShown: Platform.OS === 'ios' ? true : false, title: 'Bản đồ', headerBackTitleVisible: false}} 
      />
    </AppStack.Navigator>
  )
})

export default AuthNavigator