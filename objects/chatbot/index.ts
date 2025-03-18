import { ChatbotAPI } from "./api";
import * as ChatbotTypes from "./type";

/**
 * Class quản lý các chức năng chatbot
 */
export class ChatbotManager {
  /**
   * API instance để giao tiếp với server chatbot
   */
  static Api = new ChatbotAPI(
    `${process.env.EXPO_PUBLIC_DONGNAITRAVEL_API_URL!}/v1`
  );

  /**
   * Tạo ID duy nhất cho tin nhắn
   */
  static generateMessageId(): number {
    return new Date().getTime();
  }

  /**
   * Xử lý tin nhắn từ server trả về thành định dạng tin nhắn cho GiftedChat
   * @param response Phản hồi từ server
   * @param botAvatar Ảnh đại diện cho bot
   * @returns Tin nhắn đã được định dạng
   */
  static formatBotMessage(response: ChatbotTypes.ChatbotResponse, botAvatar: any): ChatbotTypes.ChatbotMessage {
    return {
      _id: this.generateMessageId(),
      text: response.response,
      createdAt: new Date(),
      user: {
        _id: 2,
        name: 'TravelBot',
        avatar: botAvatar
      },
      action: response.action,
      data: response.data
    };
  }

  private constructor() {}
}

// Export types
export { ChatbotTypes }; 