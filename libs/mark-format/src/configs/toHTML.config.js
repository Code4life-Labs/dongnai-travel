import { LOW_MARK_CONVENTIONS, HIGH_MARK_CONVENTIONS } from "../rules.js"

/**
 * @typedef FormatTypeToCss
 * @property {boolean} isList Đây có phải là list hay không?
 * @property {string} format Tên format.
 * @property {string} className CSS Class tương ứng với format đó.
 * @property {string} tagName Tag name tương ứng với format đó.
 */

/**
 * @type {Array<FormatTypeToCss>} formatTypeToCss
 */
const formatTypeToCss = [
  {
    format: LOW_MARK_CONVENTIONS.BOLD.TYPE,
    className: "bold",
    tagName: "span"
  },
  {
    format: LOW_MARK_CONVENTIONS.ITALIC.TYPE,
    className: "italic",
    tagName: "span"
  },
  {
    format: LOW_MARK_CONVENTIONS.UNDERLINE.TYPE,
    className: "underline",
    tagName: "span"
  },
  {
    format: LOW_MARK_CONVENTIONS.LINETHROUGH.TYPE,
    className: "line-through",
    tagName: "span"
  },
  {
    format: LOW_MARK_CONVENTIONS.HIGHLIGHT.TYPE,
    className: "highlight",
    tagName: "span"
  },
  {
    format: LOW_MARK_CONVENTIONS.RIGHT_ALIGN.TYPE,
    className: "text-align-right",
    tagName: "span"
  },
  {
    format: LOW_MARK_CONVENTIONS.CENTER_ALIGN.TYPE,
    className: "text-align-center",
    tagName: "span"
  },
  {
    format: LOW_MARK_CONVENTIONS.UNORDERED_LIST.TYPE,
    typeList: "ul",
    className: "ul-li",
    tagName: "li",
    isList: true
  },
  {
    format: LOW_MARK_CONVENTIONS.ORDERED_LIST.TYPE,
    typeList: "ol",
    className: "ol-li",
    tagName: "li",
    isList: true
  },

  // HIGH LEVEL MARKDOWN
  {
    format: HIGH_MARK_CONVENTIONS.HEADING_0.TYPE,
    className: "h0",
    tagName: "span"
  },
  {
    format: HIGH_MARK_CONVENTIONS.HEADING_1.TYPE,
    className: "h1",
    tagName: "span"
  },
  {
    format: HIGH_MARK_CONVENTIONS.HEADING_2.TYPE,
    className: "h2",
    tagName: "span"
  },
  {
    format: HIGH_MARK_CONVENTIONS.HEADING_3.TYPE,
    className: "h3",
    tagName: "span"
  },
  {
    format: HIGH_MARK_CONVENTIONS.HEADING_4.TYPE,
    className: "h4",
    tagName: "span"
  },
  {
    format: HIGH_MARK_CONVENTIONS.HEADING_5.TYPE,
    className: "h5",
    tagName: "span"
  },
  {
    format: HIGH_MARK_CONVENTIONS.SUB_0.TYPE,
    className: "sub0",
    tagName: "span"
  },
  {
    format: HIGH_MARK_CONVENTIONS.SUB_1.TYPE,
    className: "sub1",
    tagName: "span"
  },
  {
    format: HIGH_MARK_CONVENTIONS.LINK.TYPE,
    className: "link",
    tagName: "a"
  },
  {
    format: HIGH_MARK_CONVENTIONS.IMAGE.TYPE,
    className: "image",
    tagName: "img"
  },
]

export default formatTypeToCss;