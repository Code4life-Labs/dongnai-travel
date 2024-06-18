
// Phuong: Created on 31/1/2023
// Phuong: Muon test api thi xem ipv4 trong may tinh => cmd => ipconfig => ipv4
// Phuong: doi lai ipv4 cua minh

const ip_v4 = {
  tuan: '192.168.0.29',
  phuong: '192.168.2.15',
  duc: '192.168.146.83',
  phap: '192.168.1.17'
}


const API_PORT = '7500'

// Phuong: This is the api web for DongNaiAppTravel
// export const API_ROOT = 'https://dong-nai-travel-api.onrender.com'
let useLocalServer = true;
export const API_ROOT = useLocalServer ? `http://${ip_v4.phuong}:${API_PORT}` : 'https://dong-nai-travel-api.onrender.com';


export const REDUX_SLICE_NAMES = {
  BLOGS: "blogs",
  PLACES: "places",
  FILTER: "filter",
  LANGUAGE: "language",
  MANIFOLD: "manifold",
  MAP: "map",
  NOTIFICATIONS: "notifs",
  PROFILE: "profile",
  SETTING: "setting",
  THEME: "theme",
  USER: "user",
  WAREHOUSE: "warehouse"
};

export const FilterConstants = {
  categories: {
    ALL_CATEGORIES: 'all_categories',
  },
  sortBy: [
    {
      id: 'DEFAULT',
      tilte: {
        vi: "Mặc định",
        en:"Default"
      },
    },
    {
      id: 'PROMINENCE',
      tilte: {
        vi: "Nổi bật",
        en:'Prominence'
      }
    },
    {
      id: 'NEAR_BY',
      tilte: {
        vi: "Gần đây",
        en:'Near by'
      }
    },
    {
      id: 'STAR_LOW_TO_HIGH',
      tilte: {
        vi: "Đánh giá: Thấp đến cao",
        en: 'Star: Low to high'
      }
    },
    {
      id: 'STAR_HIGH_TO_LOW',
      tilte: {
        vi: "Đánh giá: Cao đến thấp",
        en:'Star: High to low'
      }
    },
    {
      id: 'RATING_LOW_TO_HIGH',
      tilte: {
        vi: "Xếp hạng: Thấp đến cao",
        en:'Rating total: Low to high'
      }
    },
    {
      id: 'RATING_HIGH_TO_LOW',
      tilte: {
        vi: "Xếp hạng: Cao đến thấp",
        en: "Rating total: High to low"
      }
    }
  ],
  priceLevels: {
    LEVEL_1: 'LEVEL_1',
    LEVEL_2: 'LEVEL_2',
    LEVEL_3: 'LEVEL_3',
    LEVEL_4: 'LEVEL_4',
    LEVEL_5: 'LEVEL_5'
  }
}
export const HEADER_HEIGHT = 50;
export const ALPHABET = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

export const PLACE_QUALITIES = {
  vi: {
    labels: "Tất_cả;Đề_xuất;Phổ_biến;Yêu_thích_nhất;Đánh_giá_cao",
    values: "all;recommended;popular;most_favorite;high_rating"
  },
  en: {
    labels: "all;recommended;popular;most_favorite;high_rating",
    values: "all;recommended;popular;most_favorite;high_rating"
  }
};
export const BRIEF_PLACE_DATA_FIELDS = "place_id;name;adr_address;types;rating;user_ratings_total;isRecommended;user_favorites_total;formatted_address;place_photos"
export const PLACE_DETAILS_DATA_FIELDS = "rating;user_ratings_total;user_favorites_total;content;reviews"
export const COMPLETE_PLACE_DETAILS_DATA_FIELDS = "place_id;name;adr_address;types;rating;user_ratings_total;isRecommended;user_favorites_total;formatted_address;place_photos;content;reviews"
export const SEARCH_PLACE_DATA_FIELDS = "place_id;name;place_photo;_dataType;types";
export const MAP_PLACES_CARD_DATA_FIELDS = "place_id;photos_id;name;rating;user_ratings_total;editorial_summary;formatted_address;geometry";

export const BLOG_QUANLITIES = {
  vi: {
    labels: "tất_cả;yêu_thích_nhất;nhiều_bình_luận_nhất",
    values: "all;most_favorites;most_comments"
  },
  en: {
    labels: "all;most_favorites;most_comments",
    values: "all;most_favorites;most_comments"
  }
}
export const BRIEF_BLOG_DATA_FIELDS = "name;avatar;userFavoritesTotal;userCommentsTotal;createdAt;type;author;readTime";
export const BLOG_DETAILS_DATA_FIELDS = "author;content;userFavoritesTotal;userCommentsTotal";
export const SEARCH_BLOG_DATA_FIELDS = "name;avatar";

export const SEARCH_RESULT_TYPE = {
  PLACE: "place",
  BLOG: "blog",
  USER: "user"
}

export const UPDATE_USER_CASES = {
  'default': 'default',
  'addEle:savedPlaces': 'addEle:savedPlaces',
  'removeEle:savedPlaces': 'removeEle:savedPlaces',
  'addEle:follower': 'addEle:follower',
  'removeEle:follower': 'removeEle:follower',
  'addEle:savedBlogs': 'addEle:savedBlogs',
  'removeEle:savedBlogs': 'removeEle:savedBlogs'
}

export const UPDATE_BLOG_BY_CASES = {
  'default': 'default',
  'addEle:reviewIds': 'addEle:reviewIds',
  'removeEle:reviewIds': 'removeEle:reviewIds',
  'inc:userFavoritesTotal': 'inc:userFavoritesTotal',
  'dec:userFavoritesTotal': 'dec:userFavoritesTotal',
  'inc:userCommentsTotal': 'inc:userCommentsTotal',
  'dec:userCommentsTotal': 'dec:userCommentsTotal'
}

export const USER_ROLES = {
  GUEST: 'GUEST',
  MEMBER: 'MEMBER'
}

export const ASYNC_STORAGE_CONSTANT_KEYS = {
  SAVED_BLOG_CONTENT_KEY: '_sbc',
  SAVED_BLOG_FOR_UPLOAD_KEY: '_sbfu'
}