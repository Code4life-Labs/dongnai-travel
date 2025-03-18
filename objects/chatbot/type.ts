/**
 * Kiểu dữ liệu đầu vào cho API chatbot
 */
export type ChatbotRequest = {
  question: string;
  currentUserId: string;
  languageCode: string;
  coor: any;
};

/**
 * Kiểu dữ liệu đầu ra của API chatbot
 */
export type ChatbotResponse = {
  response: string;
  action?: string;
  data?: any;
};

/**
 * Interface cho dữ liệu người dùng trong chatbot
 */
export interface ChatbotUser {
  _id: number | string;
  name?: string;
  avatar?: string | null;
}

/**
 * Interface cho tin nhắn chatbot
 */
export interface ChatbotMessage {
  _id: number | string;
  text: string;
  createdAt: Date;
  user: ChatbotUser;
  action?: string;
  data?: any;
} 