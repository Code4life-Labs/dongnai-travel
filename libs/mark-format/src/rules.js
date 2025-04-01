/*
  Đây là một số conventions có bản và quan trọng của TextGenerator. Rule trong conventions giúp detect các MFWText trong văn bản.
  Vì thể không được thay đổi conventions! Nếu như có thay đổi thì sẽ phải đổi luôn code cho nên hạn chế, sau này sẽ
  hỗ trợ thêm về đổi convention.

  Bao gồm các conventions là các quy tắc cho MF, kiểu như MF này sẽ tương ứng với format nào. Có 2 loại conventions:
    - Low mark conventions (Low level MF Conventions)
    - High mark conventions (High level MF Conventions)

  Các conventions này được fix cứng không đổi.

  Cấu trúc của convention:
  [KEY]: {
    RULE: RegExp,
    TYPE: string,
    MF: string
  }

  Trong đó:
    - RULE: là RegExp dùng để check ra các MFWText.
    - TYPE: là loại format, thường thì nó trùng với tên convention.
    - MF: là ký tự cho MF.
*/
const LOW_MARK_CONVENTIONS = {
  BOLD: {
    RULE: '(\\*\\*)([^\\*\\s]+[^\\*]+[^\\*\\s]+|[^\\*\\s]+)\\*\\*',
    TYPE: 'BOLD',
    MF: '**',
  },
  ITALIC: {
    RULE: '(__)([^__\\s]+[^__]+[^__\\s]+|[^__\\s]+)__',
    TYPE: 'ITALIC',
    MF: '__',
  },
  UNDERLINE: {
    RULE: '(~)([^~\\s]+[^~]+[^~\\s]+|[^~\\s]+)~',
    TYPE: 'UNDERLINE',
    MF: '~',
  },
  LINETHROUGH: {
    RULE: '(~~)([^~\\s]+[^~]+[^~\\s]+|[^~\\s]+)~~',
    TYPE: 'LINETHROUGH',
    MF: '~~',
  },
  HIGHLIGHT: {
    RULE: '(==)([^=\\s]+[^=]+[^=\\s]+|[^=\\s]+)==',
    TYPE: 'HIGHLIGHT',
    MF: '==',
  },
  RIGHT_ALIGN: {
    RULE: '^(\\[>r\\])\\s(.+)$',
    TYPE: 'RIGHT_ALIGN',
    MF: '[>r]',
  },
  CENTER_ALIGN: {
    RULE: '^(\\[>c\\])\\s(.+)$',
    TYPE: 'CENTER_ALIGN',
    MF: '[>c]',
  },
  UNORDERED_LIST: {
    RULE: '^(-)\\s(.+)$',
    TYPE: 'UNORDERED_LIST',
    MF: '-',
  },
  ORDERED_LIST: {
    RULE: '^([\\d\\w]+\\.)\\s(.+)$',
    TYPE: 'ORDERED_LIST',
    MF: 'd|w+.',
  },
};

const HIGH_MARK_CONVENTIONS = {
  HEADING_0: {
    RULE: '^(#)\\s(.+)$',
    TYPE: 'HEADING_0',
    MF: '#',
  },
  HEADING_1: {
    RULE: '^(##)\\s(.+)$',
    TYPE: 'HEADING_1',
    MF: '##',
  },
  HEADING_2: {
    RULE: '^(###)\\s(.+)$',
    TYPE: 'HEADING_2',
    MF: '###',
  },
  HEADING_3: {
    RULE: '^(####)\\s(.+)$',
    TYPE: 'HEADING_3',
    MF: '####',
  },
  HEADING_4: {
    RULE: '^(#####)\\s(.+)$',
    TYPE: 'HEADING_4',
    MF: '#####',
  },
  HEADING_5: {
    RULE: '^(######)\\s(.+)$',
    TYPE: 'HEADING_5',
    MF: '######',
  },
  SUB_0: {
    RULE: '^(#~)\\s(.+)$',
    TYPE: 'SUB_0',
    MF: '#~',
  },
  SUB_1: {
    RULE: '^(##~)\\s(.+)$',
    TYPE: 'SUB_1',
    MF: '##~',
  },
  LINK: {
    RULE: "(\\[)(.*?)\\]\\(((http|https):\\/\\/[\\w\\d_\\-\\.]+\\.[\\w\\d]{2,}([:\\d]+)?(\\/[\\w\\d\\-\\._\\?\\,\\'\\/\\\\\\+&%\\$#\\=~]*)?)\\)",
    TYPE: 'LINK',
    MF: '[',
  },
  IMAGE: {
    RULE: "(!\\[)(.*?)\\]\\(((http|https):\\/\\/[\\w\\d_\\-\\.]+\\.[\\w\\d]{2,}([:\\d]+)?(\\/[\\w\\d\\-\\._\\?\\,\\'\\/\\\\\\+&%\\$#\\=~]*)?)\\)",
    TYPE: 'IMAGE',
    MF: '![',
  },
  BLOCKQUOTE: {
    RULE: '^> (.+)',
    TYPE: 'BLOCKQUOTE',
    MF: '>',
  },
};

/*
  All Markdowns rất quan trọng, vì khi thực hiên match(), nó sẽ trả về cơ bản cho mình 3 thứ:
    - Chuỗi match: là chuỗi + MF ở hai đầu.
    - MF: là MF tương ứng.
    - Chuỗi cần format: là chuỗi nằm ở trong MF. (Cái này có thể khác với các MF khác)

  Tuy nhiên thì có một số MF đặc biệt như là Image hay Link thì nó trả cho mình chiều hơn 3 thứ đó.
  Nhưng luôn luôn có Chuỗi match và MF. Cho nên phần MF rất là quan trọng và nó được lấy làm Key cho Rules
  của TextGenerator. Cho nên khi thay đổi bất kì convention nào thì cũng phải thay đổi cái này.
*/
const ALLMFs = '^(\\*\\*)|^(__)|^(~{1,2})|^(==)|^(\\[>r\\])|^(\\[>c\\])|^(-)|^([\\d\\w]+\\.)|^(#{1,2}~)|^(#{1,6})|^(\\[)|^(!\\[)|^(>)';

export {
  LOW_MARK_CONVENTIONS,
  HIGH_MARK_CONVENTIONS,
  ALLMFs
}