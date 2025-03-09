import {
  View,
  TextInput,
  Platform,
  Keyboard,
  KeyboardAvoidingView,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import React from "react";
import { router } from "expo-router";
//@ts-ignore
import { deltaToMarkdown } from "quill-delta-to-markdown";
import { WebView } from "react-native-webview";
import markdownToDelta from "markdown-to-quill-delta";
import { MarkdownToQuill } from "md-to-quill-delta";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import Ionicons from "react-native-vector-icons/Ionicons";

// Import components
import { FC } from "@/components";

// Import hooks
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";
import { useBlogsActions } from "@/hooks/useBlog";
import { useStatusActions } from "@/hooks/useStatus";
import { useStateManager } from "@/hooks/useStateManager";

// Import objects
import { BlogManager } from "@/objects/blog";
import { Library } from "@/objects/others/library";

// Import utils
import { MEDIA_FILE_SIZE_LIMIT } from "@/utils/constants";

// Import local state
import { StateManager } from "@/screens/blog-editor/state";

// Import styles
import { Styles } from "@/styles";
import { styles } from "@/screens/blog-editor/styles";

//  Import types
import type { WebViewMessageEvent } from "react-native-webview";
import type { ImagePickerAsset } from "expo-image-picker";

import {
  injectedJS,
  editorHtmlSource,
} from "@/screens/blog-editor/html/text_editor";

type SelectedImageProps = {
  image: ImagePickerAsset;
  index: number;
  removeImageAt(index: number): void;
};

const deltaConverter = new MarkdownToQuill({ debug: false });

function SelectedImage(props: SelectedImageProps) {
  return (
    <View style={[{ position: "relative" }, Styles.spacings.me_8]}>
      <FC.CircleButton
        defaultColor="type_3"
        style={[
          {
            position: "absolute",
            right: 0,
            zIndex: 2,
          },
          Styles.spacings.m_6,
        ]}
        setIcon={(isActive, currentLabelStyle) => (
          <Ionicons style={currentLabelStyle} name="close" size={16} />
        )}
        onPress={() => {
          props.removeImageAt(props.index);
        }}
      />
      <Image
        style={[{ flex: 1, aspectRatio: 1 }, Styles.shapes.rounded_6]}
        source={{ uri: props.image.uri }}
      />
    </View>
  );
}

export default function EditBlogScreen(props: any) {
  const { theme, currentScheme } = useTheme();
  const { language } = useLanguage();
  const statusDispatchers = useStatusActions();
  const blogDispatchers = useBlogsActions();
  const [state, stateFns] = useStateManager(
    StateManager.getInitialState(),
    StateManager.getStateFns
  );

  const webViewRef = React.useRef<WebView | null>(null);
  const textInputRef = React.useRef<TextInput | null>(null);

  const _languageData = language.data["blogEditorScreen"];

  const handlePrepareToPublish = function () {
    blogDispatchers.updatePreparedPublishBlog({
      content: state.content!,
      images: state.images,
    });

    router.navigate({
      pathname: "/blogs/prepare-to-publish",
    });
  };

  const handleWebViewMessage = function (e: WebViewMessageEvent) {
    let message = JSON.parse(e.nativeEvent.data);
    if (message.type === "OVER_UPLOADED_IMG_SIZE") {
      Alert.alert(message.data);
      return;
    }
    if (message.type === "IMG_ADDED") {
      if (textInputRef.current) textInputRef.current.focus();
      Keyboard.dismiss();
      return;
    }

    let delta = message.data;
    let markdown = deltaToMarkdown(delta["ops"]);

    stateFns.setContent(markdown);
    stateFns.setIsContentFromStorage(false);
  };

  // Hàm này dùng để lấy text từ Quill Editor trong webview
  const handleSaveQuillContent = function () {
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(`
        globalMessage = {
          type: "COMPLETE_CONTENT_ADDED",
          data: editor.getContents()
        }
        window.ReactNativeWebView.postMessage(JSON.stringify(globalMessage));
      `);
    }
  };

  const handleClearBlogContentInStorage = function () {
    BlogManager.Storage.removeDraftContent().then((result) => {
      if (webViewRef.current) {
        webViewRef.current.injectJavaScript(`
          editor.setContents({})
        `);
        stateFns.setContent(null);
        stateFns.setIsContentFromStorage(false);
      }
    });
  };

  let extendInjectedJS =
    injectedJS +
    `
    // document.getElementById('editor').addEventListener('DOMNodeInserted', function(e) {
    //   if(e.target.tagName === 'IMG') {
    //     let message = {
    //       type: "IMG_ADDED",
    //       data: undefined
    //     }
    //     window.ReactNativeWebView.postMessage(JSON.stringify(message));
    //     document.activeElement && document.activeElement.blur();
    //   }
    // });
  `;

  React.useEffect(() => {
    // If content is got from Storage and Webview is loaded
    // Set content to Quill Editor
    if (state.content && state.isContentFromStorage && state.isWebviewLoaded) {
      // let reg = /\n(.+)/;
      let delta = JSON.stringify(deltaConverter.convert(state.content));
      if (webViewRef.current) {
        webViewRef.current.injectJavaScript(`
          editor.setContents(${delta})
        `);
      }
    }

    // If content is changed or loaded and it's not from Storage
    // Save content to Storage
    if (state.content && !state.isContentFromStorage) {
      statusDispatchers.setIsLoading(true);

      // Create an array of promises
      const promises = [BlogManager.Storage.saveDraftContent(state.content)];

      // If have image(s) to save
      if (state.images.length > 0) {
        promises.push(BlogManager.Storage.saveDraftImages(state.images));
      }

      Promise.all(promises).then(() => {
        statusDispatchers.setIsLoading(false);
      });
    }

    // If content is empty and it's not from storage
    // Get content from Storage
    if (!state.content && !state.isContentFromStorage) {
      const promises = [
        BlogManager.Storage.getDraftContent(),
        BlogManager.Storage.getDraftImages(),
      ];
      Promise.all(promises).then((data) => {
        if (data) {
          const [content, images] = data;
          stateFns.setContent(content);
          stateFns.setImages(images);
          stateFns.setIsContentFromStorage(true);
        }
      });
    }
  }, [state.content, state.isContentFromStorage, state.isWebviewLoaded]);

  return React.useMemo(
    () => (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, position: "relative" }}
      >
        <FC.AppHeader
          {...props}
          options={{
            canGoBack: true,
            title: "Create blog",
          }}
          setRightPart={() =>
            state.content && (
              <FC.AppText onPress={handlePrepareToPublish}>
                {_languageData.next_to_prepare[language.code]}
              </FC.AppText>
            )
          }
        />
        <WebView
          startInLoadingState
          ref={webViewRef}
          style={{ flex: 1, backgroundColor: "transparent" }}
          injectedJavaScript={extendInjectedJS}
          source={{
            html: editorHtmlSource({
              editorToolsBarBackgroundColor: theme.background,
              editorBackgroundColor: theme.subBackground,
            }),
          }}
          onMessage={handleWebViewMessage}
          onLoadEnd={() => stateFns.setIsWebviewLoaded(true)}
        />
        <TextInput ref={textInputRef} style={{ width: 0, height: 0 }} />
        <BottomSheet
          index={0}
          snapPoints={[64, 264]}
          style={[
            { backgroundColor: theme.background },
            Styles.shapes.ronuded_top_right_12,
            Styles.shapes.ronuded_top_left_12,
            Styles.boxShadows.type_3,
          ]}
          backgroundStyle={{
            flex: 1,
            width: "100%",
            height: 264,
          }}
        >
          <BottomSheetView
            style={[
              {
                flex: 1,
              },
              Styles.spacings.ph_12,
            ]}
          >
            <ScrollView
              horizontal
              style={[
                { flex: 1, backgroundColor: theme.subOutline + "33" },
                Styles.shapes.rounded_12,
                Styles.spacings.pv_8,
                Styles.spacings.ph_8,
              ]}
            >
              {state.images.length > 0 &&
                state.images.map((image, index) => (
                  <SelectedImage
                    key={index}
                    index={index}
                    image={image}
                    removeImageAt={stateFns.removeImageAt}
                  />
                ))}
              <FC.RectangleButton
                isTransparent
                defaultColor="type_5"
                style={[
                  { aspectRatio: 1, borderWidth: 2, borderStyle: "dashed" },
                ]}
                onPress={() => {
                  Library.pickImage({ base64: false }).then((image) => {
                    if (image && !image.canceled) {
                      const asset = image.assets[0];

                      if (asset.fileSize! > MEDIA_FILE_SIZE_LIMIT) {
                        Alert.alert(
                          `Image size must be less than ${MEDIA_FILE_SIZE_LIMIT / 1024 / 1024} Mb`
                        );
                        return;
                      }

                      stateFns.addImage(asset);
                    }
                  });
                }}
              >
                {(isActive, currentLabelStyle) => (
                  <>
                    <FC.AppText
                      weight="bolder"
                      style={[currentLabelStyle, Styles.spacings.me_8]}
                    >
                      {_languageData.add_image_button[language.code]}
                    </FC.AppText>
                    <Ionicons name="image" size={24} />
                  </>
                )}
              </FC.RectangleButton>
            </ScrollView>

            <View style={[styles.buttonsContainer, Styles.spacings.mt_10]}>
              <FC.RectangleButton
                shape="capsule"
                defaultColor="type_1"
                onPress={handleSaveQuillContent}
                style={Styles.spacings.me_8}
              >
                {_languageData.save_to_storage_button[language.code]}
              </FC.RectangleButton>

              <FC.RectangleButton
                type="highlight"
                shape="capsule"
                defaultColor="type_5"
                onPress={handleClearBlogContentInStorage}
              >
                {_languageData.clear_from_storage_button[language.code]}
              </FC.RectangleButton>
            </View>
          </BottomSheetView>
        </BottomSheet>
      </KeyboardAvoidingView>
    ),
    [currentScheme, state.images.length, state.content]
  );
}
