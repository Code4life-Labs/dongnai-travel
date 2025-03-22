const link = /(http|https):\/\/[\w\d_\-\.]+\.[\w\d]{2,}([:\d]+)?(\/[\w\d\-\._\?\,\'\/\\\+&%\$#\=~]*)?/;

/**
 * Đây là function dùng để test xem `text` có phải là link hay không?
 * Nếu như `text` là link thì trả về `true`, ngược lại là `false`.
 * @param {string} text Text cần kiểm tra.
 * @returns {true | false}
 */
export function hasLink(text) {
  return link.test(text);
}

/**
 * Đây là function dùng dể match link trong `text`. Nếu như `text` là link
 * hoặc có chứa link thì sẽ trả về link đó. Còn không thì là `undefined`.
 * @param {string} text Text chứa link hoặc link.
 * @returns 
 */
export function getLinkInText(text) {
  if(!hasLink(text)) return undefined;
  return text.match(link)[0];
}