import { FILE_URL_RULE } from "./validators";

 import NumberUtility from "./number";
// by Tuan
// Tham khảo tại Issue: https://github.com/FromSunNews/DongNaiTravelApp/issues/18
// Lưu ý: line sẽ thay thế cho string (có thể tương ứng với câu - sentence), tránh nhầm lẫn với keyword

const notAllowCharInTextRegex = /[\~\!\#\$\%\^\&\*\(\)\@\-\\\/\=\+\_\,\.\|]+/g;
const htmlTagTemplate = '[OPEN_TAG_WITH_REGEX](.*?)[CLOSE_TAG]'

/**
 * __Creator__: @NguyenAnhTuan1912
 * 
 * Một chuỗi ngẫu nhiên có dạng là `text + separator + text`, khi truyền vào hàm này thì sẽ nhận về kết quả là
 * một mảng chuỗi chứa các từ (`text`) trong text đó.
 * 
 * @param {string} line - Chuỗi cần cắt.
 * @param {string} separator - Những kí tự ngăn cắt.
 * @returns Một mảng các `text`.
 */
const splitLineBySeperator = function (line, seperator) {
  return line.split(seperator);
};

/**
 * __Creator__: @NguyenAnhTuan1912
 * 
 * Một chuỗi ngẫu nhiên có dạng là `text + separator + text`, khi truyền vào hàm này thì sẽ nhận về kết quả là
 * một mảng chuỗi chứa các từ (`text`) trong text đó. Tuy nhiên nó chỉ có lọc được một loại `separator` duy nhất.
 * 
 * @param {string} line - Chuỗi cần cắt.
 * @param {string} separator - Những kí tự ngăn cắt.
 * @returns Chuỗi ban đầu đã được loại bỏ `separator`.
 */
const removeSeparatorFromLine = function (line, seperator) {
  return line.split(seperator).join('');
};

/**
 * __Creator__: @NguyenAnhTuan1912
 * 
 * * Chữ, câu "sạch" là chữ, câu không chứa các kí tự được định nghĩa trong `Not Allow Character`.
 * 
 * Một chữ "sạch" được truyền vào function này sẽ nhận về một chữ "sạch" đã được ghi hoa chữ cái đầu.
 * Nếu như `text` là một __câu__ thì nó sẽ trả về lại câu đó mà không làm gì cả.
 * 
 * @param {string} text - Chhữ cần ghi hoa.
 * @returns Chuỗi ban đầu đã được loại bỏ `separator`.
 */
const upperCaseFirstLetter = function (text) {
  if(text.split(" ").length > 1) return text;
  return text[0].toUpperCase() + text.slice(1);
};

/**
 * __Creator__: @NguyenAnhTuan1912
 * 
 * Một chuỗi bất kì truyền vào function này sẽ nhận về một chuỗi "sạch". Chuỗi "sạch" là chuỗi
 * không chứa các kí tự được định nghĩa trong `Not Allow Character`. Ví dụ:
 * 
 * * `"   Nguyen -- Anh *(* Tuan"` thành `"Nguyen Anh Tuan"`
 * * `"'   (*&@Nguyen )(*)Anh )(&)*&Tuan'  "` thành `"Nguyen Anh Tuan"`
 * 
 * @param {string} line - Chuỗi bất kì.
 * @returns Chuỗi "sạch đã được loại bỏ tất cả các kí tự trong `Not Allow Character`".
 */
const getPureString = function (line) {
  return line.replaceAll(notAllowCharInTextRegex, ' ').trim();
};

/**
 * __Creator__: @NguyenAnhTuan1912
 * 
 * Một chuỗi bất kì được truyền vào trong function này sẽ nhận về một chuỗi có dạng là `snake_case`, `snake_Case`, `Snake_case`
 * hoặc ... tuỳ theo chuỗi được truyền vào.
 * 
 * @param {string} line - Chuỗi bất kì.
 * @returns Chuỗi có dạng là `snake_case`, `snake_Case`, `Snake_case` hoặc ... tuỳ theo chuỗi được truyền vào.
 */
const toSnakeCase = function (line) {
  let pureString = getPureString(line);
  let result = splitLineBySeperator(pureString, ' ')
    .filter((text) => text !== '')
    .join('_');
  return result;
};

/**
 * __Creator__: @NguyenAnhTuan1912
 * 
 * Một chuỗi bất kì được truyền vào trong function này sẽ nhận về một chuỗi có dạng là `Title_Case`.
 * 
 * @param {string} line - Chuỗi bất kì.
 * @returns Chuỗi có dạng là `Title_Case`.
 */
const toTitleCase = function (line) {
  if(!Boolean(line)) return "";
  let pureString = getPureString(line);
  let result = splitLineBySeperator(pureString, ' ')
    .filter((text) => text !== '')
    .map((text) => upperCaseFirstLetter(text))
    .join(' ');
  return result;
};

/**
 * Function này sẽ tạo ra một regex và sẽ trả về một function để lấy ra text content ở trong thẻ
 * html.
 * @param {string} openTagWithReg Tên thẻ (thẻ mở), bao gồm cả phẩn regex ở trong (nếu có)
 * @param {string} closeTagWithReg Tên thẻ (thẻ đóng), bao gồm cả phẩn regex ở trong (nếu có).
 * @returns {(fullHtmlTag: string) => Array<string>} 
 * 
 * @example
 * ...
 * let getTextContentInHTMLTag = createTextContentInHTMLTagGetter("<span class=\"(locality|region)\">", "<\/span>");
 * let fullHTMLTag = "<span class=\"locality\">Bien Hoa</span>";
 * let matches = getTextContentInHTMLTag(fullHTMLTag);
 * console.log(matches) // OUTPUT: ["Bien Hoa"]
 * ...
 */
const createTextContentInHTMLTagGetter = function (openTagWithReg, closeTagWithReg) {
  let specificHTMLTag = htmlTagTemplate.replace("[OPEN_TAG_WITH_REGEX]", openTagWithReg).replace("[CLOSE_TAG]", closeTagWithReg);
  let specificHTMLTagReg = new RegExp(specificHTMLTag, "g");
  /**
   * @returns {Array<string>}
   */
  return function getTextContentInHTMLTag(fullHtmlTag) {
    if(!fullHtmlTag) return [];
    let matches = [...fullHtmlTag.matchAll(specificHTMLTagReg)];
    return matches.map(match => match[2]);
  }
}

/**
 * Đây là function dùng để test xem `text` có phải là link hay không?
 * Nếu như `text` là link thì trả về `true`, ngược lại là `false`.
 * @param {string} text Text cần kiểm tra.
 * @returns {true | false}
 */
function hasLink(text) {
  return FILE_URL_RULE.test(text);
}

/**
 * Hàm này dùng để reqeat một kí tự hay một chuỗi nào đó.
 * @param {string} str Kí tự hoặc chuỗi muốn lặp.
 * @param {number} times Số lần muốn lặp chuỗi hoặc kí tự đó.
 * @returns 
 */
function repeatStr(str, times) {
  return Array(times).fill(str).join("");
}

/**
 * @typedef GetTextPartsOptionsProps
 * @property {number} max Số chars tối đa của mỗi part.
 * @property {number} divisible Số mà length của part chia hết.
 * @property {boolean} canFillSpace Cho biết là có fill khoảng trắng để cho length của part chia hết cho `divisible` hhay không?
 */

/**
 * Hàm này dùng để lấy ra các phần của một văn bản. Hàm này chủ yếu là dùng với tạo voice bằng Google API (Text To Speech),
 * còn sau này có dùng thêm cho case nào không thì tuỳ.
 * 
 * Bởi vì case tạo voice với Google API là case đầu tiên, cho nên `options` sẽ có một số thông số mặc định như sau:
 * - `max`: (mặc định: 900) là số char mà trong mỗi part sẽ có, bao gồm cả khoảng trắng và dấu `,` và `.`. Ngoài ra thì thông số này chỉ mang
 * tính tương tối. Trong mỗi part, có thể sẽ có nhiều từ nhiều kí tự
 * - `divisible`: (mặc định: 3) là số mà length của part sẽ chia hết. Vì mặc định là dùng để lấy text cho Google Voice, có liên quan tới base64,
 * cho nên là phải chia hết cho 3.
 * - `canFillSpace`: cho biết là có fill khoảng trắng vào part hay không nếu như length của part đó không chia hết cho `divisible`.
 * 
 * Hàm này sẽ hoạt động theo kiểu dò từng word một, không phải là từng letter. Với mỗi step là 10, cho nên mới nói `max` chỉ là thông số tương đổi.
 * Nếu như length của part không chia hết cho `divisible` và `canFillSpace` thì sẽ thêm khoảng trắng vào sao cho length của part
 * chia hết cho `divisible`.
 * 
 * @param {string} text Văn bản muốn tách ra thành nhiều phần.
 * @param {GetTextPartsOptionsProps} options Options dùng để lấy các phần text như mong muốn.
 * @returns 
 */
function getTextParts(text, options) {
  options = Object.assign(
    {
      max: 900,
      divisible: 3,
      canFillSpace: true
    },
    options
  );

  let words = text.split(/[\s|\n]+/);
  let wordsLength = words.length;
  let textParts = [];
    
  let step = 10;
  let start = 0;
  let end = step;
  while(end <= wordsLength) {
    let sub = words.slice(start, end);
    let subLength = sub.join(" ").length;
    if(subLength >= options.max) {
      let filled = subLength % options.divisible !== 0 && repeatStr(" ", (options.divisible - 1) - (subLength % options.divisible));
      if(filled !== false && options.canFillSpace) sub.push(filled);
      textParts.push(sub.join(" "));
      start = end;
    }
    end += step;
    if(end > wordsLength) {
      /** 
       * Trong trường hợp lấy part cho base64. Thì không cần phải quan tâm tới việc length của nó có chia hết cho 3 hay không
       * Bởi vì nó là part cuối rồi cho nên có độ dài bao nhiêu cũng được.
       */
      sub = words.slice(start, wordsLength);
      textParts.push(sub.join(" "));
    }
  }
  return textParts;
}

/**
 * Dùng để tạo random id
 */
const getRandomID = (function() {
  let alphabet = "abcdefghijklmnopqrstuvw0123456789xyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let alphabetN = alphabet.length;
  return function(prefix = "dntrvel", numParts = 3, numCharsInPart = 7) {
    let id = prefix + "-";
    for(let i = 0; i < numParts; i++) {
      for(let j = 0; j < numCharsInPart; j++) {
        let r = NumberUtility.getRandomNumber(alphabetN - 1, 0);
        let letter = alphabet[r];
        id += letter;
      }
      id += "-";
    }

    return id.substring(0, id.length - 1);
  }
})();

const StringUtility = {
  splitLineBySeperator,
  removeSeparatorFromLine,
  upperCaseFirstLetter,
  getPureString,
  toSnakeCase,
  toTitleCase,
  createTextContentInHTMLTagGetter,
  hasLink,
  getTextParts,
  repeatStr,
  getRandomID
};

export default StringUtility;