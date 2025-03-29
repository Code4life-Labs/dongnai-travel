export interface SearchResult {
  place_id: string;
  name: string;
  _dataType: string;
  [key: string]: any;
}

export interface SearchScreenProps {
  navigation: {
    goBack: () => void;
    push: (screen: string, params: any) => void;
  };
  theme: {
    background: string;
    onBackground: string;
    outline?: string;
  };
}

export interface PlaceSearchResponse {
  place_id: string;
  name: string;
  _dataType: string;
  [key: string]: any;
} 