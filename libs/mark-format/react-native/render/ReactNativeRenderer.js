import TextGenerator from "../../src/TextGenerator.js";
import MFNode from "../../src/MFNode.js";
import { StyleProp, TextStyle, Text, Image, View, Alert } from "react-native";

import { isBreakline, duplicate } from "../../src/utils/string.js";

import { LOW_MARK_CONVENTIONS, HIGH_MARK_CONVENTIONS } from "../../src/rules.js"

import {
  UNORDERED_LIST_BULLETS,
  ORDERED_LIST_BULLETS
} from '../config/toReactNative.config.js'

const BOLD_TYPE = LOW_MARK_CONVENTIONS.BOLD.TYPE;
const ITALIC_TYPE = LOW_MARK_CONVENTIONS.ITALIC.TYPE;
const UNDERLINE_TYPE = LOW_MARK_CONVENTIONS.UNDERLINE.TYPE;
const LINE_THROUGH_TYPE = LOW_MARK_CONVENTIONS.LINETHROUGH.TYPE;
const HIGHLIGHT_TYPE = LOW_MARK_CONVENTIONS.HIGHLIGHT.TYPE;
const RIGHT_ALIGN_TYPE = LOW_MARK_CONVENTIONS.RIGHT_ALIGN.TYPE;
const CENTER_ALIGN_TYPE = LOW_MARK_CONVENTIONS.CENTER_ALIGN.TYPE;
const UNORDERED_LIST_TYPE = LOW_MARK_CONVENTIONS.UNORDERED_LIST.TYPE;
const ORDERED_LIST_TYPE = LOW_MARK_CONVENTIONS.ORDERED_LIST.TYPE;
const HEADING_0_TYPE = HIGH_MARK_CONVENTIONS.HEADING_0.TYPE;
const HEADING_1_TYPE = HIGH_MARK_CONVENTIONS.HEADING_1.TYPE;
const HEADING_2_TYPE = HIGH_MARK_CONVENTIONS.HEADING_2.TYPE;
const HEADING_3_TYPE = HIGH_MARK_CONVENTIONS.HEADING_3.TYPE;
const HEADING_4_TYPE = HIGH_MARK_CONVENTIONS.HEADING_4.TYPE;
const HEADING_5_TYPE = HIGH_MARK_CONVENTIONS.HEADING_5.TYPE;
const SUB_0_TYPE = HIGH_MARK_CONVENTIONS.SUB_0.TYPE;
const SUB_1_TYPE = HIGH_MARK_CONVENTIONS.SUB_1.TYPE;
const LINK_TYPE = HIGH_MARK_CONVENTIONS.LINK.TYPE;
const IMAGE_TYPE = HIGH_MARK_CONVENTIONS.IMAGE.TYPE;
const BLOCKQUOTE_TYPE = HIGH_MARK_CONVENTIONS.BLOCKQUOTE.TYPE;

//Merged style
const BOLD_AND_ITALIC = BOLD_TYPE + "&" + ITALIC_TYPE;
const LIGHT_AND_ITALIC = "LIGHT" + "&" + ITALIC_TYPE;

/**
 * @typedef FormatTypeToStyle
 * @property {boolean | null} isList Có phải là list hay không?
 * @property {string} format Tên format chính là loại format được ở trong `rules.js`.
 * @property {StyleProp<TextStyle>} style Style của Text.
 */

/*
  AppText tạm thời được import vào đây, tuy nhiên thì nó sẽ hoạt động đúng với project này.
  Sau này nó có thể được bỏ đi và thay vào đó là Text của React Native.
*/
import { AppText } from "components/index.js";

/**
 * 
 * @param {{[key: string]: FormatTypeToStyle}} formatTypeToStyle Một mảng chứa các thông tin để convert từ format sang `StyleSheet` của CSS.
 */
function ReactNativeRenderer(formatTypeToStyle) {
  /**
   * @type {Array<FormatTypeToStyle>}
   */
  this.formatTypeToStyle = formatTypeToStyle;
}

////====================================////
//// CÁC HÀM ĐỂ LẤY THÔNG TIN
////====================================////
////
ReactNativeRenderer.prototype.getStyles = function(formats, mergedStylesName) {
  if(!this.formatTypeToStyle) throw new Error("Format type to style table isn't created.");

  let styles = [];

  for(let format of formats) {
    styles.push(this.formatTypeToStyle[format]);
  }

  if(mergedStylesName) {
    if(!this.formatTypeToStyle[mergedStylesName]) throw new Error(`This merged style ${mergedStylesName} is not exist. Please add to Format type to Style Object.`);
    styles.push(this.formatTypeToStyle[mergedStylesName].style);
  }

  return styles;
}

/**
 * __Creator__: @NguyenAnhTuan1912
 * 
 * Phương thức này dùng để tìm trong table FormatTypeToStyle của `ReactNativeRenderer`
 * để tỉm ra một Object FormatTypeToStyle tương ứng.
 * @param {string} format Format trong MFNode.
 * @returns {FormatTypeToStyle}
 */
ReactNativeRenderer.prototype.getFTTS = function(format) {
  if(!this.formatTypeToStyle) throw new Error("Format type to style table isn't created.");

  let ftts = this.formatTypeToStyle[format];
  return ftts;
}
////
////====================================////
////////////////////////////////////////////
////====================================////
////
////
////====================================////
//// CÁC HÀM KIỂM TRA
////====================================////
////
ReactNativeRenderer.prototype.checkBoldWeight = (function() {
  let boldReg = new RegExp(
    BOLD_TYPE + "|" +
    HEADING_0_TYPE + "|" +
    HEADING_1_TYPE + "|" +
    HEADING_2_TYPE + "|" +
    HEADING_3_TYPE + "|" +
    HEADING_4_TYPE + "|" +
    HEADING_5_TYPE + "|"
  );
  /**
   * __Creator__: @NguyenAnhTuan1912
   * 
   * Phương thức này dùng để check xem là trong formats có `BOLD` hay `HEADING_N` không.
   * Bời vì mình đang ở ngữ cảnh là MF + React Native và theo `rules.js` thì `BOLD` và `HEADING_N`
   * có font weigth là BOLD
   * @param {Array<string>} formats 
   * @returns {boolean}
   */
  return function(formats) {
    let formatsInStr = formats.join(" ");

    return boldReg.test(formatsInStr);
  }
})();

ReactNativeRenderer.prototype.checkLightWeight = (function() {
  let lightReg = new RegExp(
    SUB_0_TYPE + "|" +
    SUB_1_TYPE + "|"
  );
  /**
   * __Creator__: @NguyenAnhTuan1912
   * 
   * Phương thức này dùng để check xem là trong formats có `SUB_N` hay không.
   * Bời vì mình đang ở ngữ cảnh là MF + React Native và theo `rules.js` thì `SUB_N`
   * có font weigth là LIGHT
   * @param {Array<string>} formats 
   * @returns {boolean}
   */
  return function(formats) {
    let formatsInStr = formats.join(" ");

    return lightReg.test(formatsInStr);
  }
})();

ReactNativeRenderer.prototype.checkItalicStyle = (function() {
  let italicReg = new RegExp(ITALIC_TYPE);
  /**
   * __Creator__: @NguyenAnhTuan1912
   * 
   * Phương thức này dùng để check xem là trong formats có `ITALIC` hay không?
   * @param {Array<string>} formats 
   * @returns {boolean}
   */
  return function(formats) {
    let formatsInStr = formats.join(" ");

    return italicReg.test(formatsInStr);
  }
})();
////
////====================================////
////////////////////////////////////////////
////====================================////
////
////
////====================================////
//// CÁC HÀM PHỤ KHÁC
////====================================////
////
/**
 * __Creator__: @NguyenAnhTuan1912
 * 
 * Phương thức này sẽ nhận vào một renderer, đồng thời tạo ra một object regexp
 * cho bold và italic và trả về một function.
 * @param {ReactNativeRenderer} renderer React Native Renderer.
 * @returns 
 */
ReactNativeRenderer.prototype.mergeFontWeightWithItalic = function(renderer) {
  // Vì HEADING_N luôn là parent của ITALIC cho nên không cần thêm nó ở đây, mình chỉ replace
  // 2 trường hợp:
  // 1. BOLD hoặc các HEADING_N bọc ITALIC
  // 2. ITALIC bọc BOLD
  let boldAndItalicReg = new RegExp(BOLD_TYPE + "|" + ITALIC_TYPE);
  /**
   * @param {MFNode} mfNode
   */
  return function(mfNode) {
    if(!mfNode.children) return mfNode;
    if(!mfNode.formats) return mfNode;
    
    let children = mfNode.children;

    for(let child of children) {
      let childFormatsInStr = child.formats ? child.formats.join(" ") : "";

      if(
        renderer.checkBoldWeight(mfNode.formats) && renderer.checkItalicStyle(child.formats)
        || renderer.checkBoldWeight(child.formats) && renderer.checkItalicStyle(mfNode.formats)
      ) {
        childFormatsInStr = childFormatsInStr.replace(boldAndItalicReg, BOLD_TYPE + "&" + ITALIC_TYPE)
      } else if(renderer.checkLightWeight(mfNode.formats) && renderer.checkItalicStyle(child.formats)) {
        childFormatsInStr = childFormatsInStr.replace(ITALIC_TYPE, "LIGHT&" + ITALIC_TYPE)
      }
      
      child.setFormats(childFormatsInStr.split(" "));

      if(child.children) renderer.mergeFontWeightWithItalic(renderer)(child);
    }
  }
}
////
////====================================////
////////////////////////////////////////////
////====================================////
////
////
////====================================////
//// CÁC HÀM RENDER VÀ LIÊN QUAN TỚI RENDER
////====================================////
////
/**
 * __Creator__: @NguyenAnhTuan1912
 * 
 * ### ReactNativeRenderer's Core
 * 
 * Phương thức này dùng để render `mf_tree` sang React Native Component.
 * @param {Array<MFNode, string>} mf_tree Cây MF là một mảng chứa các MFNode và string.
 */
ReactNativeRenderer.prototype.render = function(mf_tree) {
  if(!this.formatTypeToStyle) throw new Error("Format type to style table isn't created.");

  /**
   * @type {Array<MFNode, string>}
   */
  let tree = [].concat(mf_tree);
  let RenderedChildren = [];
  let renderFunc = this.renderNode(this);
  // Phương thức này quan trọng bởi vì nó sẽ gộp Weight và Italic lại, bởi vì custom font khi muốn thay đổi
  // Italic và Weight thì nó phải lấy ra được chính xác font có weight và italic đó chẳng hạn như
  // regular-italic, bold-italic, thin-italic...
  // Còn với font mặc định thì dễ rồi.
  let weightAndStyleMerger = this.mergeFontWeightWithItalic(this);

  // Trước khi render thì merge các font weight với font style lại.

  tree.forEach((ele, index) => {
    if(ele instanceof MFNode) {
      weightAndStyleMerger(ele);
      let result = ele.render(renderFunc);
      RenderedChildren.push(result);
    } else {
      RenderedChildren.push(ele);
    }
  });

  return (
    <AppText>
      {
        RenderedChildren
      }
    </AppText>
  );
}

/**
 * __Creator__: @NguyenAnhTuan1912
 * 
 * __Quan trọng__
 * 
 * Phương thức này dùng dể chuyển MFNode sang React Native Component. Phương thức
 * này nhận một `ReactNativeRenderer` Object và trả về một function để render MFNode.
 * @param {ReactNativeRenderer} renderer Đây là một trong những phần từ trong MFTree.
 */
ReactNativeRenderer.prototype.renderNode = function(renderer) {
  /**
   * Bên trong function render này sẽ có nhiều trường hợp để render. Và chính render này cũng là phần cốt lõi
   * để render MFNode ra HTML. Ở đây thì phải render theo quy tắc sole, nghĩa là cứ một value (text thường) thì
   * theo sau phải là Node (đã được style từ các MFWText).
   */

  /**
   * @typedef CallBackProps
   * @property {boolean} isChildrenRenderFirst Render sẽ có thứ tự render. Render child's`values` trước hay `values` của MFNode trước.
   * @property {number} currentSubList SubList hiện tại, mỗi một List thì sẽ có children là sub list item, và trong `values` của list thì chính là các item.
   * @property {string} url Đường dẫn, chỉ này cho các MFWText chứa link.
   * @property {string} _id Id của MFNode
   * @property {Array<string> | Array<MFNode>} values Chứa mọi thứ cần để render.
   * @property {Array<string>} formats
   * @property {Array<MFNode>} children
   */

  /**
   * Đây là phần lõi của function render.
   * @param {CallBackProps} props Các đối số của CallBack.
   * @returns {Node}
   */
  return function({
    values, formats, url, currentSubList, isChildrenRenderFirst, children, _id
  }) {
    let ele;
    let ftts = renderer.getFTTS(formats[0]);
    let styles;
    let eleChildren;

    // Nếu không tìm thấy FTTS Object có nghĩa là một list item.
    if(!ftts) {
      eleChildren = isChildrenRenderFirst ? children.merge(values) : values.merge(children);
      ele = <Text key={_id}>{eleChildren}</Text>
      return ele;
    }

    if(formats.length === 1) {
      styles = ftts.style;
    }
    
    if(formats.length > 1) {
      styles = renderer.getStyles(formats);
      if(renderer.checkBoldWeight(formats) && renderer.checkItalicStyle(formats)) styles = renderer.getStyles(formats, "BOLD&ITALIC");
    }
  
    if(children) {
      eleChildren = isChildrenRenderFirst ? children.merge(values) : values.merge(children)
    } else {
      eleChildren = [values];
    }

    // Do trong AppText chỉ mới setup font size và font weigh, mấy thứ khác chưa setup.
    // Tên switch case t sẽ chia ra như này.
    switch(ftts.format) {
      case BOLD_TYPE:
      case ITALIC_TYPE:
      case BOLD_AND_ITALIC:
      case LIGHT_AND_ITALIC:
      case HEADING_0_TYPE:
      case HEADING_1_TYPE:
      case HEADING_2_TYPE:
      case HEADING_3_TYPE:
      case HEADING_4_TYPE:
      case HEADING_5_TYPE:
      case SUB_0_TYPE:
      case SUB_1_TYPE:
      case UNDERLINE_TYPE:
      case LINE_THROUGH_TYPE:
      case HIGHLIGHT_TYPE:
      case RIGHT_ALIGN_TYPE:
      case CENTER_ALIGN_TYPE: {
        ele = <Text key={_id} style={styles}>{eleChildren}</Text>
        break;
      };

      case UNORDERED_LIST_TYPE: {
        ele = renderer.createUnorderedList(values);
        break;
      };

      case ORDERED_LIST_TYPE: {
        ele = renderer.createOrderedList(values);
        break;
      };

      case LINK_TYPE: {
        ele = <AppText key={_id} hyperLink={url}>{eleChildren}</AppText>
        break;
      };

      case IMAGE_TYPE: {
        ele = <Image key={_id} source={{uri: url}} style={styles} resizeMode="contain" />
        break;
      };

      default: {
        throw new Error("This format is not exist in FormatTypeToStyle Table.");
      }
    }

    return ele;
  }
}

/**
 * __Creator__: @NguyenAnhTuan1912
 * 
 * *__Lưu ý__: Hiện tại thì trong Package MarkFormat vẫn chưa hỗ trợ lấy sub item con
 * cho nên là có thể sẽ có lỗi nếu như có sub item (bởi vì nó cần phải có detect riêng,
 * nghĩa là phải thêm một - hai rules nữa)*
 * 
 * Phương thức này dùng để tạo ra một Unordered List, bởi vì React Native không hỗ trợ
 * cho mình component nào để render Item, cho nên phải dùng cái này.
 * @param {Array<MFNode, string>} mfNodes Một mảng các MFNodes hoặc có string trong đó.
 * @param {number} level Là level của list item, dùng để render các sub list item.
 * @returns {Array<Text>}
 */
ReactNativeRenderer.prototype.createUnorderedList = function(mfNodes, level = 0) {
  let bulletsLength = UNORDERED_LIST_BULLETS.length;
  let bullet = UNORDERED_LIST_BULLETS[level % bulletsLength];
  let itemsLength = mfNodes.length;
  let renderNode = this.renderNode(this);

  let items = mfNodes.map((value, index) => {
    let item = value;
    let keyForItem = value instanceof MFNode ? value._id + index : value + index;

    if(value instanceof MFNode) {
      // item = createBasicHTMLElement(fttc.tagName, value.values, className);
      item = value.render(renderNode);
    }

    return (
      <Text key={keyForItem} style={{width: "100%"}}>
        {/* {index === 0 ? "\n" : ""}{duplicate("\t", level)}{bullet + "\u0020"}{item}{"\n"}{index === itemsLength - 1 ? "\n" : ""} */}
        {duplicate("\t", level)}{bullet + "\u0020"}{item}{index === itemsLength - 1 ? "\n" : ""}
      </Text>
    )
  });

  return items;
}

/**
 * __Creator__: @NguyenAnhTuan1912
 * 
 * *__Lưu ý__: Hiện tại thì trong Package MarkFormat vẫn chưa hỗ trợ lấy sub item con
 * cho nên là có thể sẽ có lỗi nếu như có sub item (bởi vì nó cần phải có detect riêng,
 * nghĩa là phải thêm một - hai rules nữa)*
 * 
 * Phương thức này dùng để tạo ra một Ordered List, bởi vì React Native không hỗ trợ
 * cho mình component nào để render Item, cho nên phải dùng cái này.
 * @param {Array<MFNode, string>} mfNodes Một mảng các MFNodes hoặc có string trong đó.
 * @param {number} level Là level của list item, dùng để render các sub list item.
 * @returns {Array<Text>}
 */
ReactNativeRenderer.prototype.createOrderedList = function(mfNodes, level = 0) {
  let bulletsLength = ORDERED_LIST_BULLETS.length;
  let bulletCollections = ORDERED_LIST_BULLETS[level % bulletsLength];
  let alphatbetLength = 26;
  let itemsLength = mfNodes.length;
  let renderNode = this.renderNode(this);

  let items = mfNodes.map((value, index) => {
    let item = value;
    let keyForItem = value instanceof MFNode ? value.values[0] + index : value + index;
    let bullet = bulletCollections === "numbers"
      ? index + 1
      : index > alphatbetLength
        ? bulletCollections[index % alphatbetLength] + (index + 1) % alphatbetLength
        : bulletCollections[index];

    if(value instanceof MFNode) {
      // item = createBasicHTMLElement(fttc.tagName, value.values, className);
      item = value.render(renderNode);
    }

    return (
      <Text key={keyForItem} style={{width: "100%"}}>
        {/* {index === 0 ? "\n" : ""}{duplicate("\t", level)}{bullet + ".\u0020"}{item}{"\n"}{index === itemsLength - 1 ? "\n" : ""} */}
        {duplicate("\t", level)}{bullet + ".\u0020"}{item}{index === itemsLength - 1 ? "\n" : ""}
      </Text>
    )
  });

  return items;
}
////
////====================================////
////////////////////////////////////////////
////====================================////
////

export default ReactNativeRenderer;