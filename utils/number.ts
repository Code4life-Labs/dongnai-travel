export class NumberUtils {
  static Formatter = new Intl.NumberFormat("de-DE");
  static Metrics = ["N", "Tr", "T", "Unknown"];

  /**
   * __Creator__: @NguyenAnhTuan1912
   *
   * Số bình thường có dạng là `nnnnnnnnn.ddd`, khi truyền vào trong hàm này thì nó sẽ chuyển thành một chuỗi có dạng là
   * `nnn.nnn.nnn,ddd`
   *
   * @param number - Số cần chuyển đổi có dạng là `nnnnnnnnn.ddd`
   * @returns Một chuỗi có dạng là `nnn.nnn.nnn,ddd`.
   */
  static toThousandsSeparatedNumber(number: number) {
    return NumberUtils.Formatter.format(number);
  }

  /**
   * __Creator__: @NguyenAnhTuan1912
   *
   * Số bình thường có dạng là `nnnnnnnnn.ddd`, tuỳ thuộc xem có bao nhiêu chữ số trong số thì chuỗi trả về cũng sẽ khác.
   * VD:
   * * `3000` -> `3 N`
   * * `248907.4872` -> `248 N`
   * * `9877724` -> `9,8 Tr`
   *
   * @param number - Số cần chuyển đổi có dạng là `nnnnnnnnn.ddd`
   * @returns Một chuỗi có dạng là `(n | n,n) (N | Tr | T)`.
   */
  static toMetricNumber(number: number) {
    if (!number || number === 0 || typeof number !== "number") return "0";
    if (number.toString().length < 2) return `${number}`;
    const formatedNumber = NumberUtils.toThousandsSeparatedNumber(number);
    let [firstThreeDigit, ...remainParts] = formatedNumber.split(".");
    if (firstThreeDigit.length === 1 && remainParts[0][0] != "0") {
      firstThreeDigit += "," + remainParts[0][0];
    }

    const remainPartsLength = remainParts.length;

    if (remainPartsLength === 0) return firstThreeDigit;
    return firstThreeDigit + " " + NumberUtils.Metrics[remainPartsLength - 1];
  }

  /**
   * Trả về một số ngầu nhiên nằm trong khoảng `min` - `max`.
   * @param max Số lớn nhất có thể lấy ngẫu nhiên được.
   * @param min Số nhỏ nhất có thể lấy ngẫu nhiên được.
   * @returns
   */
  static getRandomNumber(max = 10, min = 0) {
    return Math.round(Math.random() * (max - min));
  }

  /**
   * Hàm này tính toán việc giảm dữ liệu đi ở một mức nào đó.
   * Tránh việc giảm về quá 0.
   * @param value Số cần giảm
   * @param amount Lượng cần giảm
   * @returns
   */
  static decreaseByAmount(value: number, amount: number) {
    let afterDescrease = value - amount;
    if (afterDescrease >= amount) value -= amount;
    else value = 0;
    return value;
  }
}
