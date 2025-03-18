/**
 * TypeScript definitions cho MessageFeature component
 */

declare module '@/components/message_feature/message-feature' {
  export interface MessageFeatureProps {
    action: string;
    data: any;
  }

  const MessageFeature: React.FC<MessageFeatureProps>;
  export default MessageFeature;
} 