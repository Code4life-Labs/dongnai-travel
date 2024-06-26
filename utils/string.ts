// Import from constants
import { REGEXES } from "@/constants/regexes";

// Import from utils
import { NumberUtils } from "./number";

const htmlTagTemplate = "[OPEN_TAG_WITH_REGEX](.*?)[CLOSE_TAG]";

type GetTextPartsOptions = {
  max: number;
  divisible: number;
  canFillSpace: boolean;
};

export class StringUtils {
  static Alphabet =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  static Characters = "abcdefghijklmnopqrstuvwxyz";
  static Digits = "1234567890";

  /**
   * __Creator__: @NguyenAnhTuan1912
   *
   * Một chuỗi ngẫu nhiên có dạng là `text + separator + text`, khi truyền vào hàm này thì sẽ nhận về kết quả là
   * một mảng chuỗi chứa các từ (`text`) trong text đó.
   *
   * @param line - Chuỗi cần cắt.
   * @param separator - Những kí tự ngăn cắt.
   * @returns Một mảng các `text`.
   */
  static splitLineBySeperator(line: string, seperator: string = "-") {
    return line.split(seperator);
  }

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
  static removeSeparatorFromLine(line: string, seperator: string = "-") {
    return line.split(seperator).join("");
  }

  /**
   * __Creator__: @NguyenAnhTuan1912
   *
   * * Chữ, câu "sạch" là chữ, câu không chứa các kí tự được định nghĩa trong `Not Allow Character`.
   *
   * Một chữ "sạch" được truyền vào function này sẽ nhận về một chữ "sạch" đã được ghi hoa chữ cái đầu.
   * Nếu như `text` là một __câu__ thì nó sẽ trả về lại câu đó mà không làm gì cả.
   *
   * @param text - Chhữ cần ghi hoa.
   * @returns Chuỗi ban đầu đã được loại bỏ `separator`.
   */
  static upperCaseFirstLetter(text: string) {
    if (text.split(" ").length > 1) return text;
    return text[0].toUpperCase() + text.slice(1);
  }

  /**
   * __Creator__: @NguyenAnhTuan1912
   *
   * Một chuỗi bất kì truyền vào function này sẽ nhận về một chuỗi "sạch". Chuỗi "sạch" là chuỗi
   * không chứa các kí tự được định nghĩa trong `Not Allow Character`. Ví dụ:
   *
   * * `"   Nguyen -- Anh *(* Tuan"` thành `"Nguyen Anh Tuan"`
   * * `"'   (*&@Nguyen )(*)Anh )(&)*&Tuan'  "` thành `"Nguyen Anh Tuan"`
   *
   * @param line - Chuỗi bất kì.
   * @returns Chuỗi "sạch đã được loại bỏ tất cả các kí tự trong `Not Allow Character`".
   */
  static getPureString(line: string) {
    return line.replaceAll(REGEXES.NOT_ALLOWED_CHARS, " ").trim();
  }

  /**
   * __Creator__: @NguyenAnhTuan1912
   *
   * Một chuỗi bất kì được truyền vào trong function này sẽ nhận về một chuỗi có dạng là `snake_case`, `snake_Case`, `Snake_case`
   * hoặc ... tuỳ theo chuỗi được truyền vào.
   *
   * @param line - Chuỗi bất kì.
   * @returns Chuỗi có dạng là `snake_case`, `snake_Case`, `Snake_case` hoặc ... tuỳ theo chuỗi được truyền vào.
   */
  static toSnakeCase(line: string) {
    let pureString = StringUtils.getPureString(line);
    const result = StringUtils.splitLineBySeperator(pureString, " ")
      .filter((text) => text !== "")
      .join("_");
    return result;
  }

  /**
   * __Creator__: @NguyenAnhTuan1912
   *
   * Một chuỗi bất kì được truyền vào trong function này sẽ nhận về một chuỗi có dạng là `Title_Case`.
   *
   * @param line - Chuỗi bất kì.
   * @returns Chuỗi có dạng là `Title_Case`.
   */
  static toTitleCase(line: string) {
    if (!Boolean(line)) return "";
    let pureString = StringUtils.getPureString(line);
    const result = StringUtils.splitLineBySeperator(pureString, " ")
      .filter((text) => text !== "")
      .map((text) => StringUtils.upperCaseFirstLetter(text))
      .join(" ");
    return result;
  }

  /**
   * __Creator__: @NguyenAnhTuan1912
   *
   * Function này sẽ tạo ra một regex và sẽ trả về một function để lấy ra text content ở trong thẻ
   * html.
   * @param openTagWithReg Tên thẻ (thẻ mở), bao gồm cả phẩn regex ở trong (nếu có)
   * @param closeTagWithReg Tên thẻ (thẻ đóng), bao gồm cả phẩn regex ở trong (nếu có).
   * @returns
   *
   * @example
   * ...
   * let getTextContentInHTMLTag = createTextContentInHTMLTagGetter("<span class=\"(locality|region)\">", "<\/span>");
   * let fullHTMLTag = "<span class=\"locality\">Bien Hoa</span>";
   * let matches = getTextContentInHTMLTag(fullHTMLTag);
   * console.log(matches) // OUTPUT: ["Bien Hoa"]
   * ...
   */
  static createTextContentInHTMLTagGetter(
    openTagWithReg: string,
    closeTagWithReg: string
  ) {
    let specificHTMLTag = htmlTagTemplate
      .replace("[OPEN_TAG_WITH_REGEX]", openTagWithReg)
      .replace("[CLOSE_TAG]", closeTagWithReg);
    let specificHTMLTagReg = new RegExp(specificHTMLTag, "g");

    return function getTextContentInHTMLTag(fullHtmlTag: string) {
      if (!fullHtmlTag) return [];
      let matches = [...fullHtmlTag.matchAll(specificHTMLTagReg)];
      return matches.map((match) => match[2]);
    };
  }

  /**
   * Đây là function dùng để test xem `text` có phải là link hoặc chứa link hay không?
   * Nếu như `text` là link thì trả về `true`, ngược lại là `false`.
   * @param text Text cần kiểm tra.
   * @returns
   */
  static hasLink(text: string) {
    return REGEXES.URL.test(text);
  }

  /**
   * Hàm này dùng để reqeat một kí tự hay một chuỗi nào đó.
   * @param char Kí tự hoặc chuỗi muốn lặp.
   * @param times Số lần muốn lặp chuỗi hoặc kí tự đó.
   * @returns
   */
  static repeat(char: string, times: number) {
    return Array(times).fill(char).join("");
  }

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
   * @param {GetTextPartsOptions} options Options dùng để lấy các phần text như mong muốn.
   * @returns
   */
  static getTextParts(text: string, options: GetTextPartsOptions) {
    options = Object.assign(
      {
        max: 900,
        divisible: 3,
        canFillSpace: true,
      },
      options
    );

    let words = text.split(/[\s|\n]+/);
    let wordsLength = words.length;
    let textParts = [];

    let step = 10;
    let start = 0;
    let end = step;
    while (end <= wordsLength) {
      let sub = words.slice(start, end);
      let subLength = sub.join(" ").length;
      if (subLength >= options.max) {
        let filled =
          subLength % options.divisible !== 0 &&
          StringUtils.repeat(
            " ",
            options.divisible - 1 - (subLength % options.divisible)
          );
        if (filled !== false && options.canFillSpace) sub.push(filled);
        textParts.push(sub.join(" "));
        start = end;
      }
      end += step;
      if (end > wordsLength) {
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

  static getRandomID(prefix = "dntrvel", numParts = 3, numCharsInPart = 7) {
    const alphabetN = StringUtils.Alphabet.length;
    let id = prefix + "-";
    for (let i = 0; i < numParts; i++) {
      for (let j = 0; j < numCharsInPart; j++) {
        let r = NumberUtils.getRandomNumber(alphabetN - 1, 0);
        let letter = StringUtils.Alphabet[r];
        id += letter;
      }
      id += "-";
    }

    return id.substring(0, id.length - 1);
  }
}
