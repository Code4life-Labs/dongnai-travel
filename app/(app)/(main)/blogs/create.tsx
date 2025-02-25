import {
  View,
  TextInput,
  Platform,
  Keyboard,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import React from "react";
import { router } from "expo-router";
//@ts-ignore
import { deltaToMarkdown } from "quill-delta-to-markdown";
import { WebView } from "react-native-webview";
import markdownToDelta from "markdown-to-quill-delta";
import { MarkdownToQuill } from "md-to-quill-delta";

// Import components
import { FC } from "@/components";

// Import hooks
import { useTheme } from "@/hooks/useTheme";
import { useStatusActions } from "@/hooks/useStatus";
import { useStateManager } from "@/hooks/useStateManager";

// Import objects
import { BlogManager } from "@/objects/blog";

// Import local state
import { StateManager } from "@/screens/blog-editor/state";

// Import styles
import { Styles } from "@/styles";
import { styles } from "@/screens/blog-editor/styles";

//  Import types
import type { WebViewMessageEvent } from "react-native-webview";

import {
  injectedJS,
  editorHtmlSource,
} from "@/screens/blog-editor/html/text_editor";

const deltaConverter = new MarkdownToQuill({ debug: false });

export default function EditBlogScreen(props: any) {
  const { theme, currentScheme } = useTheme();
  const statusDispatchers = useStatusActions();
  const [state, stateFns] = useStateManager(
    StateManager.getInitialState(),
    StateManager.getStateFns
  );

  const webViewRef = React.useRef<WebView | null>(null);
  const textInputRef = React.useRef<TextInput | null>(null);

  const handleWebViewMessage = (e: WebViewMessageEvent) => {
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

  // Hàm này dùng để ấn next để người dùng sang screen khác để chuẩn bị publish cho blog.
  const handleGetQuillContentPress = () => {
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

  const handleClearBlogContentInStorage = () => {
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
    if (state.content && state.isContentFromStorage && state.isWebviewLoaded) {
      // let reg = /\n(.+)/;
      let delta = JSON.stringify(deltaConverter.convert(state.content));
      if (webViewRef.current) {
        webViewRef.current.injectJavaScript(`
          editor.setContents(${delta})
        `);
      }
    }

    if (state.content && !state.isContentFromStorage) {
      statusDispatchers.setIsLoading(true);
      BlogManager.Storage.saveDraftContent(state.content).then(() => {
        statusDispatchers.setIsLoading(false);
      });
    }

    if (!state.content && !state.isContentFromStorage) {
      BlogManager.Storage.getDraftContent().then((data) => {
        if (data) {
          stateFns.setContent(data);
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
              <FC.AppText
                onPress={() => {
                  router.navigate({
                    pathname: "/blogs/prepare-to-publish",
                  });
                }}
              >
                Next
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
        <View style={styles.buttonsContainer}>
          <FC.RectangleButton
            shape="capsule"
            defaultColor="type_1"
            onPress={handleGetQuillContentPress}
            style={Styles.spacings.me_8}
          >
            Save
          </FC.RectangleButton>

          <FC.RectangleButton
            type="highlight"
            shape="capsule"
            defaultColor="type_4"
            onPress={handleClearBlogContentInStorage}
          >
            Clear
          </FC.RectangleButton>
        </View>
      </KeyboardAvoidingView>
    ),
    [currentScheme, state.content]
  );
}
