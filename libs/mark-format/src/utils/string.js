const breakline = /[\r\n]+/g;
const breakline_non_g = /[\r\n]+/;

/**
 * __Creator__: @NguyenAnhTuan1912
 * 
 * Phương thức này dùng dể check xem `text` có chứa ký tự `\r` hoặc `\n` hoặc cả `\r\n` không?
 * @param {*} text Chuỗi chứa `\r` hoặc `\n` hoặc cả `\r\n`.
 */
export function isBreakline(text) {
  return breakline_non_g.test(text);
}

/**
 * __Creator__: @NguyenAnhTuan1912
 * 
 * Phương thức này dùng để đếm xem bên trong `text` có bao nhiêu ký tự `\r`, `\n`.
 * Thường thì `text` chỉ chứa các ký tự `\r` hoặc `\n` hoặc cả `\r\n`.
 * @param {string} text Chuỗi chứa `\r` hoặc `\n` hoặc cả `\r\n`.
 * @returns {number}
 */
export function getNumberOfBreakline(text) {
  return text.match(breakline).length;
}

/**
 * __Creator__: @NguyenAnhTuan1912
 * 
 * Phương thức này dùng để duplicate (sao chép) một `str` nào đó
 * thành một chuỗi có nhiều `str`
 * @param {string} str Chuỗi hoặc kí tự cần duplicate.
 * @param {string} seperator Chuỗi hoặc kí tự tách biệt các `str`.
 * @param {number} n Số lần duplicate mong muốn.
 * @returns {string}
 * 
 * @example
 * 
 * ...
 * let str = "Tuan"
 * let duplicatedStr = duplicate(str, 3);
 * let duplicatedStrWithSpace = duplicate(str, 3, " ");
 * 
 * // Output: "TuanTuanTuan"
 * console.log(duplicatedStr)
 * 
 * // Output: "Tuan Tuan Tuan"
 * console.log(duplicatedStrWithSpace)
 * ...
 */
export function duplicate(str, n, seperator) {
  let result = "";
  for(let i = 0; i < n; i++) {
    result += str;
    if(seperator && i < n - 1) result += seperator;
  }
  return result;
}