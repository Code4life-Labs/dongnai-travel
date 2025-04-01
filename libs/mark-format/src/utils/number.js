/**
 * Hàm này dùng để lấy ra một số ngẫu nhiên trong khoảng `[min, max]`.
 * @param {number} max Số lớn nhất trong khoảng ngẫu nhiên.
 * @param {number} min Số nhỏ nhất trong khoảng ngẫu nhiên.
 * @returns {number}
 */
export function getRandomNumber(max, min) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}