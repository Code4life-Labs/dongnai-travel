declare module 'react-native-gifted-chat' {
  import { ComponentType, ReactNode } from 'react';
  import { ViewStyle, TextStyle, ImageStyle } from 'react-native';

  export interface User {
    _id: string | number;
    name?: string;
    avatar?: string | number;
  }

  export interface IMessage {
    _id: string | number;
    text: string;
    createdAt: Date | number;
    user: User;
    image?: string;
    video?: string;
    audio?: string;
    system?: boolean;
    sent?: boolean;
    received?: boolean;
    pending?: boolean;
    quickReplies?: QuickReplies;
    // Additional props for chatbot features
    action?: string;
    data?: any;
  }

  export interface Reply {
    title: string;
    value: string;
    messageId?: any;
  }

  export interface QuickReplies {
    type: 'radio' | 'checkbox';
    values: Reply[];
    keepIt?: boolean;
  }

  export interface GiftedChatProps<TMessage extends IMessage = IMessage> {
    messages?: TMessage[];
    text?: string;
    placeholder?: string;
    user?: User;
    onSend?: (messages: TMessage[]) => void;
    renderBubble?: (props: any) => ReactNode;
    renderAvatar?: (props: any) => ReactNode;
    renderDay?: (props: any) => ReactNode;
    renderInputToolbar?: (props: any) => ReactNode;
    renderComposer?: (props: any) => ReactNode;
    renderSend?: (props: any) => ReactNode;
    renderTime?: (props: any) => ReactNode;
    renderFooter?: (props: any) => ReactNode;
    renderChatFooter?: (props: any) => ReactNode;
    renderCustomView?: (props: any) => ReactNode;
    renderMessage?: (props: any) => ReactNode;
    onPressAvatar?: (user: User) => void;
    onLongPress?: (context: any, message: TMessage) => void;
    inverted?: boolean;
    loadEarlier?: boolean;
    onLoadEarlier?: () => void;
    isLoadingEarlier?: boolean;
    scrollToBottom?: boolean;
    scrollToBottomComponent?: () => ReactNode;
    onQuickReply?: (replies: Reply[]) => void;
    keyboardShouldPersistTaps?: 'never' | 'always' | 'handled';
    alignTop?: boolean;
    isKeyboardInternallyHandled?: boolean;
    bottomOffset?: number;
    minInputToolbarHeight?: number;
    renderQuickReplies?: (props: any) => ReactNode;
    alwaysShowSend?: boolean;
    shouldUpdateMessage?: (props: any, nextProps: any) => boolean;
    listViewProps?: any;
  }

  export class GiftedChat<TMessage extends IMessage = IMessage> extends React.Component<GiftedChatProps<TMessage>> {
    static append<TMessage extends IMessage = IMessage>(
      currentMessages: TMessage[] = [],
      messages: TMessage[],
    ): TMessage[];
  }

  export interface BubbleProps<TMessage extends IMessage = IMessage> {
    currentMessage?: TMessage;
    nextMessage?: TMessage;
    previousMessage?: TMessage;
    user?: User;
    touchableProps?: object;
    renderUsernameOnMessage?: boolean;
    renderMessageImage?: (props: any) => ReactNode;
    renderMessageVideo?: (props: any) => ReactNode;
    renderMessageAudio?: (props: any) => ReactNode;
    renderMessageText?: (props: any) => ReactNode;
    position?: 'left' | 'right';
    optionTitles?: string[];
    containerStyle?: {
      left?: ViewStyle;
      right?: ViewStyle;
    };
    wrapperStyle?: {
      left?: ViewStyle;
      right?: ViewStyle;
    };
    bottomContainerStyle?: {
      left?: ViewStyle;
      right?: ViewStyle;
    };
    tickStyle?: TextStyle;
    containerToNextStyle?: {
      left?: ViewStyle;
      right?: ViewStyle;
    };
    containerToPreviousStyle?: {
      left?: ViewStyle;
      right?: ViewStyle;
    };
    usernameStyle?: TextStyle;
    quickReplyStyle?: ViewStyle;
    onLongPress?: (context: any, message: TMessage) => void;
    onPress?: (context: any) => void;
    renderTime?: (props: any) => ReactNode;
    renderTicks?: (props: any) => ReactNode;
    renderQuickReplies?: (props: any) => ReactNode;
    renderCustomView?: (props: any) => ReactNode;
    isCustomViewBottom?: boolean;
    textStyle?: {
      left?: TextStyle;
      right?: TextStyle;
    };
  }

  export class Bubble<TMessage extends IMessage = IMessage> extends React.Component<BubbleProps<TMessage>> {}
  export class Composer extends React.Component<any, any> {}
  export class Send extends React.Component<any, any> {}
  export class Actions extends React.Component<any, any> {}
}

declare module 'react-native-maps' {
  import React from 'react';
  import { ViewStyle } from 'react-native';

  export interface Region {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  }

  export type MapType = 'standard' | 'satellite' | 'hybrid' | 'terrain';

  export interface MarkerProps {
    coordinate: {
      latitude: number;
      longitude: number;
    };
    title?: string;
    description?: string;
    pinColor?: string;
    children?: React.ReactNode;
    onPress?: () => void;
    tracksViewChanges?: boolean;
    image?: any;
    icon?: { uri: string } | number;
  }

  export interface MapViewProps {
    provider?: 'google';
    style?: ViewStyle;
    initialRegion?: Region;
    region?: Region;
    zoomEnabled?: boolean;
    zoomTapEnabled?: boolean;
    showsUserLocation?: boolean;
    showsMyLocationButton?: boolean;
    showsCompass?: boolean;
    showsScale?: boolean;
    showsTraffic?: boolean;
    zoomControlEnabled?: boolean;
    mapType?: MapType | string;
    mapPadding?: {
      top: number;
      right: number;
      bottom: number;
      left: number;
    };
    onRegionChange?: (region: Region) => void;
    onPress?: () => void;
    children?: React.ReactNode;
  }

  export const Marker: React.ComponentType<MarkerProps>;
  export const Polyline: React.ComponentType<any>;

  const PROVIDER_GOOGLE: 'google';

  export default interface MapView extends React.Component<MapViewProps> {
    fitToCoordinates(coordinates: Array<{
      latitude: number;
      longitude: number;
    }>, options?: { edgePadding?: { top: number; right: number; bottom: number; left: number }; animated?: boolean }): void;
  }
}

export interface LineArrowProps {
  arrowSize?: number;
  arrowWidth?: number;
  arrowColor?: string;
  lineJoin?: 'miter' | 'round' | 'bevel';
  lineCap?: 'butt' | 'round' | 'square';
  strokeWidth?: number;
  strokeColor?: string;
  tappable?: boolean;
  geodesic?: boolean;
}

declare module 'react-native-maps-line-arrow' {
  import React from 'react';
  import { ViewProps } from 'react-native';

  export interface LatLng {
    latitude: number;
    longitude: number;
  }
  
  export interface ArrowedPolylineProps {
    coordinates: LatLng[];
    strokeWidth?: number;
    strokeColor?: string;
    lineJoin?: 'miter' | 'round' | 'bevel';
    lineCap?: 'butt' | 'round' | 'square';
    geodesic?: boolean;
    tappable?: boolean;
    arrowSize?: number;
    arrowColor?: string;
    arrowWidth?: number;
  }

  const ArrowedPolyline: React.FC<ArrowedPolylineProps>;
  export default ArrowedPolyline;
}

declare module '@/hooks/useTheme' {
  export interface ThemeType {
    primary: string;
    onPrimary: string;
    secondary: string;
    onSecondary: string;
    tertiary: string;
    onTertiary: string;
    background: string;
    onBackground: string;
    subBackground: string;
    onSubBackground: string;
    card: string;
    text: string;
    textLight: string;
    border: string;
    error: string;
  }

  export function useTheme(): { theme: ThemeType };
}

declare module '@/components/star_rating/StarRating' {
  interface StarRatingProps {
    rating: number;
    size?: number;
    maxStars?: number;
    disabled?: boolean;
    emptyStar?: string;
    fullStar?: string;
    halfStar?: string;
    starColor?: string;
    emptyStarColor?: string;
  }

  const StarRating: React.FC<StarRatingProps>;
  export default StarRating;
}

// Thêm định nghĩa cho các loại transport modes
export type DirectionModesGCP = 'DRIVE' | 'WALK' | 'BICYCLE' | 'TRANSIT';
export type DirectionModesORS = 'driving-car' | 'foot-walking' | 'cycling-regular' | 'wheelchair';

// Thêm định nghĩa cho các loại thời tiết
export interface WeatherData {
  location?: {
    name: string;
    country: string;
  };
  current: {
    temp: number;
    humidity: number;
    wind_speed: number;
    pressure?: number;
    sunrise?: number;
    sunset?: number;
    rain?: {
      '1h'?: number;
    };
    weather: {
      description: string;
      icon: string;
    }[];
  };
  forecast: any[];
  hourly?: any[];
}

// Thêm định nghĩa chi tiết hơn cho Route
export interface RouteInfo {
  origin: Coordinate;
  destination: Coordinate;
  distance: number;
  duration: number;
  steps: Array<{
    distance: number;
    duration: number;
    instruction: string;
    maneuver?: string;
    start_location: Coordinate;
    end_location: Coordinate;
  }>;
  polyline: string;
  mode: {
    gcp: DirectionModesGCP;
    ors: DirectionModesORS;
  };
}

// Thêm định nghĩa cho các loại địa điểm
export type PlaceType = 
  | 'restaurant'
  | 'food'
  | 'cafe'
  | 'lodging'
  | 'hotel'
  | 'museum' 
  | 'tourist_attraction'
  | 'park'
  | 'natural_feature'
  | 'shopping_mall'
  | 'store'
  | 'establishment';

// Thêm định nghĩa về MapState chi tiết hơn
export interface ExtendedMapState extends MapState {
  weather: WeatherData | null;
  nearbyPlaces: Place[];
  selectedRoute: RouteInfo | null;
  directionModes: {
    gcp: DirectionModesGCP;
    ors: DirectionModesORS;
  };
  mapTypeOptions: string[];
  filterOptions: any;
}

// Định nghĩa cho bottom sheet
declare module '@gorhom/bottom-sheet' {
  import { Component } from 'react';
  
  export interface BottomSheetProps {
    index: number;
    snapPoints: (string | number)[];
    onChange?: (index: number) => void;
    onClose?: () => void;
    enablePanDownToClose?: boolean;
    enableOverDrag?: boolean;
    enableContentPanningGesture?: boolean;
    enableHandlePanningGesture?: boolean;
    handleIndicatorStyle?: ViewStyle;
    handleStyle?: ViewStyle;
    backgroundStyle?: ViewStyle;
    children: React.ReactNode;
  }
  
  export class BottomSheet extends Component<BottomSheetProps> {
    present: () => void;
    close: () => void;
    expand: () => void;
    collapse: () => void;
    snapToIndex: (index: number) => void;
  }
  
  export class BottomSheetModal extends Component<BottomSheetProps> {
    present: () => void;
    close: () => void;
    expand: () => void;
    collapse: () => void;
    snapToIndex: (index: number) => void;
  }
  
  export const BottomSheetScrollView: React.ComponentType<any>;
  export const BottomSheetFlatList: React.ComponentType<any>;
  export const BottomSheetView: React.ComponentType<any>;
  export const BottomSheetModalProvider: React.ComponentType<any>;
}

// Thêm khai báo cho module @mapbox/polyline
declare module '@mapbox/polyline' {
  export function decode(str: string): Array<[number, number]>;
  export function encode(coordinates: Array<[number, number]>): string;
} 