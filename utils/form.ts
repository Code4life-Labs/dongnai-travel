export class FormUtils {
  /**
   * __Creator__: @NguyenAnhTuan1912
   *
   * Hàm này dùng để tạo data cho body của repuest. Nó sẽ trả về một body có dạng là
   * `multipart/form-data` và một `headers` có 1 thuộc tính là `'Content-Type': 'multipart/form-data'`.
   * @param data
   * @returns
   */
  static createMultipartFormData(data: any) {
    const formData = new FormData();
    let keys = Object.keys(data);

    for (let key of keys) {
      formData.append(key, data[key]);
    }

    return [
      formData,
      {
        "Content-Type": "multipart/form-data",
      },
    ];
  }
}
