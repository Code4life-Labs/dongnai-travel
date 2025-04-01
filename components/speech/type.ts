// Import types
import type { Audio } from "expo-av";

export type SpeechProps = {
  content?: any;
  text?: string;
  langCode?: string;
};

export type SpeechStateType = {
  gender: boolean;
  base64Audios: {
    f: string;
    m: string;
  } & Record<string, string>;
  isPreparingVoice: boolean;
};

export type NRSpeechInfoType = {
  textParts: Array<string>;
  currentPart: {
    f: number;
    m: number;
  } & Record<string, number>;
  audioVoicePrefix: string;
  previousGender?: boolean;
  previousSoundRef: Audio.Sound | null;
};
