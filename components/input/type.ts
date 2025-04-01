// Import types
import { ViewStyleProps } from "@/types/style";

export type InputProps = {
  label: string;
  hint?: string;
  value?: string;
  containerStyle?: ViewStyleProps;
  isError?: boolean;
  isPassword?: boolean;
  isFromReparePublish?: boolean;
  rightComponent?: JSX.Element;
  handleShowSuggestTitle?: () => void;
  handleHideSuggestTitle?: () => void;
  onBlur?: () => void;
  onChange?: (text: string) => void;
};
