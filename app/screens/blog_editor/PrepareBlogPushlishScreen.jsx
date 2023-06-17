import {
  StyleSheet,
  Text,
  View,
  Image,
  Platform
} from 'react-native'
import React from 'react'
import * as ImagePicker from "expo-image-picker"
import { Buffer } from 'buffer'

import {
  getPlacesAPI,
  postNewBlogAPI
} from 'apis/axios'

import {
  listenEvent,
  getSocket
} from 'apis/socket'

import {
  getCreateBlogEventHandlers
} from 'apis/socket/blog'

import {
  createSearchWithResultList
} from 'hocs/createResultList'

import useTheme from 'customHooks/useTheme'
import { useForm, Controller } from 'react-hook-form'

import {
  callWithGlobalLoading
} from 'utilities/reduxStore'
import StringUtility from 'utilities/string'
import FunctionsUtility from 'utilities/functions'
import AsyncStorageUtility from 'utilities/asyncStorage'

import {
  SEARCH_PLACE_DATA_FIELDS,
  SEARCH_RESULT_TYPE
} from 'utilities/constants'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Ionicons from 'react-native-vector-icons/Ionicons'

import {
  AppText,
  RectangleButton,
  Input,
  Search,
  CircleButton
} from 'components'

import {
  app_c,
  app_sh,
  app_sp
} from 'globals/styles'

import {
  BlogDataProps
} from 'types/index.d.ts'

const MyPlaceSearchResultList = createSearchWithResultList([
  async (text) => {
    let query = `limit=10&skip=0&filter=name:${text}&fields=${SEARCH_PLACE_DATA_FIELDS}`
    let data = await getPlacesAPI(query);
    return data;
  }
]);

/**
 * Lưu ý: Hiện tại thì blog đang được upload theo dạng, chia từng phần ra upload. Cho nên nó sẽ khác với bình thường.
 */

/**
 * Hàm này dùng để mở ImagePicker của Native.
 * @param {ImagePicker.ImagePickerOptions} options 
 * @returns 
 */
async function pickImageFromLibrary(options) {
  try {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if(status !== "granted") {
      return undefined;
    }

    options = Object.assign({}, {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      base64: true
    }, options);

    const result = await ImagePicker.launchImageLibraryAsync(options);

    if(result.canceled) return undefined;
    return result;
  } catch (error) {
    console.log("Image pick result error: ", error.message);
    return undefined;
  }
}

const PrepareBlogPushlishScreen = (props) => {
  /*
    Các thông tin cơ bản của blog. Ngoài ra thì còn có content.
  */
  const [blogInfo, setBlogInfo] = React.useState({
    presentationImage: null,
    type: null,
    mentionedPlaces: [],
    content: null
  });
  const [blogUploadInfo, setBlogUploadInfo] = React.useState({
    isUploading: false,
    firstblogChunk: undefined,
    blogAsString: "",
    index: 0
  });
  const [isPending, startTransition] = React.useTransition();

  const { control, handleSubmit, formState: { errors } } = useForm ({
    defaultValues: {
      name: ""
    }
  });

  const theme = useTheme();
  const types = ["review", "rank", "introduce"];
  const chunkSize = 100 * 1024;
  /*
    Cú pháp đặt tên cho các Socket Event Handler:
    Tên hander (listen hoặc emit) + tên event.
    Event handler là các function dùng

    Ngoài ra thì mình còn có hàm tạo Message Object dùng để gửi đi tới server.
  */
  const [ listenCreateBlog, emitCreateBlog ] = React.useMemo(() => getCreateBlogEventHandlers(getSocket()), []);

  /**
   * Hàm này dùng để upload blog. Trong đó nó sẽ dùng HTTP hoặc Socket để upload.
   * @param {any} data dữ liệu được lấy từ form.
   * @returns 
   */
  const handlePostBlogSubmit = data => {
    let keys = Object.keys(blogInfo)
    if(!data.name) {
      return;
    }

    for(let key of keys)
      if(!blogInfo[key]) {
        return;
      }

    /**
     * @typedef {BlogDataProps}
     */
    let blog = {
      name: data.name,
      avatar: blogInfo.presentationImage,
      userFavoritesTotal: 0,
      userCommentsTotal: 0,
      type: blogInfo.type,
      mentionedPlaces: blogInfo.mentionedPlaces.map(place => place.place_id),
      isApproved: false,
    };

    // Blog này dùng để upload với HTTP
    // let requestBody = {
    //   blog,
    //   content: blogInfo.content
    // };

    // let configs = {
    //   onUploadProgress: function(progressEvent) {
    //     // Do whatever you want with the progress event
    //     const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
    //     console.log(`Upload Progress: ${progress}%`);
    //   }
    // }
    // Dùng HTTP để upload blog content.
    // callWithGlobalLoading(async () => {
    //   return postNewBlogAPI(requestBody, configs)
    //   .then(result => {
    //     console.log("Post blog result: ", result);
    //     AsyncStorageUtility.removeItemAsync("SAVED_BLOG_CONTENT_KEY")
    //     .then(() => {
    //       props.navigation.replace('GroupBottomTab')
    //     })
    //   })
    //   .catch(console.log)
    // })
    // Blog này dùng để upload với Socket
    // AsyncStorageUtility
    // .setItemAsync("SAVED_BLOG_FOR_UPLOAD_KEY", { blog, content: blogInfo.content })
    // .then(() => {
    //   props.navigation.replace('GroupBottomTab')
    // })
    // const buffer = Buffer.from(text.substring(0, chunkSize));
    // const buffer = new Uint8Array(chunkSize)
    // for(let i = 0; i < chunkSize; i++) {
    //   buffer[i] = text.charCodeAt(i)
    // }
    // setBlogUploadInfo(prevState => ({
    //   ...prevState,
    //   firstblogChunk: buffer,
    //   index: 0 + chunkSize,
    //   blogAsString: text
    // }));
    callWithGlobalLoading(async () => {
      await AsyncStorageUtility.setItemAsync("SAVED_BLOG_FOR_UPLOAD_KEY", { blog: blog, content: blogInfo.content });
      props.navigation.navigate('GroupBottomTab',
        {
          screen: 'BlogsNavigator',
          params: {
            screen: 'BlogsScreen',
            params: {
              startUpload: true
            }
          }
        }
      )
    });
  }

  React.useEffect(() => {
    AsyncStorageUtility.getItemAsync("SAVED_BLOG_CONTENT_KEY")
    .then(content => {
      setBlogInfo(prevState => ({...prevState, content}));
    });

    console.log("ListenCreateBlog: ", listenCreateBlog.toString());
  }, []);

  React.useEffect(() => {
    // Nhận message từ server
    let unlisten;
    let blogBufferSize;
    let index = blogUploadInfo.index;
    let isUploadDone = false;
    let buf;

    // const sendChunk = function() {
    //   blogBufferSize = buf.length;
    //   let chunk = buf.subarray(index, Math.min(index + chunkSize, blogBufferSize));
    //   emitCreateBlog(generateCreateBlogMessage({}, chunk));
    //   index += chunkSize;
    //   if(index >= blogBufferSize) isUploadDone = true;
    // }

    // if(blogUploadInfo.firstblogChunk) {
    //   buf = blogUploadInfo.firstblogChunk;
    //   blogBufferSize = blogUploadInfo.blogAsString.length;
      
    //   // Send lần đầu tiên
    //   emitCreateBlog({chunk: buf});
    //   if(index >= blogBufferSize) {
    //     isUploadDone = true;
    //     emitCreateBlog({status: { isUploadDone: true }});
    //   }
    //   console.log("Chunk size: ", chunkSize);
    //   console.log("Buffer size: ", blogBufferSize);
    //   console.log("Index: ", index)
      
    //   console.log("Start listen to Blog Create Event");
    //   unlisten = listenCreateBlog(
    //     function(message, generateMessage) {
    //       console.log("[Blog create] Message from server: ", message);
    //       // Dùng để sử lý khi upload blog.
    //       if(message.status.canUpload && !isUploadDone) {
    //         // buf = new Uint8Array(chunkSize)
    //         let limit = chunkSize + index > blogBufferSize - 1 ? blogBufferSize : chunkSize + index;
    //         buf = Buffer.from(blogUploadInfo.blogAsString.substring(index, limit));
    //         // console.log("Char code at: ", blogUploadInfo.blogAsString.charCodeAt(index));
    //         // for(let i = index; i < limit; i++) {
    //         //   let actualIndex = i - index;
    //         //   buf[actualIndex] = blogUploadInfo.blogAsString.charCodeAt(i)
    //         // }
    //         emitCreateBlog({chunk: buf});
    //         index += chunkSize;
    //         if(index >= blogBufferSize) {
    //           isUploadDone = true;
    //           emitCreateBlog({status: { isUploadDone: true }});
    //         }
    //       }
    //     }
    //   );

    //   return function() {
    //     unlisten();
    //     console.log("Stop listen to Blog Create Event");
    //   }
    // }
  }, [blogUploadInfo.firstblogChunk]);

  return (
    <KeyboardAwareScrollView
      nestedScrollEnabled
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      contentContainerStyle={[app_sp.pt_12]}
      style={{flex: 1, backgroundColor: app_c.HEX.primary}}
    >
      <View style={[styles.container, app_sp.mb_12, {position: 'relative'}]}>
        <View style={app_sp.ph_18}>
          {/* TextInput để nhập name cho blog */}
          <AppText font='h4'>Blog's name</AppText>
          <Controller
            control={control}
            rules={{
              required: {
                value: true,
                message: "You need to let we know your blog's name"
              },
            }}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Enter blog's name here"
                isPassword={false}
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                error={errors.name}
              />
            )}
          />
        </View>

        {/* Button mở ImagePicker trong Native */}
        <View style={[app_sp.mv_12, app_sp.ph_18]}>
          <AppText font='h4' style={app_sp.mb_12}>Blog's image</AppText>
          <RectangleButton
            typeOfButton='highlight'
            overrideShape='rounded_8'
            onPress={() => {
              pickImageFromLibrary({
                allowsEditing: true
              }).then(result => {
                if(result) {
                  console.log("Set image");
                  setBlogInfo(prevState => ({...prevState, presentationImage: `data:image/png;base64,${result.assets[0].base64}`}));
                }
              })
            }}
            defaultColor='type_3'
            style={app_sp.pv_12}
          >
            <AppText>Choose an image</AppText>
          </RectangleButton>
          <View style={[
            styles.presentationImageContainer,
            {
              borderColor: app_c.HEX.ext_third,
              borderWidth: 1
            }
          ]}>
            {/* Nếu như image được set thì nó sẽ hiện image đó lên */}
            {
              blogInfo.presentationImage
              ? <Image style={{width: '100%', aspectRatio: 1, resizeMode: 'contain'}} source={{uri: blogInfo.presentationImage}} />
              : <AppText color='ext_third'>Blog image will show up here</AppText>
            }
          </View>
        </View>

        {/* Type của blog, một blog chỉ được có một type duy nhất, bởi vì chính những blog này đã có kiểu là "Blog du lịch" */}
        <View style={[app_sp.mv_12, app_sp.ph_18]}>
          <AppText font='h4' style={app_sp.mb_12}>Blog's type</AppText>
          <View style={{flexDirection: 'row'}}>
            {
              types.map(type => {
                let isActive = type === blogInfo.type;
                return (
                  <RectangleButton
                    key={type}
                    isActive={isActive}
                    typeOfButton='highlight'
                    overrideShape='capsule'
                    style={app_sp.me_12}
                    onPress={() => { setBlogInfo(prevState => ({...prevState, type: type})) }}
                  >
                    {
                      (isActive, currentLabelStyle) => (
                        <AppText style={currentLabelStyle}>
                          {StringUtility.toTitleCase(type)}
                        </AppText>
                      )
                    }
                  </RectangleButton>
                )
              })
            }
          </View>
        </View>

        {/* Chỗ này dùng để chọn những địa điểm mà người viết nhắc tới trong bài */}
        <AppText font='h4' style={[app_sp.mb_12, app_sp.mh_18]}>Mentioned places</AppText>
        <MyPlaceSearchResultList
          style={app_sp.mh_18}
          placeHolder='Search places...'
          keyExtractor={item => { return item.place_id }}
          resultListPosition='float-top'
          renderResultItem={item => (
            <RectangleButton
              typeOfButton='highlight'
              defaultColor='type2'
              onPress={() => {
                setBlogInfo(prevState => {
                  let m = prevState.mentionedPlaces.slice();
                  m.push({place_id: item.place_id, name: item.name});
                  return {...prevState, mentionedPlaces: m}
                })
              }}
              style={[{justifyContent: 'flex-start'}, app_sp.pv_18]}
            >
              <AppText>{item.name}</AppText>
            </RectangleButton>
          )}
        />
          
        <View style={[{flexDirection: 'row', flexWrap: 'wrap'}, app_sp.mt_12, app_sp.ph_18]}>
          {
            blogInfo.mentionedPlaces.map(place => {
              // let isActive = type === blogInfo.type;
              return (
                <View
                  key={place.place_id}
                  style={[{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: app_c.HEX.ext_third
                  }, app_sh.capsule, app_sp.ps_18]}
                >
                  <AppText>
                    {StringUtility.toTitleCase(place.name)}
                  </AppText>
                  <CircleButton
                    isTransparent
                    typeOfButton="opacity"
                    onPress={() => {
                      setBlogInfo(prevState => {
                        let m = prevState.mentionedPlaces.slice();
                        return {...prevState, mentionedPlaces: FunctionsUtility.removeFrom(
                          m, (ele, index) => ele.place_id, place.place_id
                        )}
                      });
                    }}
                    setIcon={(isActive, currentLabelStyle) => (
                      <Ionicons name="close-outline" size={18} style={currentLabelStyle} />
                    )}
                  />
                </View>
              )
            })
          }
        </View>

        <RectangleButton
          defaultColor='type_4'
          typeOfButton='opacity'
          overrideShape='capsule'
          onPress={() => {
            startTransition(() => {
              handleSubmit(handlePostBlogSubmit)()
            });
          }}
          style={[app_sp.pv_16, app_sp.mh_18]}
        >
          {
            (isActive, currentLabelStyle) => (
              <AppText style={currentLabelStyle}>
                Publish
              </AppText>
            )
          }
        </RectangleButton>
      </View>
    </KeyboardAwareScrollView>
  )
}

export default PrepareBlogPushlishScreen

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  presentationImageContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    ...app_sh.rounded_8,
    ...app_sp.p_18,
    ...app_sp.mt_12
  }
})