import {
  Text,
  View,
  Image,
  Platform,
  TouchableOpacity,
  ScrollView,
  Pressable,
  ActivityIndicator,
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
import { useStatus } from "@/hooks/useStatus";
import { useStatusActions } from "@/hooks/useStatus";
import { usePlacesState } from "@/hooks/usePlace";
import { useStateManager } from "@/hooks/useStateManager";

// Import objects
import { PlaceManager } from "@/objects/place";
import { BlogManager } from "@/objects/blog";

// Import utils
import { StringUtils } from "@/utils/string";

// Import local state
import { StateManager } from "@/screens/prepare-to-public-blog/state";

// Import stlyes
import { Styles } from "@/styles";
import { styles } from "@/screens/prepare-to-public-blog/styles";

const MyPlaceSearchResultList = createSearchWithResultList([
  async (text) => {
    let data = await PlaceManager.Api.getPlacesAsync({ name: text });
    return data;
  },
]);

async function pickImageFromLibrary(options: ImagePicker.ImagePickerOptions) {
  try {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      return undefined;
    }

    options = Object.assign(
      {},
      {
        mediaTypes: ["images"],
        quality: 1,
        base64: true,
      },
      options
    );

    const result = await ImagePicker.launchImageLibraryAsync(options);

    if (result.canceled) return undefined;
    return result;
  } catch (error: any) {
    console.log("Image pick result error: ", error.message);
    return undefined;
  }
}

export default function PrepareToPublishBlogScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const placesState = usePlacesState();
  const statusDispatchers = useStatusActions();
  const [state, stateFns] = useStateManager(
    StateManager.getInitialState(),
    StateManager.getStateFns
  );

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
  const handlePostBlogSubmit = (data: any) => {
    if (!data.name) {
      return;
    }

    let blog = {
      name: data.name,
      avatar: state.presentationImage,
      userFavoritesTotal: 0,
      userCommentsTotal: 0,
      type: state.type,
      mentionedPlaces: state.mentionedPlaces.map((place) => place._id),
      authorId: user!._id,
      isApproved: false,
    };

    statusDispatchers.setIsLoading(true);
    BlogManager.Storage.savePublishContent({
      blog: blog,
      content: state.content,
    }).then(() => {
      statusDispatchers.setIsLoading(false);
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
          <FC.AppText size="h4">Blog's name</FC.AppText>
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
                    label="Enter blog's name here"
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
            Blog's image
          </FC.AppText>
          <FC.RectangleButton
            shape="rounded_8"
            onPress={() => {
              pickImageFromLibrary({
                allowsEditing: true,
              }).then((result) => {
                if (result) {
                  stateFns.setPresentationImage(
                    `data:image/png;base64,${result.assets[0].base64}`
                  );
                }
              });
            }}
            style={Styles.spacings.pv_12}
          >
            Choose an image
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
                source={{ uri: state.presentationImage }}
              />
            ) : (
              <FC.AppText color="tertiary">
                Blog image will show up here
              </FC.AppText>
            )}
          </View>
        </View>

        {/* Type của blog, một blog chỉ được có một type duy nhất, bởi vì chính những blog này đã có kiểu là "Blog du lịch" */}
        <View style={[Styles.spacings.mv_12, Styles.spacings.ph_18]}>
          <FC.AppText size="h4" style={Styles.spacings.mb_12}>
            Blog's type
          </FC.AppText>
          <View style={{ flexDirection: "row" }}>
            {placesState.placeTypes.map((type) => {
              let isActive = type.value === state.type;
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
                    stateFns.setType(type.value);
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
          Mentioned places
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
            handleSubmit(handlePostBlogSubmit)();
          }}
          style={[Styles.spacings.pv_16, Styles.spacings.mh_18]}
        >
          Publish
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
