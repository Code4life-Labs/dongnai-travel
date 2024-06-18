import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, ScrollView, Image, SafeAreaViewBase, Platform } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import styles from './ChatBotScreenStyles'
import { useSelector } from 'react-redux'
import { selectCurrentLanguage } from '../../redux/language/LanguageSlice'
import { getTextChatBotAPI } from 'apis/axios'
import { selectCurrentUser } from 'redux/user/UserSlice'
import { selectTemporaryUserId } from 'redux/user/UserSlice'
import { app_c, app_dms, app_shdw, app_sp, app_typo } from 'globals/styles';
import { selectCurrentMap } from 'redux/map/mapSlice'

import { AppText, VerticalPlaceCard, VerticalPlaceCardSkeleton } from 'components';

import { GiftedChat, Bubble, InputToolbar, Actions, Composer, Send, F } from 'react-native-gifted-chat'

import { getPlacesAPI } from 'apis/axios';
import { weatherIcons } from 'utilities/mapdata';
import WeatherChart from 'libs/react-native-weather-chart';
import { Ionicons, Entypo, Fontisto, FontAwesome5, FontAwesome, MaterialIcons, MaterialCommunityIcons} from "react-native-vector-icons"
import moment from 'moment/moment'

import { BRIEF_PLACE_DATA_FIELDS } from 'utilities/constants';
import MessageFeature from 'components/message_feature/MessageFeature'
import { KeyboardAvoidingView } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { withTheme } from 'hocs/withTheme'


const botAvatar = require('../../assets/images/avatar_chatbot.jpg')

const ChatBotScreen = withTheme(({theme}) => {

  const currentUserId = useSelector(selectCurrentUser)._id
  const temporaryUserId = useSelector(selectTemporaryUserId)
  const userLocation = useSelector(selectCurrentMap).userLocation 
  //language
  const langCode = useSelector(selectCurrentLanguage).languageCode
  console.log("🚀 ~ file: ChatBotScreen.jsx:20 ~ ChatBotScreen ~ langCode:", langCode)
  const langData = useSelector(selectCurrentLanguage).data?.settingAbout
  //theme
  
  const [messages, setMessages] = useState([])
  
  useEffect(() => {
    getTextChatBotAPI({
      question: 'Hi',
      currentUserId: currentUserId ?? temporaryUserId,
      languageCode: langCode,
      coor: userLocation ?? {}
    }).then(data => {
      handleDialogflowResponse(data)
    })
  }, [])
  
  const handleDialogflowResponse = (data) => {
    // data?.response, data.action, data.weatherData
    let msg
    const action = data.action
    msg = {
      _id: messages.length + 1,
      text: data.response,
      createdAt: new Date(),
      user: {
        _id: 2,
        name: 'TravelBot',
        avatar: botAvatar
      },
      action: action,
      data: data.data ?? null 
    }
    // if (action === 'input.welcome') {
    // } else if (action === 'input.suggest-place' || action === 'input.get-weather') {
    //   msg = {
    //     _id: messages.length + 1,
    //     text: data.response,
    //     createdAt: new Date(),
    //     user: {
    //       _id: 2,
    //       name: 'TravelBot',
    //       avatar: botAvatar
    //     },
    //     quickReplies: {
    //       type: 'radio', // or 'checkbox',
    //       keepIt: true,
    //       action: action,
    //       data: data.data
    //     }
    //   }
    // } else {
    //   msg = {
    //     _id: messages.length + 1,
    //     text: data.response,
    //     createdAt: new Date(),
    //     user: {
    //       _id: 2,
    //       name: 'TravelBot',
    //       avatar: botAvatar
    //     }
    //   }
    // }
    
    setMessages(previousMessages => GiftedChat.append(previousMessages, msg))
  }

  const handLeSendMessages = (messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages))

    let message = messages[0].text

    getTextChatBotAPI({
      question: message,
      currentUserId: currentUserId ?? temporaryUserId,
      languageCode: langCode,
      coor: userLocation ?? null
    }).then(data => {
      // console.log("🚀 ~ file: ChatBotScreen.jsx:123 ~ handLeSendMessages ~ data:", data)
      handleDialogflowResponse(data)
    })
  }
  
  const handleQuicklyReply = (quickReply = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, quickReply))

    let message = quickReply[0].value

    getTextChatBotAPI({
      question: message,
      currentUserId: currentUserId ?? temporaryUserId,
      languageCode: langCode,
      coor: userLocation ?? null
    }).then(data => {
      console.log("🚀 ~ file: ChatBotScreen.jsx:138 ~ handleQuicklyReply ~ data:", data)
      handleDialogflowResponse(data)
    })
  }

  const renderBubble = (props) => {
    return (
      <View style={{
        display: 'flex',
        flexDirection: 'column',
        width: '90%',
      }}>
        <Bubble
          {...props}
          // màu text
          textStyle={{
            right: {color: app_c.HEX.primary},
            left: {color: app_c.HEX.fourth}
          }}
          // màu bubble
          wrapperStyle={{
            right: {backgroundColor: app_c.HEX.third},
            left: {backgroundColor: app_c.HEX.ext_primary},
          }}
        />
        <MessageFeature action={props.currentMessage.action} data={props.currentMessage.data}/>
      </View>
    )
  }

  const renderInputToolbar = (props) => {
    return <InputToolbar {...props} containerStyle={{marginLeft: 15,
      marginRight: 15,
      marginBottom: 10,
      borderWidth: 0.5,
      borderColor: 'grey',
      borderRadius: 25,
      backgroundColor: 'red'
    }} />
  }

  const renderActions = (props) => (
    <Actions
      {...props}
      containerStyle={{
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 4,
        marginRight: 4,
        marginBottom: 0,
      }}
      icon={() => (
        <Image
          style={{ width: 32, height: 32 }}
          source={{
            uri: 'https://placeimg.com/32/32/any',
          }}
        />
      )}
      options={{
        'Choose From Library': () => {
          console.log('Choose From Library');
        },
        Cancel: () => {
          console.log('Cancel');
        },
      }}
      optionTintColor="#222B45"
    />
  )

  const renderComposer = (props) => (
    <Composer
      {...props}
      textInputStyle={{
        color: app_c.HEX.fourth,
        backgroundColor: app_c.HEX.primary,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: app_c.HEX.ext_primary,
        paddingTop: Platform.OS === 'ios' ? 11.5 : 0,
        paddingHorizontal: 12,
        marginLeft: 18,
        marginRight: 8,
        minHeight: 40,
        marginBottom: Platform.OS === 'ios' ? 30 :10 ,
        marginTop: Platform.OS === 'ios' ? 0 : 5 ,
      }}
    />
  )

  const renderSend = (props) => (
    <Send
      {...props}
      disabled={!props.text}
      containerStyle={{
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
        marginBottom: Platform.OS === 'ios' ? 30 :10 ,
        marginTop: Platform.OS === 'ios' ? 0 : 5 ,
      }}
    >
      <FontAwesome
        name="send"
        size={25}
        color={app_c.HEX.third}
      />
    </Send>
  )
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }} edges={['left', 'right']}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? "padding" : undefined}
        style={styles.container} 
        keyboardVerticalOffset={70}
      >
        {/* https://www.npmjs.com/package/react-native-gifted-chat */}
        <GiftedChat 
          alignTop
          isKeyboardInternallyHandled={false}
          // isTyping={true}
          wrapInSafeArea
          // multiline={true}
          // renderUsernameOnMessage
          alwaysShowSend
          bottomOffset={40}
          minInputToolbarHeight={Platform.OS === 'ios' ? 80 : 100}
          placeholder={'Nhập tin nhắn...'}
          messages={messages}
          onSend={(value) => handLeSendMessages(value)}
          onQuickReply={(quickReply) => handleQuicklyReply(quickReply)}
          renderBubble={renderBubble}
          keyboardShouldPersistTaps={"never"}
          // renderInputToolbar={renderInputToolbar}
          user={{_id: 1}}
          scrollToBottom
          scrollToBottomComponent={() => (
            <Ionicons
              name="arrow-down"
              size={25}
              color={app_c.HEX.ext_second}
            />
          )}
          shouldUpdateMessage={(props, nextProps) =>
            props.extraData !== nextProps.extraData
        }
          // renderInputToolbar={renderInputToolbar}
          // renderActions={renderActions}
          renderComposer={renderComposer}
          renderSend={renderSend}
          listViewProps={{
            maintainVisibleContentPosition: {
                minIndexForVisible: 0,
                autoscrollToTopThreshold: 60,
            }
        }}
          // renderFooter={renderFooter}
          // renderAvatar={renderAvatar}
          // renderSystemMessage={renderSystemMessage}
          // renderMessage={renderMessage}
          // renderMessageText={renderMessageText}
          // renderCustomView={renderCustomView}
          // isCustomViewBottom
          // messagesContainerStyle={{ backgroundColor: 'indigo' }}
          // parsePatterns={(linkStyle) => [
          //   {
          //     pattern: /#(\w+)/,
          //     style: linkStyle,
          //     onPress: (tag) => console.log(`Pressed on hashtag: ${tag}`),
          //   },
          // ]}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
})

export default ChatBotScreen