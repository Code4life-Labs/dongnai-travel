export type EditorHtmlOptionsProps = {
  editorBackgroundColor: string;
  editorToolsBarBackgroundColor: string;
};

export const injectedJS = `
  const meta = document.createElement('meta');
  meta.setAttribute('content', 'width=width, initial-scale=1.2, maximum-scale=1.5, user-scalable=no');
  meta.setAttribute('name', 'viewport');
  document.getElementsByTagName('head')[0].appendChild(meta);
`;

/**
 * Hàm này tạo ra một chuỗi html để enject vào webview.
 * @param props
 * @returns
 */
export const editorHtmlSource = (props: EditorHtmlOptionsProps) => `
<!DOCTYPE html>
<head>
  <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0">
  <link href="https://cdn.quilljs.com/1.0.0/quill.snow.css" rel="stylesheet">
</head>
<html>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    html, body {
      background-color: transparent;
    }
    .editor {
      margin-bottom: 62px;
      border: none!important;
    }
    #editor-container {
      height: fit-content;
    }
    .ql-editor {
      width: 100%;
      min-height: 100vh;
      background-color: ${props.editorBackgroundColor ? props.editorBackgroundColor : "transparent"}!important;
    }
    .ql-toolbar {
      position: sticky;
      top: 0;
      z-index: 9999;
      background-color: ${props.editorToolsBarBackgroundColor ? props.editorToolsBarBackgroundColor : "transparent"}!important;
    }
    .ql-toolbar.ql-snow {
      outline: none;
      border: none!important;
      border-bottom: 1px solid rgba(38, 38, 38, 0.25)!important;
      background-color: ${props.editorToolsBarBackgroundColor ? props.editorToolsBarBackgroundColor : "transparent"}!important;
    }
  </style>
  <body>
    <div class="editor" id="editor"></div>
  </body>
  <script src="https://cdn.quilljs.com/1.0.0/quill.js"></script>
  <script>
    let toolbarOptions = [
      ['bold', 'italic', 'underline', 'strike', 'link'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'header': [3, 4, 5, 6, false] }]
    ];

    let MAX_IMAGE_SIZE = 2 * 1024 * 1024;
    let globalMessage;
    let customImageHandler = function() {
      const imageInputWrapper = document.createElement("div");
      const imageInput = document.createElement("input");
      const quillRef = this.quill;

      imageInputWrapper.style.display = "none";

      imageInput.setAttribute("type", "file");
      imageInput.setAttribute("accept", "image/*");
      imageInput.dispatchEvent(new MouseEvent("click"));

      imageInputWrapper.appendChild(imageInput);
      document.body.appendChild(imageInputWrapper);

      imageInput.onchange = function(e) {
        let file = imageInput.files[0];
        let fileName = file.name;
        let reader = new FileReader();

        if(file.size > MAX_IMAGE_SIZE) {
          let message = {
            type: "OVER_UPLOADED_IMG_SIZE",
            data: "Size of image must be equal or less than 2mb."
          }
          imageInputWrapper.remove();
          window.ReactNativeWebView.postMessage(JSON.stringify(message));
          return;
        }

        reader.readAsDataURL(file);
        reader.onloadend = function() {
          imageInputWrapper.remove();
          let message = {
            type: "IMG_ADDED"
          }
          window.ReactNativeWebView.postMessage(JSON.stringify(message));
          document.activeElement && document.activeElement.blur();

          imageInputWrapper.remove();
          quillRef.insertEmbed(quillRef.getSelection(true).index, "image", reader.result);
        };
      };
    }

    let editor = new Quill('#editor', {
      theme: 'snow',
      modules: {
        toolbar: {
          container: toolbarOptions,
          handlers: {
            'image': customImageHandler
          }
        }
      }
    });
  </script>
</html>
`;
