// Import from bases
import { API } from "@/classes/API";

// Import from utils
import { RouteUtils } from "@/utils/route";

// Import types
import { ChatbotRequest, ChatbotResponse } from "./type";

const api = new API();

/**
 * Class API cho Chatbot
 */
export class ChatbotAPI {
  baseURL!: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  /**
   * Gửi tin nhắn đến chatbot và nhận phản hồi
   * @param data Dữ liệu gửi đến chatbot
   * @returns Phản hồi từ chatbot
   */
  async sendMessage(data: ChatbotRequest): Promise<ChatbotResponse | null> {
    try {
      const url = this.baseURL + RouteUtils.getPath("/chatbot/get_text");

      const response = await api.post(url, data);

      return response.data.data as ChatbotResponse;
    } catch (error: any) {
      console.warn("Chatbot API Error:", error.message);
      return null;
    }
  }

  /**
   * Gửi tin nhắn chào mừng (welcome message) đến chatbot
   * @param userId ID của người dùng hiện tại
   * @param languageCode Mã ngôn ngữ
   * @param coordinates Tọa độ hiện tại của người dùng
   * @returns Phản hồi từ chatbot
   */
  async sendWelcomeMessage(
    userId: string,
    languageCode: string,
    coordinates: any
  ): Promise<ChatbotResponse | null> {
    return this.sendMessage({
      question: "Hi",
      currentUserId: userId,
      languageCode: languageCode,
      coor: coordinates,
    });
  }
} 