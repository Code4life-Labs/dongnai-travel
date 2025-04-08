import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
  StatusBar,
  Animated,
  Dimensions,
  Keyboard,
  Easing,
  ScrollView,
  ImageBackground
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, Feather, FontAwesome } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';

// Import từ objects
import { ChatbotManager } from '@/objects/chatbot';
import { ChatbotMessage, ChatbotResponse } from '@/objects/chatbot/type';
import { getMockWelcomeMessage, processMessageWithKeywords } from '@/objects/chatbot/mock';

// Import từ hooks
import { useAuth } from '@/hooks/useAuth';
import { useMap } from '@/hooks/useMap';
import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';
import { useSafeAreaConfig } from '@/hooks/useSafeArea';

// Import từ components
import MessageFeature from '@/components/message_feature/message-feature';

// Bot avatar và background image
const botAvatar = require('@/assets/images/avatar_chatbot.jpg');
const backgroundImage = require('@/assets/images/explore2.jpg');

const { width } = Dimensions.get('window');

// Biến môi trường để kiểm soát sử dụng mock hay API thật
const USE_MOCK_API = false;

// Component hiển thị các nút đề xuất
interface SuggestionButtonsProps {
  suggestions: Array<{ text: string; action: string }>;
  onPress: (text: string) => void;
}

const SuggestionButtons: React.FC<SuggestionButtonsProps> = ({ suggestions, onPress }) => {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.suggestionsContainer}
    >
      {suggestions.map((suggestion, index) => (
        <TouchableOpacity
          key={index}
          style={styles.suggestionButton}
          onPress={() => onPress(suggestion.text)}
          activeOpacity={0.7}
        >
          <Text style={styles.suggestionText}>{suggestion.text}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

// Component hiệu ứng typing dots
const TypingDots = () => {
  // Animation values cho từng chấm
  const dot1Opacity = useRef(new Animated.Value(0.4)).current;
  const dot2Opacity = useRef(new Animated.Value(0.4)).current;
  const dot3Opacity = useRef(new Animated.Value(0.4)).current;

  const dot1Scale = useRef(new Animated.Value(1)).current;
  const dot2Scale = useRef(new Animated.Value(1)).current;
  const dot3Scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Animation sequence cho hiệu ứng "nhảy" của các chấm
    const runAnimation = () => {
      // Reset animation
      dot1Opacity.setValue(0.4);
      dot2Opacity.setValue(0.4);
      dot3Opacity.setValue(0.4);
      dot1Scale.setValue(1);
      dot2Scale.setValue(1);
      dot3Scale.setValue(1);

      // Animation cho dot 1
      Animated.sequence([
        Animated.parallel([
          Animated.timing(dot1Opacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(dot1Scale, {
            toValue: 1.2,
            duration: 300,
            useNativeDriver: true,
          })
        ]),
        Animated.parallel([
          Animated.timing(dot1Opacity, {
            toValue: 0.4,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(dot1Scale, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          })
        ]),
      ]).start();

      // Animation cho dot 2 với delay
      setTimeout(() => {
        Animated.sequence([
          Animated.parallel([
            Animated.timing(dot2Opacity, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(dot2Scale, {
              toValue: 1.2,
              duration: 300,
              useNativeDriver: true,
            })
          ]),
          Animated.parallel([
            Animated.timing(dot2Opacity, {
              toValue: 0.4,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(dot2Scale, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            })
          ]),
        ]).start();
      }, 150);

      // Animation cho dot 3 với delay
      setTimeout(() => {
        Animated.sequence([
          Animated.parallel([
            Animated.timing(dot3Opacity, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(dot3Scale, {
              toValue: 1.2,
              duration: 300,
              useNativeDriver: true,
            })
          ]),
          Animated.parallel([
            Animated.timing(dot3Opacity, {
              toValue: 0.4,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(dot3Scale, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            })
          ]),
        ]).start(() => {
          // Lặp lại animation
          setTimeout(runAnimation, 300);
        });
      }, 300);
    };

    // Bắt đầu animation
    runAnimation();

    return () => {
      // Cleanup animation khi component unmount
      dot1Opacity.stopAnimation();
      dot2Opacity.stopAnimation();
      dot3Opacity.stopAnimation();
      dot1Scale.stopAnimation();
      dot2Scale.stopAnimation();
      dot3Scale.stopAnimation();
    };
  }, []);

  return (
    <View style={styles.typingDotsContainer}>
      <Animated.View 
        style={[
          styles.typingDot,
          { 
            opacity: dot1Opacity,
            transform: [{ scale: dot1Scale }],
          }
        ]} 
      />
      <Animated.View 
        style={[
          styles.typingDot,
          { 
            opacity: dot2Opacity,
            transform: [{ scale: dot2Scale }],
            marginLeft: 5
          }
        ]} 
      />
      <Animated.View 
        style={[
          styles.typingDot,
          { 
            opacity: dot3Opacity,
            transform: [{ scale: dot3Scale }],
            marginLeft: 5
          }
        ]} 
      />
    </View>
  );
};

// Component Onboarding
const OnboardingOverlay = ({ onStart }: { onStart: () => void }) => {
  return (
    <ImageBackground 
      source={backgroundImage}
      style={styles.onboardingContainer}
      resizeMode='cover'
    >
      <View style={styles.modalContainer}>
        <Text style={styles.nameBot}>TravelBot</Text>
        <Image source={botAvatar} style={styles.avatarImg}/>
        <Text style={styles.textIntroduce}>
          Giúp bạn dễ dàng lên kế hoạch, tư vấn thời tiết, địa điểm, hãng du lịch, chỗ ở, lời khuyên và hơn thế nữa!
        </Text>
        <TouchableOpacity
          style={styles.btnAction}
          onPress={onStart}
        >
          <Text style={styles.textBtnAction}>Trải nghiệm ngay</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default function ChatBotScreen() {
  // Hooks
  const { user: currentUser, tempId } = useAuth();
  const { mapState: mapData } = useMap();
  const langState = useLanguage();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();
  const { setUseSafeArea } = useSafeAreaConfig();
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  
  // States
  const [messages, setMessages] = useState<ChatbotMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  
  // Thêm state để kiểm soát hiển thị onboarding
  const [showOnboarding, setShowOnboarding] = useState(true);
  
  // Tắt SafeAreaView khi vào màn hình chatbot
  useEffect(() => {
    // Tắt SafeAreaView
    setUseSafeArea(false);
    
    // Khôi phục SafeAreaView khi rời khỏi màn hình
    return () => {
      setUseSafeArea(true);
    };
  }, []);
  
  // Animations on mount
  useEffect(() => {
    // Start animation khi màn hình mở
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      })
    ]).start();
    
    // Theo dõi bàn phím
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);
  
  // Khởi tạo dữ liệu khi vào màn hình
  useEffect(() => {
    sendWelcomeMessage();
  }, []);

  // Scroll xuống cuối khi có tin nhắn mới
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  // Quay lại màn hình trước
  const handleGoBack = () => {
    // Animation khi đóng màn hình
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 20,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start(() => {
      router.back();
    });
  };

  // Hàm tạo delay giả lập thời gian phản hồi
  const simulateResponseDelay = () => {
    return new Promise<void>((resolve) => {
      const delay = Math.floor(Math.random() * 1000) + 1000; // Random delay 1000-2000ms
      setTimeout(() => {
        resolve();
      }, delay);
    });
  };

  // Gửi tin nhắn chào mừng
  const sendWelcomeMessage = async () => {
    setIsTyping(true);
    try {
      let response: ChatbotResponse | null = null;
      
      if (USE_MOCK_API) {
        await simulateResponseDelay();
        response = getMockWelcomeMessage();
      } else {
        const userId = currentUser?._id || tempId || '';
        response = await ChatbotManager.Api.sendWelcomeMessage(
          userId,
          langState.language.code,
          mapData.userLocation
        );
      }

      if (response) {
        const botMessage = ChatbotManager.formatBotMessage(response, botAvatar);
        setMessages([botMessage]);
      }
    } catch (error) {
      console.error('Error sending welcome message:', error);
    } finally {
      setIsTyping(false);
    }
  };

  // Gửi tin nhắn
  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    
    // Tạo tin nhắn người dùng
    const userMessage: ChatbotMessage = {
      _id: ChatbotManager.generateMessageId(),
      text: inputText.trim(),
      createdAt: new Date(),
      user: {
        _id: currentUser?._id || tempId || '1',
        name: currentUser?.displayName || 'Người dùng',
        avatar: currentUser?.avatar || null
      }
    };

    // Cập nhật state với tin nhắn mới
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      let response: ChatbotResponse | null = null;
      
      if (USE_MOCK_API) {
        await simulateResponseDelay();
        response = processMessageWithKeywords(userMessage.text);
      } else {
        // Gửi tin nhắn đến API
        response = await ChatbotManager.Api.sendMessage({
          question: userMessage.text,
          currentUserId: currentUser?._id || tempId || '',
          languageCode: langState.language.code,
          coor: mapData.userLocation
        });
      }

      if (response) {
        // Tạo tin nhắn bot
        const botMessage = ChatbotManager.formatBotMessage(response, botAvatar);
        setMessages(prevMessages => [...prevMessages, botMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsTyping(false);
    }
  };

  // Hàm tạo tin nhắn follow-up dựa trên action
  const getFollowUpMessage = (action?: string, data?: any): ChatbotMessage | null => {
    if (!action) return null;
    
    let followUpText = '';
    let followUpAction: string | undefined = undefined;
    let followUpData: any = null;
    
    switch (action) {
      case 'input.suggest-place':
        followUpText = 'Bạn có muốn biết thêm thông tin về địa điểm nào cụ thể không? Hoặc tôi có thể giúp bạn xem chỉ đường đến những địa điểm này.';
        break;
        
      case 'input.get-weather':
        followUpText = 'Bạn có kế hoạch đi du lịch trong mấy ngày tới không? Tôi có thể giúp bạn xem dự báo thời tiết cho những ngày đó.';
        break;
        
      case 'input.where-am-i':
        // Tạo chỉ đường từ vị trí hiện tại đến địa điểm gần nhất
        followUpText = 'Từ vị trí hiện tại của bạn, Hồ Trị An cách khoảng 25km. Bạn có muốn xem chỉ đường đến đó không?';
        
        // Nếu có data.myLocation, thêm action và data cho follow-up message
        if (data?.myLocation) {
          followUpAction = 'input.suggest-place';
          followUpData = { 
            places: [
              {
                _id: '1',
                name: 'Hồ Trị An',
                address: 'Huyện Vĩnh Cửu, Đồng Nai (cách 25km)',
                description: 'Hồ nước nhân tạo lớn với cảnh quan đẹp, thích hợp cho câu cá và cắm trại.',
                images: ['https://statics.vinpearl.com/ho-tri-an-1_1630920037.jpg'],
                avgRating: 4.5
              }
            ] 
          };
        }
        break;
        
      case 'input.show-map':
        followUpText = 'Bạn muốn đi đến địa điểm nào? Tôi có thể giúp bạn tạo lịch trình du lịch hoặc xem chỉ đường chi tiết.';
        break;
        
      case 'input.get-direction':
        followUpText = 'Theo lộ trình này, bạn sẽ đi qua một số điểm du lịch thú vị. Bạn có muốn dừng lại khám phá dọc đường không?';
        break;
        
      case 'input.create-travel-itinerary':
        followUpText = 'Tôi đã lưu lịch trình này vào hệ thống. Bạn có thể truy cập nó trong phần "Lịch trình" của ứng dụng bất cứ lúc nào.';
        break;
        
      default:
        return null;
    }
    
    // Tạo tin nhắn follow-up
    return {
      _id: ChatbotManager.generateMessageId(),
      text: followUpText,
      createdAt: new Date(),
      user: {
        _id: 2, // Bot
        name: 'TravelBot',
        avatar: botAvatar
      },
      action: followUpAction,
      data: followUpData
    };
  };

  // Định dạng ngày hiển thị
  const formatDate = () => {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  };

  // Render từng tin nhắn
  const renderMessageItem = ({ item, index }: { item: ChatbotMessage, index: number }) => {
    const isBot = item.user._id === 2; // Bot có _id là 2
    
    const formattedTime = new Date(item.createdAt).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
    
    // Hiển thị header ngày nếu là tin nhắn đầu tiên
    const showDateHeader = index === 0;
    
    // Xử lý khi nhấn vào nút đề xuất
    const handleSuggestionPress = (text: string) => {
      handleSendQuery(text);
    };

    // Kiểm tra nếu tin nhắn có suggestions
    const hasSuggestions = isBot && item.action === 'input.welcome-suggestions' && item.data?.suggestions;
    
    // Kiểm tra nếu tin nhắn có rich UI feature
    const hasUIFeature = isBot && item.action && item.data && 
      ['input.show-map', 'input.suggest-place', 'input.get-weather', 
       'input.where-am-i', 'input.get-direction', 'input.create-travel-itinerary'].includes(item.action || '');
    
    return (
      <>
        {showDateHeader && (
          <View style={styles.dateHeaderContainer}>
            <Text style={styles.dateHeaderText}>{formatDate()}</Text>
          </View>
        )}
        
        <View style={styles.messageContainer}>
          {/* Phần tin nhắn bình thường */}
          <View 
            style={[
              styles.messageRow, 
              isBot ? styles.botMessageContainer : styles.userMessageContainer
            ]}
          >
            {isBot ? (
              <>
                <View style={styles.botAvatarContainer}>
                  <Image source={botAvatar} style={styles.botAvatar} />
                </View>
                
                <View style={styles.botBubbleWrapper}>
                  <View style={styles.botBubble}>
                    <Text style={styles.botMessageText}>
                      {item.text}
                    </Text>
                    
                    <Text style={styles.botTimeText}>
                      {formattedTime}
                    </Text>
                  </View>
                </View>
              </>
            ) : (
              <View style={styles.userBubbleWrapper}>
                <View style={styles.userBubble}>
                  <Text style={styles.userMessageText}>
                    {item.text}
                  </Text>
                  
                  <Text style={styles.userTimeText}>
                    {formattedTime}
                  </Text>
                </View>
              </View>
            )}
          </View>
          
          {/* Hiển thị các nút đề xuất nếu có */}
          {hasSuggestions && (
            <View style={styles.suggestionsWrapper}>
              <SuggestionButtons 
                suggestions={item.data.suggestions} 
                onPress={handleSuggestionPress}
              />
            </View>
          )}
          
          {/* Hiển thị các UI features độc lập nếu có */}
          {hasUIFeature && item.action && (
            <View style={styles.uiFeatureContainer}>
              <MessageFeature action={item.action} data={item.data} />
            </View>
          )}
        </View>
      </>
    );
  };

  // Hàm xử lý gửi tin nhắn từ các đề xuất
  const handleSendQuery = (text: string) => {
    if (!text) return;
    
    // Tạo tin nhắn người dùng
    const userMessage: ChatbotMessage = {
      _id: ChatbotManager.generateMessageId(),
      text: text,
      createdAt: new Date(),
      user: {
        _id: currentUser?._id || tempId || '1',
        name: currentUser?.displayName || 'Người dùng',
        avatar: currentUser?.avatar || null
      }
    };

    // Cập nhật state với tin nhắn mới
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setIsTyping(true);

    // Xử lý phản hồi
    setTimeout(async () => {
      try {
        let response: ChatbotResponse | null = null;
        
        if (USE_MOCK_API) {
          await simulateResponseDelay();
          // Dựa vào nội dung của nút để xác định nên tạo phản hồi nào
          if (text.toLowerCase().includes('thời tiết')) {
            response = processMessageWithKeywords('thời tiết');
          } else if (text.toLowerCase().includes('địa điểm') || text.toLowerCase().includes('du lịch')) {
            response = processMessageWithKeywords('địa điểm');
          } else if (text.toLowerCase().includes('bản đồ')) {
            response = processMessageWithKeywords('bản đồ');
          } else if (text.toLowerCase().includes('lịch trình')) {
            response = processMessageWithKeywords('lịch trình');
          } else {
            // Nếu không tìm thấy từ khóa phù hợp, gửi request thông thường
            response = processMessageWithKeywords(text);
          }
        } else {
          // Gửi tin nhắn đến API thật
          response = await ChatbotManager.Api.sendMessage({
            question: text,
            currentUserId: currentUser?._id || tempId || '',
            languageCode: langState.language.code,
            coor: mapData.userLocation
          });
        }

        if (response) {
          // Tạo tin nhắn bot
          const botMessage = ChatbotManager.formatBotMessage(response, botAvatar);
          setMessages(prevMessages => [...prevMessages, botMessage]);
          
          if (USE_MOCK_API) {
            // Thêm tin nhắn follow-up nếu cần (chỉ trong chế độ mock)
            const followUpMessage = getFollowUpMessage(response.action, response.data);
            if (followUpMessage) {
              // Delay trước khi hiển thị tin nhắn follow-up
              setTimeout(async () => {
                setIsTyping(true);
                await simulateResponseDelay();
                setMessages(prevMessages => [...prevMessages, followUpMessage]);
                setIsTyping(false);
              }, 1000);
            }
          }
        }
      } catch (error) {
        console.error('Error processing suggestion:', error);
      } finally {
        setIsTyping(false);
      }
    }, 500);
  };

  // Render chỉ báo bot đang nhập
  const renderTypingIndicator = () => {
    if (!isTyping) return null;
    
    return (
      <View style={[styles.messageContainer, styles.botMessageContainer]}>
        <View style={styles.botAvatarContainer}>
          <Image source={botAvatar} style={styles.botAvatar} />
        </View>
        <View style={styles.typingBubble}>
          <TypingDots />
        </View>
      </View>
    );
  };

  // Hàm xử lý khi người dùng bấm bắt đầu từ onboarding
  const handleStartChat = () => {
    setShowOnboarding(false);
    sendWelcomeMessage();
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Animated.View 
        style={[
          styles.container, 
          { 
            opacity: fadeAnim,
            transform: [{ translateY }],
            paddingTop: insets.top,
          }
        ]}
      >
        {showOnboarding ? (
          <OnboardingOverlay onStart={handleStartChat} />
        ) : (
          <>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity 
                style={styles.backButton} 
                onPress={handleGoBack}
              >
                <Ionicons name="chevron-back" size={28} color="#000" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>TravelBot</Text>
              <TouchableOpacity style={styles.searchButton}>
                <Ionicons name="search" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            {/* Danh sách tin nhắn */}
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderMessageItem}
              keyExtractor={(item) => item._id.toString()}
              contentContainerStyle={styles.messagesContainer}
              ListFooterComponent={renderTypingIndicator}
              showsVerticalScrollIndicator={false}
            />

            {/* Thanh nhập tin nhắn */}
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
              style={{ paddingBottom: insets.bottom }}
            >
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={inputText}
                  onChangeText={setInputText}
                  placeholder="Nhập tin nhắn..."
                  placeholderTextColor="#999"
                  multiline
                  maxLength={1000}
                  returnKeyType="send"
                  onSubmitEditing={handleSendMessage}
                />
                
                <TouchableOpacity 
                  style={styles.sendButton} 
                  onPress={handleSendMessage}
                  disabled={!inputText.trim()}
                >
                  <View style={styles.sendButtonInner}>
                    <FontAwesome name="send" size={20} color="#fff" />
                  </View>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </>
        )}
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 4,
    borderRadius: 20,
    width: 40,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  searchButton: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateHeaderContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  dateHeaderText: {
    fontSize: 14,
    color: '#999',
    fontWeight: '500',
  },
  messagesContainer: {
    padding: 16,
    paddingBottom: 20,
  },
  messageContainer: {
    width: '100%',
    marginVertical: 8,
  },
  messageRow: {
    flexDirection: 'row',
    width: '100%',
  },
  botMessageContainer: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  userMessageContainer: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
  },
  botAvatarContainer: {
    marginRight: 8,
    alignSelf: 'flex-end',
  },
  botAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  botBubbleWrapper: {
    maxWidth: '75%',
  },
  userBubbleWrapper: {
    maxWidth: '75%',
    alignSelf: 'flex-end',
    marginRight: 8,
  },
  botBubble: {
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  userBubble: {
    backgroundColor: '#3b82f6',
    borderRadius: 20,
    borderBottomRightRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  botMessageText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  userMessageText: {
    fontSize: 16,
    color: '#fff',
    lineHeight: 22,
  },
  botTimeText: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
    alignSelf: 'flex-end',
  },
  userTimeText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 5,
    alignSelf: 'flex-end',
  },
  featureContainer: {
    marginTop: 10,
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingTop: 8,
  },
  suggestionsWrapper: {
    marginTop: 10,
    marginLeft: 44, // Line up with the message bubble (36px avatar + 8px margin)
  },
  suggestionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  suggestionButton: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  suggestionText: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eaeaea',
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingRight: 16,
    maxHeight: 100,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#eaeaea',
  },
  sendButton: {
    width: 44,
    height: 44,
    marginLeft: 10,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonInner: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  typingBubble: {
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
    minWidth: 70,
    height: 36,
    justifyContent: 'center',
  },
  typingDotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 20,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3b82f6',
  },
  uiFeatureContainer: {
    marginTop: 10,
    marginBottom: 15,
    width: '80%',
    paddingTop: 8,
    marginLeft: 44,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eaeaea',
    backgroundColor: '#fff',
    alignSelf: 'center',
  },
  // Styles cho onboarding
  onboardingContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    zIndex: 5,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 18
  },
  modalContainer: {
    paddingHorizontal: 18,
    paddingVertical: 42,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000096',
    borderRadius: 12
  },
  nameBot: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: "center",
    marginBottom: 12
  },
  avatarImg: {
    height: 40,
    width: 40,
    borderRadius: 20
  },
  textIntroduce: {
    fontSize: 16,
    color: '#fff',
    textAlign: "center",
    marginBottom: 24,
    marginTop: 10
  },
  btnAction: {
    paddingHorizontal: 18,
    paddingVertical: 16,
    backgroundColor: '#3b82f6',
    borderRadius: 25
  },
  textBtnAction: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
}); 