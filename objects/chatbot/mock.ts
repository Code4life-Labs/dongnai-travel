import { ChatbotResponse } from './type';

// Danh sách các địa điểm mock
const mockPlaces = [
  {
    _id: '1',
    name: 'Hồ Trị An',
    address: 'Huyện Vĩnh Cửu, Đồng Nai',
    description: 'Hồ nước nhân tạo lớn với cảnh quan đẹp, thích hợp cho câu cá và cắm trại.',
    images: ['https://statics.vinpearl.com/ho-tri-an-1_1630920037.jpg'],
    avgRating: 4.5
  },
  {
    _id: '2',
    name: 'Thác Mai',
    address: 'Xã Gia Canh, Huyện Định Quán, Đồng Nai',
    description: 'Thác nước đẹp với không gian xanh mát, địa điểm lý tưởng cho dã ngoại cuối tuần.',
    images: ['https://cdn.tgdd.vn/Files/2022/01/25/1412822/kinh-nghiem-du-lich-thac-mai-dong-nai-day-du-nhat-202201251458049436.jpg'],
    avgRating: 4.2
  },
  {
    _id: '3',
    name: 'Khu du lịch Bửu Long',
    address: 'Phường Bửu Long, TP. Biên Hòa, Đồng Nai',
    description: 'Khu du lịch sinh thái với núi đá đẹp và hồ nước trong xanh.',
    images: ['https://dulichdongnai.com.vn/wp-content/uploads/2021/02/Khu-Du-lich-Buu-Long.jpg'],
    avgRating: 4.3
  }
];

// Thông tin thời tiết mock
const mockWeather = {
  current: {
    temp: 33,
    humidity: 75,
    wind_speed: 5.2,
    weather: [
      {
        icon: '03d',
        main: 'Clouds',
        description: 'Mây rải rác'
      }
    ]
  },
  daily: [
    {
      dt: 1616943600, // Timestamp
      temp: {
        min: 26,
        max: 32
      },
      weather: [
        {
          icon: '01d',
          main: 'Clear',
          description: 'Trời nắng'
        }
      ]
    },
    {
      dt: 1617030000, // Timestamp
      temp: {
        min: 25,
        max: 34
      },
      weather: [
        {
          icon: '10d',
          main: 'Rain',
          description: 'Mưa rào'
        }
      ]
    },
    {
      dt: 1617116400,
      temp: {
        min: 27,
        max: 33
      },
      weather: [
        {
          icon: '03d',
          main: 'Clouds',
          description: 'Mây rải rác'
        }
      ]
    }
  ]
};

// Thông tin vị trí hiện tại mock
const mockCurrentLocation = {
  latitude: 10.9454,
  longitude: 106.8423,
  name: 'Biên Hòa, Đồng Nai'
};

// Thông tin bản đồ mock
const mockMapCoordinates = [
  {
    latitude: 10.9454,
    longitude: 106.8423,
    name: 'Biên Hòa'
  },
  {
    latitude: 10.9604,
    longitude: 107.0299,
    name: 'Hồ Trị An'
  },
  {
    latitude: 11.1889,
    longitude: 107.4264,
    name: 'Thác Mai'
  }
];

// Thông tin chỉ đường mock
const mockDirection = {
  origin: {
    latitude: 10.9454,
    longitude: 106.8423,
    name: 'Biên Hòa'
  },
  destination: {
    latitude: 10.9604,
    longitude: 107.0299,
    name: 'Hồ Trị An'
  },
  distance: '25.3 km',
  duration: '45 phút',
  route: [
    { latitude: 10.9454, longitude: 106.8423 },
    { latitude: 10.9485, longitude: 106.8695 },
    { latitude: 10.9512, longitude: 106.9125 },
    { latitude: 10.9578, longitude: 106.9887 },
    { latitude: 10.9604, longitude: 107.0299 }
  ]
};

// Thông tin lịch trình du lịch mock
const mockItinerary = {
  _id: '123',
  name: 'Khám phá Đồng Nai trong 2 ngày',
  places: mockPlaces,
  startDate: '2023-06-15',
  endDate: '2023-06-16'
};

// Danh sách từ khóa và phản hồi tương ứng
const keywordResponses: { [key: string]: (query: string) => ChatbotResponse } = {
  'chào': (query) => ({
    response: 'Xin chào! Tôi là TravelBot, trợ lý du lịch thông minh của ứng dụng DongNaiTravel. Tôi có thể giúp bạn tìm địa điểm du lịch, kiểm tra thời tiết, hoặc đề xuất lịch trình. Bạn cần giúp đỡ gì?',
    action: 'input.welcome',
    data: null
  }),
  'hi': (query) => ({
    response: 'Xin chào! Tôi là TravelBot, trợ lý du lịch thông minh của ứng dụng DongNaiTravel. Tôi có thể giúp bạn tìm địa điểm du lịch, kiểm tra thời tiết, hoặc đề xuất lịch trình. Bạn cần giúp đỡ gì?',
    action: 'input.welcome',
    data: null
  }),
  'hello': (query) => ({
    response: 'Xin chào! Tôi là TravelBot, trợ lý du lịch thông minh của ứng dụng DongNaiTravel. Tôi có thể giúp bạn tìm địa điểm du lịch, kiểm tra thời tiết, hoặc đề xuất lịch trình. Bạn cần giúp đỡ gì?',
    action: 'input.welcome',
    data: null
  }),
  'địa điểm': (query) => ({
    response: 'Đây là một số địa điểm du lịch nổi tiếng ở Đồng Nai mà bạn có thể quan tâm:',
    action: 'input.suggest-place',
    data: { places: mockPlaces }
  }),
  'du lịch': (query) => ({
    response: 'Đây là một số địa điểm du lịch nổi tiếng ở Đồng Nai mà bạn có thể quan tâm:',
    action: 'input.suggest-place',
    data: { places: mockPlaces }
  }),
  'địa danh': (query) => ({
    response: 'Đây là một số địa điểm du lịch nổi tiếng ở Đồng Nai mà bạn có thể quan tâm:',
    action: 'input.suggest-place',
    data: { places: mockPlaces }
  }),
  'thời tiết': (query) => ({
    response: 'Thời tiết Đồng Nai hiện tại: 33°C, cảm giác như 36°C, mây rải rác, độ ẩm 75%, gió 5.2 km/h.',
    action: 'input.get-weather',
    data: { weatherData: mockWeather }
  }),
  'nhiệt độ': (query) => ({
    response: 'Thời tiết Đồng Nai hiện tại: 33°C, cảm giác như 36°C, mây rải rác, độ ẩm 75%, gió 5.2 km/h.',
    action: 'input.get-weather',
    data: { weatherData: mockWeather }
  }),
  'đang ở đâu': (query) => ({
    response: 'Hiện tại tôi đang phát hiện vị trí của bạn ở gần Biên Hòa, Đồng Nai. Dưới đây là vị trí của bạn trên bản đồ:',
    action: 'input.where-am-i',
    data: { myLocation: mockCurrentLocation }
  }),
  'vị trí': (query) => ({
    response: 'Vị trí hiện tại của bạn là Biên Hòa, Đồng Nai. Dưới đây là vị trí của bạn trên bản đồ:',
    action: 'input.where-am-i',
    data: { myLocation: mockCurrentLocation }
  }),
  'bản đồ': (query) => ({
    response: 'Đây là bản đồ các địa điểm du lịch nổi tiếng ở Đồng Nai:',
    action: 'input.show-map',
    data: { 
      coordinates: mockMapCoordinates,
      initialRegion: {
        latitude: 10.9454,
        longitude: 106.9423,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5
      }
    }
  }),
  'chỉ đường': (query) => ({
    response: 'Đây là chỉ đường từ Biên Hòa đến Hồ Trị An:',
    action: 'input.get-direction',
    data: mockDirection
  }),
  'đường đi': (query) => ({
    response: 'Đây là chỉ đường từ Biên Hòa đến Hồ Trị An:',
    action: 'input.get-direction',
    data: mockDirection
  }),
  'lịch trình': (query) => ({
    response: 'Tôi đã tạo một lịch trình du lịch Đồng Nai trong 2 ngày cho bạn:',
    action: 'input.create-travel-itinerary',
    data: { itinerary: mockItinerary }
  }),
  'kế hoạch': (query) => ({
    response: 'Tôi đã tạo một lịch trình du lịch Đồng Nai trong 2 ngày cho bạn:',
    action: 'input.create-travel-itinerary',
    data: { itinerary: mockItinerary }
  }),
  'giờ mở cửa': (query) => ({
    response: 'Phần lớn các khu du lịch ở Đồng Nai mở cửa từ 7:00 sáng đến 17:00 chiều hàng ngày. Các địa điểm cụ thể có thể có giờ mở cửa khác nhau, bạn muốn tìm hiểu về địa điểm nào?',
    action: undefined,
    data: null
  })
};

// Hàm xử lý tin nhắn dựa trên từ khóa
export const processMessageWithKeywords = (message: string): ChatbotResponse => {
  message = message.toLowerCase().trim();
  
  // Tìm từ khóa phù hợp
  for (const keyword in keywordResponses) {
    if (message.includes(keyword)) {
      return keywordResponses[keyword](message);
    }
  }
  
  // Câu trả lời mặc định nếu không tìm thấy từ khóa nào
  return {
    response: 'Xin lỗi, tôi không hiểu ý bạn. Bạn có thể hỏi về địa điểm du lịch, thời tiết, bản đồ, chỉ đường hoặc nhờ tôi gợi ý lịch trình du lịch.',
    action: undefined,
    data: null
  };
};

// Hàm mock welcome message
export const getMockWelcomeMessage = (): ChatbotResponse => {
  return {
    response: 'Xin chào! Tôi là TravelBot, trợ lý du lịch thông minh của ứng dụng DongNaiTravel. Rất vui được giúp bạn!',
    action: 'input.welcome',
    data: null
  };
}; 