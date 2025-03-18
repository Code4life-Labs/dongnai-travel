/**
 * Function này dùng để config các phương thức tùy chọn cho `prototype` của `Array`.
 */
export default function RunArrayConfigs() {
  /**
   * @param {any} ele Phần tử muốn thêm vào mảng.
   * @param {number} at Vị trí mà muốn thêm `ele` vào `this`.
   */
  Array.prototype.addAt = function(ele, at) {
    this.splice(at, 0, ele);
  };

  /**
   * Tham khảo Chat GPT.
   * @param {Array<any>} fromArray Mảng muốn merge vào.
   */
  Array.prototype.merge = function(fromArray) {
    let mergedArray = [];
    let thisArrayLength = this.length;
    let fromArrayLength = fromArray.length;

    for(let i = 0; i < thisArrayLength || i < fromArrayLength; i++) {
      if(i < thisArrayLength) mergedArray.push(this[i])

      if(i < fromArrayLength) mergedArray.push(fromArray[i])
    }

    return mergedArray;
  };
}