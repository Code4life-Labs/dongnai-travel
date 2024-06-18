// by Tuan
// Tham khảo tại Issue: https://github.com/FromSunNews/DongNaiTravelApp/issues/18

const metrics = ['N', 'Tr', 'T', 'Unknown'];

const numberFormatter = new Intl.NumberFormat('de-DE');

/**
 * __Creator__: @NguyenAnhTuan1912
 * 
 * Số bình thường có dạng là `nnnnnnnnn.ddd`, khi truyền vào trong hàm này thì nó sẽ chuyển thành một chuỗi có dạng là
 * `nnn.nnn.nnn,ddd`
 * 
 * @param {number} number - Số cần chuyển đổi có dạng là `nnnnnnnnn.ddd`
 * @returns Một chuỗi có dạng là `nnn.nnn.nnn,ddd`.
 */
const toThousandsSeparatedNumber = function (number) {
  return numberFormatter.format(number);
};

/**
 * __Creator__: @NguyenAnhTuan1912
 * 
 * Số bình thường có dạng là `nnnnnnnnn.ddd`, tuỳ thuộc xem có bao nhiêu chữ số trong số thì chuỗi trả về cũng sẽ khác.
 * VD:
 * * `3000` -> `3 N`
 * * `248907.4872` -> `248 N`
 * * `9877724` -> `9,8 Tr`
 * 
 * @param {number} number - Số cần chuyển đổi có dạng là `nnnnnnnnn.ddd`
 * @returns Một chuỗi có dạng là `(n | n,n) (N | Tr | T)`.
 */
const toMetricNumber = function (number) {
  if(!number || number === 0 || (typeof number !== "number")) return "0";
  if(number.toString().length < 2) return `${number}`;
  const formatedNumber = toThousandsSeparatedNumber(number);
  let [firstThreeDigit, ...remainParts] = formatedNumber.split('.');
  if (firstThreeDigit.length === 1 && remainParts[0][0] != 0) {
    firstThreeDigit += ',' + remainParts[0][0];
  }

  const remainPartsLength = remainParts.length;

  if (remainPartsLength === 0) return firstThreeDigit;
  return firstThreeDigit + ' ' + metrics[remainPartsLength - 1];
};

/**
 * Trả về một số ngầu nhiên nằm trong khoảng `min` - `max`.
 * @param {number} max Số lớn nhất có thể lấy ngẫu nhiên được.
 * @param {number} min Số nhỏ nhất có thể lấy ngẫu nhiên được.
 * @returns 
 */
const getRandomNumber = function(max = 10, min = 0) {
  return Math.round(Math.random() * (max - min));
}

/**
 * Hàm này tính toán việc giảm dữ liệu đi ở một mức nào đó.
 * Tránh việc giảm về quá 0.
 * @param {number} value Số cần giảm
 * @param {number} amount Lượng cần giảm
 * @returns 
 */
const decreaseByAmount = function(value, amount) {
  let afterDescrease = value - amount;
  if(afterDescrease >= amount) value -= amount;
  else value = 0;
  return value;
}

const NumberUtility = {
  toThousandsSeparatedNumber,
  toMetricNumber,
  getRandomNumber,
  decreaseByAmount
};

export default NumberUtility;
