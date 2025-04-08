// Import types
import type { TextInputProps } from "react-native";
import type { ViewStyleProps } from "@/types/style";

export type InputProps = {
  label: string;
  type?: TextInputProps["textContentType"];
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
