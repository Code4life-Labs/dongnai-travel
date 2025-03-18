import {
  Text,
  View,
  Image,
  Platform,
  TouchableOpacity,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import React from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as ImagePicker from "expo-image-picker";
import { useForm, Controller } from "react-hook-form";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

// Import components
import { FC } from "@/components";

// Import hocs
import { createSearchWithResultList } from "@/hocs/create-result-list";

// Import hooks
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";
import { useBlogs, useBlogDetailsActions } from "@/hooks/useBlog";
import { useLanguage } from "@/hooks/useLanguage";
import { useStatusActions } from "@/hooks/useStatus";
import { usePlacesState } from "@/hooks/usePlace";
import { useStateManager } from "@/hooks/useStateManager";

// Import objects
import { PlaceManager } from "@/objects/place";
import { BlogManager } from "@/objects/blog";
import { Library } from "@/objects/others/library";

// Import utils
import { MEDIA_FILE_SIZE_LIMIT } from "@/utils/constants";
import { StringUtils } from "@/utils/string";

// Import local state
import { StateManager } from "@/screens/prepare-to-public-blog/state";

// Import stlyes
import { Styles } from "@/styles";
import { styles } from "@/screens/prepare-to-public-blog/styles";

// Import types
import type { UploadBlog } from "@/objects/blog/type";

const MyPlaceSearchResultList = createSearchWithResultList([
  async (text) => {
    let data = await PlaceManager.Api.getPlacesAsync({ name: text });
    return data;
  },
]);

export default function PrepareToPublishBlogScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { language } = useLanguage();
  const { blogTypes, preparedPublishBlog } = useBlogs();
  const blogDispatchers = useBlogDetailsActions();
  const statusDispatchers = useStatusActions();
  const [state, stateFns] = useStateManager(
    StateManager.getInitialState(),
    StateManager.getStateFns
  );

  const _languageData = language.data["prepareToPublishBlogScreen"];

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm({
    defaultValues: {
      name: "",
    },
  });

  /**
   * Hàm này dùng để upload blog. Trong đó nó sẽ dùng HTTP hoặc Socket để upload.
   * @param {any} data dữ liệu được lấy từ form.
   * @returns
   */
  const handlePublishBlog = (data: any) => {
    if (!data.name || !user || !preparedPublishBlog) {
      return;
    }

    const formData = new FormData();
    const mentionedPlaceIds = state.mentionedPlaces.map((place) => place._id);
    let index = 0;
    for (const image of preparedPublishBlog.images!) {
      formData.append("images", {
        uri: image.uri,
        type: image.type!,
        mimeType: image.mimeType!,
        name: image.fileName!,
      } as any);
      index++;
    }

    formData.append("name", data.name);
    formData.append("typeId", state.type!);
    formData.append("content", preparedPublishBlog.content);
    formData.append(
      "mentionedPlaces",
      JSON.stringify(mentionedPlaceIds as any)
    );
    formData.append("authorId", user._id);
    formData.append("coverImage", {
      uri: state.presentationImage!.uri,
      type: state.presentationImage!.type!,
      mimeType: state.presentationImage!.mimeType!,
      name: "coverimage-" + state.presentationImage!.fileName!,
    } as any);

    // Upload blog here
    blogDispatchers.uploadBlog({
      metadata: {
        authorId: user._id,
        typeId: state.type!,
        name: data.name,
        content: preparedPublishBlog.content,
        mentionedPlaces: mentionedPlaceIds,
      },
      completeBlog: formData,
    });
  };

  React.useEffect(() => {
    BlogManager.Storage.getPublishContent().then((data) => {
      stateFns.setContent(data);
    });
  }, []);

  return (
    <KeyboardAwareScrollView
      nestedScrollEnabled
      contentContainerStyle={[
        Styles.spacings.pt_12,
        { paddingBottom: 80, paddingTop: 20 },
      ]}
      style={{ flex: 1, backgroundColor: theme.background }}
    >
      <View
        style={[
          styles.container,
          Styles.spacings.mb_12,
          { position: "relative" },
        ]}
      >
        <View style={[Styles.spacings.ph_18, { paddingBottom: 10 }]}>
          {/* TextInput để nhập name cho blog */}
          <FC.AppText size="h4">
            {_languageData.blog_name[language.code]}
          </FC.AppText>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginTop: 15,
            }}
          >
            <View style={{ flex: 1 }}>
              <Controller
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: "You need to let we know your blog's name",
                  },
                }}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <FC.Input
                    label={_languageData.input_blog_name[language.code]}
                    isPassword={false}
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    isError={Boolean(errors.name)}
                    containerStyle={{ marginTop: 0 }}
                    handleShowSuggestTitle={() =>
                      stateFns.setIsShowSuggestTitle(true)
                    }
                    handleHideSuggestTitle={() =>
                      stateFns.setIsShowSuggestTitle(false)
                    }
                    isFromReparePublish={true}
                  />
                )}
              />
              {errors.name && (
                <Text style={styles.textError}>{errors.name?.message}</Text>
              )}
            </View>
            {state.isShowSuggestTitle && (
              <TouchableOpacity
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  height: 40,
                  width: 40,
                  borderRadius: 20,
                  marginLeft: 10,
                  backgroundColor: theme.primary,
                  ...Styles.boxShadows.type_2,
                }}
                onPress={() => {
                  stateFns.setIsShowSuggestTitlePanel(true);
                  if (
                    state.titleArray.length === 0 &&
                    !state.isPendingCallApi
                  ) {
                    stateFns.setIsPendingCallApi(true);
                    BlogManager.Api.postToGetSuggestedTitles({
                      title: getValues("name"),
                      numberOfTitle: 10,
                    }).then((data): any => {
                      stateFns.setTitleArray(data.titleArray);
                      stateFns.setIsShowLoadingTitleArray(true);
                      stateFns.setIsPendingCallApi(false);
                    });
                  }
                }}
              >
                <FontAwesome5
                  name="lightbulb"
                  size={20}
                  color={theme.tertiary}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Button mở ImagePicker trong Native */}
        <View style={[Styles.spacings.mv_12, Styles.spacings.ph_18]}>
          <FC.AppText size="h4" style={Styles.spacings.mb_12}>
            {_languageData.blog_cover[language.code]}
          </FC.AppText>
          <FC.RectangleButton
            shape="rounded_8"
            onPress={() => {
              Library.pickImage({
                base64: false,
                allowsEditing: true,
              }).then((image) => {
                if (image && !image.canceled) {
                  const asset = image.assets[0];

                  if (asset.fileSize! > MEDIA_FILE_SIZE_LIMIT) {
                    Alert.alert(
                      `Image size must be less than ${MEDIA_FILE_SIZE_LIMIT / 1024 / 1024} Mb`
                    );
                    return;
                  }
                  stateFns.setPresentationImage(asset);
                }
              });
            }}
            style={Styles.spacings.pv_12}
          >
            {_languageData.blog_cover_pick_image[language.code]}
          </FC.RectangleButton>
          <View
            style={[
              styles.presentationImageContainer,
              {
                borderColor: theme.outline,
                borderWidth: 1,
              },
            ]}
          >
            {/* Nếu như image được set thì nó sẽ hiện image đó lên */}
            {state.presentationImage ? (
              <Image
                style={{ width: "100%", aspectRatio: 1, resizeMode: "contain" }}
                source={{ uri: state.presentationImage.uri }}
              />
            ) : (
              <FC.AppText color="tertiary">
                {_languageData.blog_cover_image_placeholder[language.code]}
              </FC.AppText>
            )}
          </View>
        </View>

        {/* Type của blog, một blog chỉ được có một type duy nhất, bởi vì chính những blog này đã có kiểu là "Blog du lịch" */}
        <View style={[Styles.spacings.mv_12, Styles.spacings.ph_18]}>
          <FC.AppText size="h4" style={Styles.spacings.mb_12}>
            {_languageData.blog_type[language.code]}
          </FC.AppText>
          <View style={{ flexDirection: "row" }}>
            {blogTypes.map((type) => {
              let isActive = type._id === state.type;
              return (
                <FC.RectangleButton
                  key={type._id}
                  isActive={isActive}
                  defaultColor="type_5"
                  activeColor="type_1"
                  type="highlight"
                  shape="capsule"
                  style={Styles.spacings.me_12}
                  onPress={() => {
                    stateFns.setType(type._id);
                  }}
                >
                  {(isActive, currentLabelStyle) => (
                    <FC.AppText style={currentLabelStyle}>
                      {StringUtils.toTitleCase(type.name)}
                    </FC.AppText>
                  )}
                </FC.RectangleButton>
              );
            })}
          </View>
        </View>

        {/* Chỗ này dùng để chọn những địa điểm mà người viết nhắc tới trong bài */}
        <FC.AppText
          size="h4"
          style={[Styles.spacings.mb_12, Styles.spacings.mh_18]}
        >
          {_languageData.mentioned_places[language.code]}
        </FC.AppText>
        <MyPlaceSearchResultList
          style={Styles.spacings.mh_18}
          placeHolder="Search places..."
          keyExtractor={(item) => {
            return item.place_id;
          }}
          resultListPosition="float-top"
          renderResultItem={(item) => (
            <FC.RectangleButton
              type="highlight"
              defaultColor="type_4"
              onPress={() => {
                stateFns.addMentionedPlaces({ _id: item._id, name: item.name });
              }}
              style={[{ justifyContent: "flex-start" }, Styles.spacings.pv_18]}
            >
              {item.name}
            </FC.RectangleButton>
          )}
        />

        <View
          style={[
            { flexDirection: "row", flexWrap: "wrap" },
            Styles.spacings.mv_12,
            Styles.spacings.ph_18,
          ]}
        >
          {state.mentionedPlaces.map((place) => {
            // let isActive = type === blogInfo.type;
            return (
              <View
                key={place._id}
                style={[
                  {
                    flexDirection: "row",
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: theme.outline,
                  },
                  Styles.shapes.capsule,
                  Styles.spacings.ps_18,
                ]}
              >
                <FC.AppText>{StringUtils.toTitleCase(place.name)}</FC.AppText>
                <FC.CircleButton
                  isTransparent
                  type="opacity"
                  onPress={() => {
                    stateFns.removeMentionedPlaceById(place._id);
                  }}
                  setIcon={<Ionicons name="close-outline" size={18} />}
                />
              </View>
            );
          })}
        </View>

        <FC.RectangleButton
          type="opacity"
          shape="capsule"
          onPress={() => {
            handleSubmit(handlePublishBlog)();
          }}
          style={[Styles.spacings.pv_16, Styles.spacings.mh_18]}
        >
          {_languageData.publish_button[language.code]}
        </FC.RectangleButton>
      </View>

      {/* Suggess title blog */}
      {state.isShowSuggestTitlePanel && (
        <Pressable
          onPress={() => stateFns.setIsShowSuggestTitlePanel(false)}
          style={{
            position: "absolute",
            width: Styles.dimension.screenWidth,
            height: Styles.dimension.screenHeight,
          }}
        >
          <View
            style={{
              ...Styles.boxShadows.type_3,
            }}
          >
            {!state.isShowLoadingTitleArray ? (
              <View style={styles.refreshContainer}>
                <ActivityIndicator size="small" color={theme.tertiary} />
              </View>
            ) : (
              <ScrollView
                nestedScrollEnabled={true}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  ...Styles.spacings.ph_18,
                  height: 300,
                  marginHorizontal: 18,
                  zIndex: 4,
                  backgroundColor: theme.primary,
                  borderRadius: 12,
                  paddingVertical: 20,
                  ...Styles.boxShadows.type_3,
                  marginTop: 110,
                }}
                showsHorizontalScrollIndicator={false}
              >
                {state.titleArray.map((title, index) => {
                  return (
                    <TouchableOpacity
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: index === 0 ? 0 : 10,
                        paddingHorizontal: 8,
                        paddingVertical: 6,
                        marginBottom:
                          index === state.titleArray.length - 1 ? 40 : 0,
                      }}
                      onPress={() => {
                        setValue("name", title);
                        stateFns.setIndexSuggestTitle(index);
                      }}
                    >
                      <FontAwesome5
                        name="lightbulb"
                        size={20}
                        color={theme.tertiary}
                      />
                      <FC.AppText
                        style={{
                          marginLeft: 10,
                        }}
                      >
                        {title}
                      </FC.AppText>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}
          </View>
        </Pressable>
      )}
    </KeyboardAwareScrollView>
  );
}
