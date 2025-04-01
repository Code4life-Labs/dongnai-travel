import React from "react";
import * as FileSystem from "expo-file-system";
import { Audio } from "expo-av";

// Import utils
import { StringUtils } from "@/utils/string";
import { OtherUtils } from "@/utils/other";
import { ValidatorUtils } from "@/utils/validators";

// Import types
import type { AVPlaybackStatus } from "expo-av";

type PlayAudioAsyncFn = () => void;
type StopAudioAsyncFn = () => void;
type PrepareTTSAsyncFn = (audioAsBase64: string) => boolean;
type LoadTTSAsync = (audioAsBase64: string) => boolean;
type PrepareMP3AsyncFn = (url: string) => boolean;

/**
 * Hook này dùng để sử dụng Text to Speech. Trả về 3 hàm (có thể trong tương lai còn nhiều hơn) bao gồm
 * - `playAudioAsync`: dùng để play audio.
 * - `stopAudioAsync`: dùng để stop audio.
 * - `prepareTTSAsync`: dùng để chuẩn bị audio cho Text. Hàm này nhận `audioAsBase64` là một chuỗi base64
 * đã được encode từ một file mp3.
 * @param fileName
 * @example
 * ...
 * // Function này sẽ có phát audio ở trong đó.
 * function ComponentA() {
 *   const {
 *     canPlay, playAudioAsync, stopAudioAsync, prepareTTSAsync
 *   } = useAudio
 * }
 * ...
 */
export function useAudio(fileName = "myspeech") {
  // Thông tin của sound bao gồm có instance để play audio và thông tin cho biết sound có thể được phát hay là không?
  const [soundInfo, setSoundInfo] = React.useState<{
    sound: Audio.Sound | null;
    status: AVPlaybackStatus | null;
    canPlay: boolean;
  }>({
    sound: null,
    status: null,
    canPlay: false,
  });
  const nrSoundInfo = React.useRef({
    isPlaying: false,
    isAppendedNewAudio: false,
    previousPosition: 0,
  });
  const [fileUri, fullFileName] = React.useMemo(() => {
    let fullFileName = `tts_audio_${StringUtils.toSnakeCase(fileName)}.mp3`;
    return [`${FileSystem.documentDirectory}/${fullFileName}`, fullFileName];
  }, [fileName]);

  const createSound = React.useCallback(async (fileUri: string) => {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
    });
    Audio;
    const { sound, status } = await Audio.Sound.createAsync({
      uri: fileUri,
    });
    return { sound, status };
  }, []);

  // Các hàm dùng để play, stop và prepare.
  // Các hàm này đều dùng một biến để kiểm tra xem âm thanh có đang được phát hay không?

  const {
    playAudioAsync,
    stopAudioAsync,
    prepareTTSAsync,
    prepareMP3Async,
    loadTTSAsync,
    clearSoundAsync,
  } = React.useMemo(
    function () {
      let obj = {
        /**
         *
         * @param position Vị trí hiện tại mà player đang phát audio (thời gian)
         * @returns
         */
        async playAudioAsync(position?: number) {
          try {
            if (!soundInfo.sound!!._loaded)
              throw new Error("Sound hasn't been loaded yet.");
            if (nrSoundInfo.current.isPlaying) {
              await soundInfo.sound!!.pauseAsync();
              nrSoundInfo.current.isPlaying = false;
              return;
            }
            console.log("START AUDIO");
            if (position)
              await soundInfo.sound!.setStatusAsync({
                positionMillis: position,
              });
            await soundInfo.sound!.playAsync();
            nrSoundInfo.current.isPlaying = true;
          } catch (error: any) {
            console.error(error.message);
          }
        },

        async stopAudioAsync() {
          try {
            if (!soundInfo.sound!._loaded)
              throw new Error("Sound hasn't been loaded yet.");
            if (nrSoundInfo.current.isPlaying) {
              await soundInfo.sound!.stopAsync();
              console.log("STOP AUDIO");
              nrSoundInfo.current.isPlaying = false;
              return;
            }
          } catch (error: any) {
            console.error(error.message);
          }
        },

        async prepareTTSAsync(audioAsBase64: string) {
          try {
            if (!Boolean(audioAsBase64))
              throw new Error("Audio as base64 is not valid.");
            setSoundInfo((prevState) => {
              if (prevState.canPlay) return { ...prevState, canPlay: false };
              return prevState;
            });
            await FileSystem.writeAsStringAsync(fileUri, audioAsBase64, {
              encoding: FileSystem.EncodingType.Base64,
            });
            const { sound, status } = await createSound(fileUri);
            setSoundInfo({ sound, status, canPlay: true });
            return true;
          } catch (error: any) {
            console.error(error.message);
            return false;
          }
        },

        async loadTTSAsync(audioAsBase64: string) {
          try {
            if (!Boolean(audioAsBase64))
              throw new Error("Audio as base64 is not valid.");
            if (!Boolean(soundInfo.sound!))
              throw new Error("Sound isn't init.");
            console.log("[useAudio] Load more Base64 Audio");
            // await FileSystem.writeAsStringAsync(fileUri, audioAsBase64, {
            //   encoding: FileSystem.EncodingType.Base64
            // });
            nrSoundInfo.current.previousPosition = (
              soundInfo.status as any
            ).positionMillis;
            nrSoundInfo.current.isAppendedNewAudio = true;
            await this.stopAudioAsync();
            await this.prepareTTSAsync(audioAsBase64);
            return true;
          } catch (error: any) {
            console.error(error.message);
            return false;
          }
        },

        async prepareMP3Async(url: string) {
          try {
            if (!ValidatorUtils.isValidFileURL(url))
              throw new Error("This url does not direct to a file.");
            setSoundInfo((prevState) => {
              if (prevState.canPlay) return { ...prevState, canPlay: false };
              return prevState;
            });
            await FileSystem.downloadAsync(url, fileUri);
            const { sound, status } = await createSound(fileUri);
            setSoundInfo({ sound, status, canPlay: true });
            return true;
          } catch (error: any) {
            console.error(error.message);
            return false;
          }
        },

        async clearSoundAsync() {
          try {
            if (!Boolean(soundInfo.sound!))
              throw new Error("Sound isn't init.");
            if (!soundInfo.sound!._loaded)
              throw new Error("Sound hasn't been loaded yet.");
            console.log("Unload sound!");
            setSoundInfo((prevState) => ({ ...prevState, sound: null }));
          } catch (error: any) {
            console.error(error.message);
            return false;
          }
        },
      };
      OtherUtils.autoBind(obj);
      return obj;
    },
    [fileUri, soundInfo.sound!]
  );

  /*
    Dùng React.useEffect để unload sound khi sound cũ thay đổi
    hoặc là unload sound khi component dùng hook này unmount.
  */
  React.useEffect(() => {
    if (nrSoundInfo.current.isAppendedNewAudio) {
      console.log("[useAudio] Load new audio and play!");
      nrSoundInfo.current.isAppendedNewAudio = false;
      playAudioAsync(nrSoundInfo.current.previousPosition + 50);
    }

    return soundInfo.sound!
      ? () => {
          console.log("Unload sound!");
          soundInfo.sound!.unloadAsync();
        }
      : undefined;
  }, [soundInfo.sound!]);

  return {
    sound: soundInfo.sound!,
    canPlay: soundInfo.canPlay,
    playAudioAsync,
    stopAudioAsync,
    prepareTTSAsync,
    prepareMP3Async,
    loadTTSAsync,
    clearSoundAsync,
  };
}
