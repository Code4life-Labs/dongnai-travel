export class DatetimeUtils {
  /**
   * __Creator__: @NguyenAnhTuan1912
   *
   * Nhận vào một năm để check xem năm đó có phải là năm nhuận hay không?
   *
   * @param year - Năm bất kì.
   * @returns Trả về `true` nếu như là `year` là năm nhuận, ngược lại là `false`.
   */
  static isLeapYear(year: number) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  /**
   * __Creator__: @NguyenAnhTuan1912
   *
   * Nhận vào số đại diện của tháng, trả về ngày trong tháng đó.
   *
   * @param month - Năm bất kì.
   * @returns Trả về số ngày trong `month`.
   */
  static getDayInMonth(month: number) {
    if (month < 1 || month > 12) return 0;
    if (month === 2)
      return DatetimeUtils.isLeapYear(new Date().getFullYear()) ? 29 : 28;

    if ((month % 2 === 0 && month < 8) || (month % 2 !== 0 && month > 8))
      return 30;
    return 31;
  }

  /**
   * __Creator__: @NguyenAnhTuan1912
   *
   * Nhận vào `timeStamp`, trả về ngày tháng đầy đủ ở dạng chuỗi.
   *
   * @param timeStamp - Một mốc thời gian tính bằng `mili second`.
   * @returns `Thứ tháng ngày năm giờ múi giờ` ở dạng chuỗi.
   */
  static getDateStr(timeStamp: number) {
    return new Date(timeStamp).toString();
  }

  /**
   * __Creator__: @NguyenAnhTuan1912
   *
   * Nhận vào `timeStamp`, trả về ngày tháng ngắn gọn ở dạng chuỗi.
   *
   * @param timeStamp - Một mốc thời gian tính bằng `mili second`.
   * @returns `Ngày tháng năm giờ` ở dạng chuỗi.
   */
  getDateLocaleStr(timeStamp: number) {
    return new Date(timeStamp).toLocaleString();
  }

  /**
   * __Creator__: @NguyenAnhTuan1912
   *
   * Nhận vào `timeStamp`, trả về một `TimeCollection`.
   * `TimeCollection` sẽ bao gồm:
   * * `dateObj`: object
   * * `hour`: number
   * * `minute`: number
   * * `second`: number
   * * `date`: number
   * * `month`: number
   * * `year`: number
   * * `inLocaleTimeString`: string
   * * `inString`: string
   *
   * @param timeStamp - Một mốc thời gian tính bằng `mili second`.
   * @returns `TimeCollection`.
   */
  static getTimeCollection(timeStamp: number = Date.now()) {
    const dateByTS = new Date(timeStamp);
    return {
      dateObj: dateByTS,
      hour: dateByTS.getHours(),
      minute: dateByTS.getMinutes(),
      second: dateByTS.getSeconds(),
      date: dateByTS.getDate(),
      month: dateByTS.getMonth(),
      year: dateByTS.getFullYear(),
      inLocaleTimeString: dateByTS.toLocaleString(),
      inString: dateByTS.toString(),
    };
  }

  /**
   * __Creator__: @NguyenAnhTuan1912
   *
   * Nhận vào `timeStamp`, trả về `TimeDistance`.
   * `TimeDistance` bao gồm:
   * * `type`: string (`year` | `month` | `day` | `hour` | `minute` | `second`)
   * * `distance`: number
   *
   * @param timeStampThen - Một mốc thời gian "bắt đầu" tính bằng `mili second`.
   * @param timeStampNow - Một mốc thời gian "hiện tại" tính bằng `mili second`.
   * @returns `TimeDistance`.
   */
  static getTimeDistance(
    timeStampThen: number,
    timeStampNow: number = Date.now()
  ) {
    const then = new Date(timeStampThen);
    const now = new Date(timeStampNow);

    const diffInSeconds = Math.floor(
      Math.abs(timeStampNow - timeStampThen) / 1000
    );
    if (diffInSeconds < 60) return { type: "second", distance: diffInSeconds };

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return { type: "minute", distance: diffInMinutes };

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return { type: "hour", distance: diffInHours };

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return { type: "day", distance: diffInDays };

    // Calculate months and years
    const years = now.getFullYear() - then.getFullYear();
    const months = now.getMonth() - then.getMonth() + years * 12;

    if (months < 12) return { type: "month", distance: months };

    const fullYears = Math.floor(months / 12);
    return { type: "year", distance: fullYears };
  }

  static getShortDateStr(
    timeStamp: number,
    options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  ) {
    const date = new Date(timeStamp);
    return date.toLocaleString(undefined, options);
  }

  static toMinute(second: number) {
    return parseInt((second / 60) as any);
  }

  static toHour(second: number) {
    return parseInt((second / 3600) as any);
  }

  static toDay(second: number) {
    return parseInt((second / 86400) as any);
  }
}
