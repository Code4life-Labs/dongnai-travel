import { View, Text, ViewProps } from "react-native";
import React from "react";
import Ionicons from "react-native-vector-icons/Ionicons";

// Import components
import AppText from "../app_text";
import RectangleButton from "../buttons/RectangleButton";

// Import objects
import { TextManager } from "@/objects/text";

// Import hooks
import { useAudio } from "@/hooks/useAudio";
import { useLanguage } from "@/hooks/useLanguage";

// Import utils
import { StringUtils } from "@/utils/string";

// Import styles
import { Styles } from "@/styles";

// Import types
import { SpeechProps, NRSpeechInfoType, SpeechStateType } from "./type";

/**
 * Component này dùng để phát file mp3 cho các mô tả của place hoặc là content của blog.
 * Đương nhiêu là nó chỉ sử dụng trong Place hoặc Blog rồi. Tuy nhiên thì nếu cần trong tương
 * lai component này có thể cho phép custom bên ngoài luôn.
 *
 * Có hỗ trợ 2 giọng đọc là nam và nữ.
 * @param props
 * @returns
 */
export default function Speech({
  content,
  text,
  langCode,
  ...props
}: ViewProps & SpeechProps) {
  const { language } = useLanguage();

  /**
   * (Renderable)
   * Những thông tin của speech mà CẦN phải re-render component mỗi khi có thay đổi.
   */
  const [speechInfo, setSpeechInfo] = React.useState<SpeechStateType>({
    // Giọng đọc nam hoặc nữ. Nếu là Nữ thì `false`.
    gender: false,
    // Object chứa base64 của audio của nam hoặc nữ.
    base64Audios: {
      f: "",
      m: "",
    },
    isPreparingVoice: false,
  });
  /**
   * (Not renderable)
   * Những thông tin của speech mà KHÔNG cần phải re-render component mỗi khi có thay đổi.
   */
  const nrSpeechInfo = React.useRef<NRSpeechInfoType>({
    textParts: [],
    currentPart: {
      f: 0,
      m: 0,
    },
    audioVoicePrefix:
      langCode || language.code === "vi" ? "VN" : language.code.toUpperCase(),
    previousGender: undefined,
    previousSoundRef: null,
  });

  // const langData = useSelector(selectCurrentLanguage).data?.placeDetailScreen
  const {
    playAudioAsync,
    stopAudioAsync,
    prepareMP3Async,
    prepareTTSAsync,
    loadTTSAsync,
    canPlay,
    sound,
  } = useAudio();

  const _languageData = (language.data as any)["speech"] as any;

  const { setVoice, setBase64Audio, addBase64Audio, setPreparingStatus } =
    React.useMemo(function () {
      return {
        /**
         * Set giới tính cho giọng đọc. Nữ thì `false`, nam thì ngược lại.
         * @param gender
         */
        setVoice(gender: boolean) {
          nrSpeechInfo.current.previousSoundRef = null;
          setSpeechInfo((prevState) => {
            nrSpeechInfo.current.previousGender = prevState.gender;
            let newState = { ...prevState, gender };
            if (Boolean(text)) newState.isPreparingVoice = true;
            return newState;
          });
        },
        /**
         * Hàm này dùng để setup giọng đọc.
         * @param base64Audio Giọng đọc đã được chuyển thành base64.
         * @param gender Giới tính của giọng đọc.
         */
        setBase64Audio(base64Audio: any, gender = "f") {
          setSpeechInfo((prevState) => {
            let { base64Audios } = prevState;
            base64Audios = { ...base64Audios, [gender]: base64Audio };
            return { ...prevState, base64Audios };
          });
        },

        /**
         * Hàm này dùng để thêm base64 audio.
         * @param base64Audio Giọng đọc đã được chuyển thành base64.
         * @param gender Giới tính của giọng đọc.
         */
        addBase64Audio(base64Audio: any, gender = "f") {
          setSpeechInfo((prevState) => {
            let { base64Audios } = prevState;
            let newBase64Audio = base64Audios[gender] + base64Audio;
            base64Audios = { ...base64Audios, [gender]: newBase64Audio };
            return { ...prevState, base64Audios };
          });
        },

        /**
         * Dùng để set lại trạng thái chuẩn bị của voice
         * @param preparingStatus
         */
        setPreparingStatus(preparingStatus: boolean) {
          if (Boolean(text))
            setSpeechInfo((prevState) => ({
              ...prevState,
              isPreparingVoice: preparingStatus,
            }));
        },
      };
    }, []);

  const speechMP3UriObj = content ? content : "";

  React.useEffect(() => {
    let { audioVoicePrefix } = nrSpeechInfo.current;
    // Trường hợp có URI.
    if (Boolean(speechMP3UriObj)) {
      let uri = speechInfo.gender
        ? speechMP3UriObj[`${audioVoicePrefix}_MALE_1`]
        : speechMP3UriObj[`${audioVoicePrefix}_FEMALE_1`];
      prepareMP3Async(uri).then(() => setPreparingStatus(false));
    }

    // Trường hợp có text.
    if (text) {
      if (nrSpeechInfo.current.textParts.length < 1) {
        nrSpeechInfo.current.textParts = StringUtils.getTextParts(text);
      }
      let gender = speechInfo.gender ? "m" : "f";
      let isVoiceGenderChange =
        speechInfo.gender !== nrSpeechInfo.current.previousGender;
      if (!speechInfo.base64Audios[gender]) {
        let data = {
          text: nrSpeechInfo.current.textParts[
            nrSpeechInfo.current.currentPart[gender]
          ],
          lang: speechInfo.gender
            ? `${audioVoicePrefix}_MALE_1`
            : `${audioVoicePrefix}_FEMALE_1`,
        };
        TextManager.Api.getSpeechAsync(data).then((data) => {
          let base64Audio = data;
          console.log("[Init] Create TTS Done!");
          console.log("[Init] Voice Gender: ", gender);
          setBase64Audio(base64Audio, gender);
        });
      } else {
        if (!sound || isVoiceGenderChange) {
          console.log("Preparing audio...");
          console.log("Gender change: ", isVoiceGenderChange);
          console.log("Sound doesn't init: ", !sound);
          prepareTTSAsync(speechInfo.base64Audios[gender]).then(() => {
            console.log("Prepare audio done!");
            setPreparingStatus(false);
          });
        } else {
          console.log("Loading audio...");
          loadTTSAsync(speechInfo.base64Audios[gender]).then(() => {
            console.log("Load audio done!");
          });
        }
      }
    }
  }, [speechMP3UriObj, text, speechInfo.gender, speechInfo.base64Audios]);

  React.useEffect(() => {
    nrSpeechInfo.current.previousSoundRef = sound;
  }, [sound]);

  // Trường hợp có text.
  // Load audio
  React.useEffect(() => {
    let isVoiceGenderChange =
      speechInfo.gender !== nrSpeechInfo.current.previousGender;
    let canSetOnPlaybackStatusUpdateCallBack;

    canSetOnPlaybackStatusUpdateCallBack =
      nrSpeechInfo.current.previousSoundRef &&
      isVoiceGenderChange &&
      Boolean(text);

    // Set một callback để "listen" player theo dõi progress của nó.
    // Nếu như Voice Gender thay đổi thì set một callback mới.
    /**
     * Khi gender thay nhưng sound vẫn chưa kịp thời thay đổi, nên nó sẽ set một callBack mới cho `OnPlaybackStatusUpdate`.
     * Khi đó callBack này sẽ được gọi luôn, và nó sẽ tự động request thêm một phần text nữa.
     *
     * Cho nên bây giờ phải phải thêm một biến nữa để lưu lại ref của sound. Khi gender đổi thì clear cái ref trong biến đó đi,
     * và check cái biến đó còn giữ ref không, nếu không thì không thực thi code trong if (set callBack), ngược lại thì có
     */
    if (canSetOnPlaybackStatusUpdateCallBack) {
      let isRequesting = false;
      let gender = speechInfo.gender ? "m" : "f";
      if (nrSpeechInfo.current.previousGender !== speechInfo.gender)
        nrSpeechInfo.current.previousGender = speechInfo.gender;
      sound.setOnPlaybackStatusUpdate((status) => {
        const { durationMillis, positionMillis } = status as any;
        const percentagePlayed = (positionMillis / durationMillis) * 100;

        // Nếu thoả được 3 ĐK bên dưới thì request thêm Base64 Audio
        if (
          // ĐK 1: Phải phát được hơn 80% audio.
          percentagePlayed > 80 &&
          // ĐK 2: Vẫn còn Part Of Text để request.
          nrSpeechInfo.current.currentPart[gender] <
            nrSpeechInfo.current.textParts.length - 1 &&
          // ĐK 3: Không trong quá trình Request.
          !isRequesting
        ) {
          nrSpeechInfo.current.currentPart[gender]++;
          let { audioVoicePrefix } = nrSpeechInfo.current;
          let data = {
            text: nrSpeechInfo.current.textParts[
              nrSpeechInfo.current.currentPart[gender]
            ],
            lang: speechInfo.gender
              ? `${audioVoicePrefix}_MALE_1`
              : `${audioVoicePrefix}_FEMALE_1`,
          };
          // Bắt đầu request thì cho thằng này là true, lúc đó thì không phải chạy lại code trong if nữa.
          isRequesting = true;
          TextManager.Api.getSpeechAsync(data).then((data) => {
            let base64Audio = data;
            addBase64Audio(base64Audio, gender);
            isRequesting = false;
          });
        }
      });
    }
  }, [sound, speechInfo.gender]);

  let isButtonDisable = !canPlay || speechInfo.isPreparingVoice !== false;

  return (
    <View
      {...props}
      style={[
        {
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        },
        props.style,
      ]}
    >
      <View>
        <AppText size="h3" style={Styles.spacings.mb_6}>
          {_languageData["readStop"][language.code]}
        </AppText>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <RectangleButton
            isActive
            disabled={isButtonDisable}
            type="opacity"
            defaultColor="type_5"
            onPress={() => playAudioAsync()}
            style={[Styles.spacings.me_6]}
            shape="capsule"
          >
            {(isActive, currentLabelStyle) => (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons style={currentLabelStyle} name="play-outline" />
                <AppText style={currentLabelStyle}> / </AppText>
                <Ionicons style={currentLabelStyle} name="pause-outline" />
              </View>
            )}
          </RectangleButton>
          <RectangleButton
            disabled={isButtonDisable}
            type="opacity"
            defaultColor="type_5"
            onPress={stopAudioAsync}
            shape="capsule"
          >
            {(isActive, currentLabelStyle) => (
              <Ionicons style={currentLabelStyle} name="stop-outline" />
            )}
          </RectangleButton>
        </View>
      </View>

      <View>
        <AppText size="h3" style={Styles.spacings.mb_6}>
          {_languageData["voice"][language.code]}
        </AppText>
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
          <RectangleButton
            isActive={!speechInfo.gender}
            disabled={isButtonDisable}
            type="opacity"
            defaultColor="type_5"
            onPress={() => setVoice(false)}
            style={[Styles.spacings.me_6]}
            shape="capsule"
          >
            Female
          </RectangleButton>
          <RectangleButton
            isActive={speechInfo.gender}
            disabled={isButtonDisable}
            type="opacity"
            defaultColor="type_5"
            onPress={() => setVoice(true)}
            shape="capsule"
          >
            Male
          </RectangleButton>
        </View>
      </View>
    </View>
  );
}
