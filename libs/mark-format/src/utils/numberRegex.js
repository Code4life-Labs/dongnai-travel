const number = /\d+/;

/**
 * Đây là một function dùng để check xem bên trong có số hay không?
 * Nếu như có thì trả về `true`, ngược lại `false`.
 * @param {string} text Text cần kiểm tra xem có số trong đó hay không?
 * @returns {true | false}
 */
export function hasNumber(text) {
  return number.test(text)
}