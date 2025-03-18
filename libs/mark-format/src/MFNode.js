import { getRandomNumber } from "./utils/number";

/**
 * @typedef MFNodeProps
 * @property {Array<string>} values Là một mảng các chuỗi sẽ được format.
 * @property {Array<string> | null} formats Là một mảng các loại formats.
 * @property {Array<MFNodeProps> | null} children Là một mảng các MFNode.
 * @property {(child) => void}
 */

/**
 * __Creator__: @NguyenAnhTuan1912
 * 
 * Đây là một MFNode, nó sẽ chứa các thông tin như là `values`, `formats` và `children`.
 * __MFNode__ được __MFTree__ dùng để render ra formatted text.
 * @param {boolean} isChildrenRenderFirst Cho các renderer biết là nên render phần từ của thằng nào trước (dùng merge). Nếu `isChildrenRenderFirst = true` thì render của `chlidren` trước.
 * @param {Array<string>} values Là một mảng các chuỗi sẽ được format.
 * @param {Array<string> | null} formats Là một mảng các loại formats.
 * @param {Array<MFNode> | null} children Là một mảng các MFNode.
 * @returns {MFNode}
 */
function MFNode(values, formats, children, url, currentSubList, isChildrenRenderFirst) {
	this.values = values;
	if(formats) this.formats = formats;
	if(children) this.children = children;
	if(url) this.url = url;
	if(currentSubList) this.currentSubList = currentSubList;
	if(isChildrenRenderFirst) this.isChildrenRenderFirst = isChildrenRenderFirst;

	this._id = "";
}
////
////====================================////
//// CÁC PHƯƠNG THỨC THÊM DỮ LIỆU CHO THUỘC TÍNH (CHỈ NHỮNG THUỘC TÍNH LÀ ARRAY)
////====================================////
////
/**
 * __Creator__: @NguyenAnhTuan1912
 * 
 * Phương thức này dùng để add child vào trong `children` của `this` object.
 * @param {MFNode} children Là một hoặc nhiều MFNode, Object này sẽ được add vào `children` của `this`.
 */
MFNode.prototype.addChildren = function(children) {
	if(!Array.isArray(this.children)) this.children = [];

	if (Array.isArray(children)) {
		this.children.push(...children);
	} else {
		this.children.push(children);
	}
};

/**
 * __Creator__: @NguyenAnhTuan1912
 * 
 * Phương thức này dùng để add một hay nhiều formats vào trong `formats` của `this` object.
 * @param {Array<string> | string} formats Là kiểu format cần để format cho chữ sau này. Lưu ở trong `formats` của `this`.
 */
MFNode.prototype.addFormats = function(formats) {
	if(!Array.isArray(this.formats)) this.formats = [];

	if (Array.isArray(formats)) {
		this.formats.push(...formats);
	} else {
		this.formats.push(formats);
	}
};

/**
 * __Creator__: @NguyenAnhTuan1912
 * 
 * Phương thức này dùng để thêm một chuỗi cần được format vào trong `values` của `this` object.
 * @param {string} value Là một chuỗi cần được format.
 */
MFNode.prototype.addValue = function(value) {
	this.values.push(value);
};
////
////====================================////
////
////====================================////
////
////
////====================================////
//// CÁC PHƯƠNG THỨC HỖ TRỢ KHÁC
////====================================////
////
/**
 * Hàm này dùng để trả về một ID ngẫu nhiên cho `MFNode`.
 * @returns {string}
 */
MFNode.prototype.createRandomMFNodeID = (function() {
  // ID có 2 phần, tên và ID, tên thì có MFNode, còn id là phần ngẫu nhiên
  let chars = "abcde01fghij23klmno45pqrst67uvwxy89z"
  let seperator = "-";
  let name = "MFNode";

  let chars_length = chars.length;
  let num_of_parts = 2;
  let num_of_chars_in_each_parts = 8;
  let id_length = (num_of_chars_in_each_parts * num_of_parts) + (num_of_parts - 1);
  
  return function() {
    let fullID = name + seperator;
    for(let i = 0; i < id_length; i++) {
      let at = getRandomNumber(chars_length - 1, 0);
      let char = chars[at]
      fullID += char;
      
      if(i !== 0 && i !== id_length - 1 && i % num_of_chars_in_each_parts === 0) fullID += seperator;
    }
    return fullID;
  }
})();
////
////====================================////
////
////====================================////
////
////
////====================================////
//// CÁC PHƯƠNG THỨC SET DỮ LIỆU CHO THUỘC TÍNH
////====================================////
////
/**
 * __Creator__: @NguyenAnhTuan1912
 * 
 * Phương thức này dùng để thay thế một mảng chuỗi cần được format, lúc này `values` sẽ có giá trị mới.
 * @param {Array<string>} values Là một mảng chuỗi cần được format.
 */
MFNode.prototype.setValues = function(values) {
	this.values = values;
};

/**
 * __Creator__: @NguyenAnhTuan1912
 * 
 * Phương thức này dùng để thay thế mảng formats, lúc này `formats` sẽ có giá trị mới.
 * @param {Array<string>} values Là một mảng formats.
 */
MFNode.prototype.setFormats = function(formats) {
	this.formats = formats;
};

/**
 * @typedef CallBackProps
 * @property {boolean} isChildrenRenderFirst
 * @property {number} currentSubList
 * @property {string} url
 * @property {Array<string> | Array<MFNode>} values
 * @property {Array<string>} formats
 * @property {Array<MFNode>} children
 */
////
////====================================////
////
////====================================////
////
////
////====================================////
//// CÁC HÀM RENDER VÀ LIÊN QUAN TỚI RENDER
////====================================////
////
/**
 * __Creator__: @NguyenAnhTuan1912
 * 
 * Phương thức này dùng để render ra một view, html, component.
 * @param {(props: CallBackProps) => Object} callBack Function này chính là function dùng để tạo ra một Object nào đó.
 */
MFNode.prototype.render = function(callBack) {
	/**
	 * @type {CallBackProps}
	 */
	let props = {
		values: this.values,
		formats: this.formats,
		url: this.url,
		currentSubList: this.currentSubList,
		isChildrenRenderFirst: this.isChildrenRenderFirst,
		_id: this._id
	}

	if(this.children) {
		let renderedChild = this.children.map(child => child.render(callBack));
		props.children = renderedChild;
	}

	return callBack(props);
}
  
export default MFNode;