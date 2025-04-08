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

/**
 * Mảng các từ khóa và phản hồi được sử dụng khi chạy mock API
 */
const MOCK_KEYWORDS = [
  // Thời tiết
  {
    keywords: ["thời tiết", "nắng", "mưa", "nhiệt độ", "nóng", "lạnh"],
    response: "Dự báo thời tiết tại Đồng Nai hôm nay, nhiệt độ từ 25-32°C, có mưa rào vào buổi chiều.",
    action: "input.get-weather",
    data: {
      name: "Đồng Nai",
      country: "VN",
      current: {
        temp: 28,
        feels_like: 30,
        humidity: 75,
        wind_speed: 3.5,
        weather: [
          {
            main: "Rain",
            description: "Mưa rào nhẹ",
            icon: "10d"
          }
        ]
      },
      forecast: [
        {
          dt: Date.now() + 3600 * 1000,
          temp: 27,
          weather: [{ main: "Rain", description: "Mưa rào", icon: "10d" }]
        },
        {
          dt: Date.now() + 3600 * 2000,
          temp: 26,
          weather: [{ main: "Rain", description: "Mưa rào", icon: "10d" }]
        },
        {
          dt: Date.now() + 3600 * 3000,
          temp: 25,
          weather: [{ main: "Clouds", description: "Nhiều mây", icon: "04n" }]
        },
        {
          dt: Date.now() + 3600 * 4000,
          temp: 25,
          weather: [{ main: "Clouds", description: "Nhiều mây", icon: "04n" }]
        }
      ]
    }
  },
  
  // Địa điểm du lịch
  {
    keywords: ["địa điểm", "du lịch", "tham quan", "chỗ chơi", "đi đâu"],
    response: "Dưới đây là một số địa điểm du lịch nổi tiếng ở Đồng Nai mà bạn có thể quan tâm:",
    action: "input.suggest-place",
    data: {
      places: [
        {
          _id: "place1",
          name: "Khu du lịch Bửu Long",
          address: "Phường Bửu Long, TP. Biên Hòa, Đồng Nai",
          description: "Điểm du lịch sinh thái với cảnh quan thiên nhiên đẹp, có hồ nước và nhiều hoạt động giải trí.",
          images: ["https://statics.vinpearl.com/khu-du-lich-buu-long-1_1630922731.jpg"],
          avgRating: 4.2
        },
        {
          _id: "place2",
          name: "Thác Giang Điền",
          address: "Xã Giang Điền, Huyện Trảng Bom, Đồng Nai",
          description: "Thác nước tự nhiên với cảnh quan đẹp, phù hợp cho hoạt động dã ngoại.",
          images: ["https://statics.vinpearl.com/thac-giang-dien-1_1630923115.jpg"],
          avgRating: 4.5
        },
        {
          _id: "place3",
          name: "Vườn Quốc gia Nam Cát Tiên",
          address: "Huyện Tân Phú, Đồng Nai",
          description: "Khu bảo tồn thiên nhiên rộng lớn với hệ động thực vật phong phú.",
          images: ["https://statics.vinpearl.com/vuon-quoc-gia-nam-cat-tien-1_1630922938.jpg"],
          avgRating: 4.7
        }
      ]
    }
  },
  
  // Bản đồ
  {
    keywords: ["bản đồ", "chỉ đường", "đường đi", "vị trí"],
    response: "Bạn cần xem bản đồ khu vực nào? Tôi có thể giúp bạn tìm đường đi đến các địa điểm du lịch.",
    action: "input.show-map",
    data: {
      center: {
        latitude: 10.9778,
        longitude: 106.8511
      },
      zoom: 12
    }
  },
  
  // Vị trí hiện tại
  {
    keywords: ["tôi đang ở đâu", "vị trí hiện tại", "ở đâu", "where am i"],
    response: "Dựa vào vị trí của bạn, bạn đang ở gần trung tâm TP. Biên Hòa, Đồng Nai.",
    action: "input.where-am-i",
    data: {
      myLocation: {
        address: "Phường Tân Phong, TP. Biên Hòa, Đồng Nai",
        coordinates: {
          latitude: 10.9542,
          longitude: 106.8428
        }
      },
      nearbyPlaces: [
        {
          _id: "nearby1",
          name: "Trung tâm thương mại Vincom Biên Hòa",
          address: "1096 Phạm Văn Thuận, P. Tân Mai, Biên Hòa, Đồng Nai",
          location: {
            latitude: 10.9501,
            longitude: 106.8421
          }
        },
        {
          _id: "nearby2",
          name: "Công viên Biên Hùng",
          address: "Phường Quang Vinh, Biên Hòa, Đồng Nai",
          location: {
            latitude: 10.9478,
            longitude: 106.8401
          }
        }
      ]
    }
  },
  
  // Chỉ đường cụ thể
  {
    keywords: ["đi từ", "đi đến", "hướng dẫn đường", "đường đi từ", "đường đi đến"],
    response: "Đây là hướng dẫn đường đi từ Biên Hòa đến Khu du lịch Bửu Long:",
    action: "input.get-direction",
    data: {
      origin: "Biên Hòa, Đồng Nai",
      destination: "Khu du lịch Bửu Long, Đồng Nai",
      distance: "8.5 km",
      duration: "25 phút",
      steps: [
        "Đi theo đường Phạm Văn Thuận hướng về phía Bắc trong 2.3 km",
        "Rẽ phải vào đường Võ Thị Sáu và đi tiếp 1.8 km",
        "Rẽ trái vào đường Bửu Long và đi tiếp 4.4 km",
        "Đến Khu du lịch Bửu Long ở bên phải"
      ]
    }
  },
  
  // Lịch trình du lịch
  {
    keywords: ["lịch trình", "kế hoạch", "hành trình", "tour"],
    response: "Tôi có thể giúp bạn tạo lịch trình du lịch Đồng Nai trong 2 ngày như sau:",
    action: "input.create-travel-itinerary",
    data: {
      itinerary: `
# Lịch trình du lịch Đồng Nai (2 ngày)

## Ngày 1: Khám phá TP. Biên Hòa và vùng phụ cận

### Sáng (7:00 - 12:00)
- 7:00 - 8:00: Ăn sáng tại trung tâm TP. Biên Hòa
- 8:30 - 11:00: Tham quan Khu du lịch Bửu Long
- 11:00 - 12:00: Di chuyển và ăn trưa tại nhà hàng gần Thác Giang Điền

### Chiều (12:00 - 18:00)
- 12:30 - 15:30: Khám phá Thác Giang Điền và tham gia các hoạt động dã ngoại
- 16:00 - 18:00: Tham quan Đền thờ Nguyễn Hữu Cảnh

### Tối (18:00 - 22:00)
- 18:30 - 20:00: Ăn tối và khám phá ẩm thực địa phương tại khu vực trung tâm
- 20:00 - 22:00: Dạo chơi tại khu vực Chợ đêm Biên Hòa

## Ngày 2: Khám phá Vườn Quốc gia Nam Cát Tiên

### Sáng (6:00 - 12:00)
- 6:00 - 8:00: Di chuyển từ TP. Biên Hòa đến Vườn Quốc gia Nam Cát Tiên
- 8:00 - 9:00: Ăn sáng tại khu vực cổng vườn quốc gia
- 9:00 - 12:00: Khám phá rừng nguyên sinh và các loài động thực vật

### Chiều (12:00 - 18:00)
- 12:00 - 13:00: Ăn trưa tại nhà hàng trong khu vực
- 13:00 - 16:00: Tham gia các hoạt động như đi thuyền trên sông Đồng Nai, khám phá Đảo Tiên
- 16:00 - 18:00: Di chuyển về TP. Biên Hòa

### Tối (18:00 - 21:00)
- 18:30 - 20:00: Ăn tối tại nhà hàng đặc sản Đồng Nai
- 20:00 - 21:00: Mua sắm đặc sản làm quà tại các cửa hàng đặc sản

## Chi phí ước tính:
- Di chuyển: 500.000 - 700.000 VNĐ
- Ăn uống: 800.000 - 1.000.000 VNĐ
- Vé tham quan: 300.000 - 500.000 VNĐ
- Lưu trú: 600.000 - 1.000.000 VNĐ
- Khác: 300.000 - 500.000 VNĐ

Tổng chi phí: 2.500.000 - 3.700.000 VNĐ/người
      `,
      query: "Lịch trình du lịch Đồng Nai 2 ngày"
    }
  },
  
  // Default
  {
    keywords: [],
    response: "Xin lỗi, tôi không hiểu ý bạn. Bạn có thể hỏi tôi về thời tiết, địa điểm du lịch, tạo lịch trình, hoặc chỉ đường đi đến các địa điểm.",
    action: "input.unknown"
  }
];

/**
 * Trả về tin nhắn chào mừng cho người dùng
 * @returns Phản hồi chào mừng
 */
export function getMockWelcomeMessage(): ChatbotResponse {
  return {
    response: "Xin chào! Tôi là TravelBot, trợ lý du lịch thông minh của DongNaiTravel. Tôi có thể giúp bạn tìm kiếm địa điểm du lịch, thời tiết, tạo lịch trình và nhiều thứ khác. Bạn cần giúp gì không?",
    action: "input.welcome",
    data: {
      suggestions: [
        { text: "Thời tiết ở Đồng Nai", action: "query-weather" },
        { text: "Địa điểm du lịch nổi tiếng", action: "query-places" },
        { text: "Tạo lịch trình du lịch", action: "query-itinerary" },
        { text: "Hướng dẫn sử dụng", action: "query-help" }
      ]
    }
  };
}

/**
 * Xử lý tin nhắn người dùng dựa trên từ khóa
 * @param message Tin nhắn cần xử lý
 * @returns Phản hồi từ chatbot
 */
export function processMessageWithKeywords(message: string): ChatbotResponse {
  // Chuyển thành chữ thường để dễ so sánh
  const lowerMessage = message.toLowerCase();
  
  // Tìm kiếm từ khóa phù hợp
  for (const item of MOCK_KEYWORDS) {
    // Bỏ qua mục default (không có từ khóa)
    if (item.keywords.length === 0) continue;
    
    // Kiểm tra từng từ khóa
    const match = item.keywords.some(keyword => lowerMessage.includes(keyword));
    
    if (match) {
      return {
        response: item.response,
        action: item.action,
        data: item.data
      };
    }
  }
  
  // Nếu không tìm thấy từ khóa phù hợp, trả về phản hồi mặc định
  const defaultResponse = MOCK_KEYWORDS[MOCK_KEYWORDS.length - 1];
  return {
    response: defaultResponse.response,
    action: defaultResponse.action,
    data: defaultResponse.data
  };
}

/**
 * Xử lý yêu cầu tạo lịch trình du lịch
 * @param message Tin nhắn yêu cầu
 * @returns Lịch trình du lịch
 */
export function generateMockTravelItinerary(message: string): ChatbotResponse {
  // Tìm kiếm item lịch trình
  const itineraryItem = MOCK_KEYWORDS.find(item => item.action === "input.create-travel-itinerary");
  
  if (itineraryItem) {
    return {
      response: "Đây là đề xuất lịch trình du lịch dựa trên yêu cầu của bạn:",
      action: "input.create-travel-itinerary",
      data: {
        itinerary: itineraryItem.data.itinerary,
        query: message
      }
    };
  }
  
  // Fallback nếu không tìm thấy
  return {
    response: "Xin lỗi, tôi không thể tạo lịch trình du lịch vào lúc này.",
    action: "input.error"
  };
} 