import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AppHeader, CircleButton } from "components";
import HomeScreen from "screens/home/HomeScreen";
import NotificationsScreen from "screens/notifications/NotificationsScreen";
import PlaceDetailScreen from "screens/place_detail/PlaceDetailScreen";
import BlogDetailScreen from "screens/blog_detail/BlogDetailScreen";
import ExploreScreen from "screens/explore/ExploreScreen";
import BlogsScreen from "screens/blogs/BlogsScreen";
import ProfileScreen from "../../screens/profile_screen/ProfileScreen";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentLanguage } from "redux/language/LanguageSlice";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { updateStatusBar } from "redux/manifold/ManifoldSlice";
import OnboardingChatbot from "screens/onaboarding_chatbot/OnboardingChatbot";
import ChatBotScreen from "screens/chat_bot/ChatBotScreen";
import WeatherScreen from "screens/weather/WeatherScreen";

const HomeStack=createNativeStackNavigator()

const HomeNavigator=({ navigation })=>{

  const langCode = useSelector(selectCurrentLanguage).languageCode
  const langData = useSelector(selectCurrentLanguage).data?.appHeader
  const dispatch = useDispatch()

  return (
    <HomeStack.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{ header: AppHeader }}
    >
      <HomeStack.Screen name="Home"
        options={{
          header: props => (
            <AppHeader
              {...props}
              setLeftPart={() => (
                <CircleButton
                  defaultColor="type_5"
                  boxShadowType="type_1"
                  typeOfButton="opacity"
                  onPress={() => {
                    dispatch(updateStatusBar(true))
                    navigation.navigate("ChatBotNavigator", {screen: 'OnboardingChatBot'})
                  }}
                  setIcon={(isActive, currentLabelStyle) => (
                    <FontAwesome5 name="robot" size={16} style={currentLabelStyle} />
                  )}
                />
              )}
            />
          ),
          title: langData.home[langCode]
        }}
        component={HomeScreen}
      />
      
      <HomeStack.Screen 
        name= "Notification"
        options={{headerShown:true,title:`${langCode === 'vi' ? 'Thông Báo' : 'Notification'}`}}
        component={NotificationsScreen}
      />
      
      <HomeStack.Screen 
        options={{ headerShown:true, title:"Profile"}}
        name="Profile" 
        component={ProfileScreen}
      />

      <HomeStack.Screen
        name='PlaceDetailScreen'
        options={{
          title: `${langCode === 'vi' ? 'Chi Tiết Địa Điểm' : 'Place Detail'}`,
          headerTransparent: true
        }}
        component={PlaceDetailScreen}
      />
      <HomeStack.Screen
        name='BlogDetailScreen'
        options={{
          title: `${langCode === 'vi' ? 'Chi Tiết Bài Viết' : 'Blog Detail'}`
        }}
        component={BlogDetailScreen}
      />
      <HomeStack.Screen
        name='WeatherScreen'
        options={{
          title: `${langCode === 'vi' ? ' Dự báo thời tiết' : 'Weather forecast'}`
          
        }}
        component={WeatherScreen}
      />
    </HomeStack.Navigator>
  )
}
export default HomeNavigator