import MFNode from './MFNode.js';
// import HTMLRenderer from './render/html/HTMLRenderer.js';
import ReactNativeRenderer from '../react-native/render/ReactNativeRenderer.js';

import { hasLink, getLinkInText } from './utils/linkRegex.js';

import { LOW_MARK_CONVENTIONS } from './rules.js';

/**
 * @typedef RuleProps
 * @property {string} type Kiểu của format, thường thì một MF nó sẽ đại diện cho một format.
 * @property {string} regInStr String regex để match MFWText.
 * @property {string} mf Ký tự MF.
 * @property {RegExp} reg Regex để match MFWText, được tạo từ `regInStr`.
 * @property {RegExp} nonGReg Giống với `reg` nhưng không có G Flag.
 */

/**
 * __Creator__: @NguyenAnhTuan1912
 * 
 * ### Formatted Text Generator's Core
 * 
 * Đây là TextGenerator contructor. TGObject quản lý MFTree, rules, renderer.
 * Có thể gọi object này chính là trung tâm quản lý.
 * @param {Array<RuleProps>} rules Là rule của các MF, các rules này là cơ bản (không được sửa).
 * @param {Array<RegExp>} allMarkdownHeadRegex Các MF gom lại thành Regexp.
 * @param {Array<RegExp>} allRulesRegex Tất cả Regexp của các rules được gom lại.
 * @param {Array<RegExp>} allRulesNonGRegex Giống với `allRulesNonGReg` nhưng không có G Flag.
 * @param {HTMLRenderer | ReactNativeRenderer} renderer 
 */
function TextGenerator(rules, allMarkdownHeadRegex, allRulesRegex, allRulesNonGRegex, renderer) {
  if(rules) this.rules = rules;
  if(allMarkdownHeadRegex) this.allMarkdownHeadRegex = allMarkdownHeadRegex;
  if(allRulesRegex) this.allRulesRegex = allRulesRegex;
  if(allRulesNonGRegex) this.allRulesNonGRegex = allRulesNonGRegex;
  if(renderer) this.renderer = renderer;

  /**
   * @type {Array<MFNode, string>}
   */
  this.mfTree;
}

/*
  Định nghĩa các functionnày dùng để test. Không tạo ra các utils là bởi
  vì đang test dựa trên rule của TextGenerator (this.rule).

  Một số function:
  1. Check xem trong chữ có new line nào hay không? (cái này có thể tách ra utils)
    - Hoạt động ổn.
  - Check xem 
*/

/**
 * __Creator__: @NguyenAnhTuan1912
 * 
 * Phương thức này kiểm tra xem trong `text` có kí tự xuống dòng nào hay không?
 * Hay cũng có nghĩa là check xem có kí tự `\r\n` hoặc `\n` hay không?
 * Nếu như có thì trả về `true` ngược lại là `false`.
 * @param {string} text Chuỗi kí tự cần kiểm tra.
 * @returns {boolean}
 */
TextGenerator.prototype.newLineStr = function(text) {
  return (/[\r\n]+/).test(text);
}

/**
 * __Creator__: @NguyenAnhTuan1912
 * 
 * Phương thức này nhận vào key của một rule. Nếu như rule này không tồn tại thì do key sai hoặc
 * là do chưa setup `this.rules` thì sẽ thông báo ra lỗi. Nếu tìm thấy thì trả về chuẩn
 * kì tự `mf` trong rule.
 * @param {string} keyOfRule Nhận vào một chuỗi là đại diện cho key của một rule trong `this.rules`.
 * @returns {string}
 */
TextGenerator.prototype.getMFOfRule = function(keyOfRule) {
  if (!this.isRulesExist()) throw new Error('Empty rules, please add more rules.');
  let rule = this.rules[keyOfRule];
  if(!rule) throw new Error(`This rule ${keyOfRule} doesn't exist or wrong spell. Please, define and add it.`);

  return rule.mf;
}

/**
 * __Creator__: @NguyenAnhTuan1912
 * 
 * Phương thức này dùng để kiểm tra một text nào đó có khớp với một rule cụ thể nào đó hay không?
 * Rule cụ thể đó được lấy từ `keyOfRule`. Xử lý tìm rule tương tự với `TextGenerator.getMFOfRule`.
 * @param {string} text Chuỗi kí tự cần kiểm tra.
 * @param {string} keyOfRule Nhận vào một chuỗi là đại diện cho key của một rule trong `this.rules`.
 * @returns {boolean}
 */
TextGenerator.prototype.testTextWithRules = function(text, keyOfRule) {
  if (!this.isRulesExist()) throw new Error('Empty rules, please add more rules.');
  let rule = this.rules[keyOfRule];
  if(!rule) throw new Error(`This rule ${keyOfRule} doesn't exist or wrong spell. Please, define and add it.`);

  return rule.nonGReg.test(text);
}

/**
 * __Creator__: @NguyenAnhTuan1912
 * 
 * Phương thức này check xem `text` có phải là một MFWText hay không?
 * Nếu như đúng là MFWText thì trả về `true`, ngược lại là `false`.
 * @param {string} text Chuỗi kí tự cần kiểm tra.
 * @returns {boolean}
 */
TextGenerator.prototype.testMF = function(text) {
  if (this.newLineStr(text)) return false;
  return this.allRulesNonGRegex.test(text);
};

/**
 * __Creator__: @NguyenAnhTuan1912
 * 
 * Phương thức này dùng để kiểm tra xem `this.rules` có tồn tại hay không?
 * Nếu như rồi thì có nghĩa là `this.rules` đã được setup đầy đủ và trả về `true`,
 * ngược lại thì `this.rules` chưa được setup và trả về `false`.
 * @returns {boolean}
 */
TextGenerator.prototype.isRulesExist = function() {
  return Boolean(this.rules);
};

/**
 * __Creator__: @NguyenAnhTuan1912
 * 
 * Phương thức này kiểm tra xem là một rule cụ thể nào đó có tồn tại trong `this.rules`
 * hay chưa bằng cách truyền type của format vào để check.
 * Nếu như đã tồn tại rồi thì trả về `true`, ngược lại là `false`.
 * @param {string} type Là tên của rule, hay còn gọi là kiểu của format.
 * @returns {boolean}
 */
TextGenerator.prototype.isRuleExist = function(type) {
  if (!this.isRulesExist()) throw new Error('Empty rules, please add more rules.');
  for(let key in this.rules) {
    if(this.rules[key].type === type) return true;
  }
  return false;
};

/**
 * __Creator__: @NguyenAnhTuan1912
 * 
 * Phương thức này kiểm tra xem là mfTree có tồn tại hay chưa.
 * Nếu có thì trả về `true`, ngược lại là `false`.
 * @returns {boolean}
 */
TextGenerator.prototype.isMFTreeExist = function() {
  return Boolean(this.mfTree);
};

// Các functionđược định nghĩa để dùng sau.
/**
 * __Creator__: @NguyenAnhTuan1912
 * 
 * Phương thức này dùng để tạo ra một mfTree mới. Nhận vào là một mảng
 * các MFWText & Text thường.
 * @param {Array<string>} markformat_and_text_array Một mảng các MFWText & Text thường.
 */
TextGenerator.prototype.createTree = function (markformat_and_text_array) {
  if (!this.isRulesExist()) throw new Error('Empty rules, please add more rules.');
  this.mfTree = [];
  let currentList;
  markformat_and_text_array.forEach((ele, index) => {
    if (this.testMF(ele)) {
      // Nếu là markdown thì phải tạo MF
      let result = this.createMFNode(ele);

      // **DO**: GROUP LIST ITEM
      // Check xem MFNode này có phải là List (UNORDERED hoặc ORDERD) hay không?
      // Vì đây là 2 Format cơ bản cho nên là add thẳng vào luôn.
      if (result.formats[0] === LOW_MARK_CONVENTIONS.UNORDERED_LIST.TYPE || result.formats[0] === LOW_MARK_CONVENTIONS.ORDERED_LIST.TYPE) {
        // Bỏ \n đi.
        console.log("BEFORE LIST ITEM: ", this.mfTree[this.mfTree.length - 1]);
        if (this.newLineStr(this.mfTree[this.mfTree.length - 1])) this.mfTree.pop();
        // console.log("LIST DETECTED")
        // Trước khi loại bỏ format "UNORDERED_LIST" hoặc "ORDERED_LIST"
        // Thì lưu nó vào một biến
        let format = result.formats[0];

        // Shift format ra (bởi vì nếu có lồng ở trong thì nó cúng luôn nằm ở đầu)
        result.formats.shift();
        let item = result.children || result.formats.length > 0 ? result : result.values[0];
        if (!currentList) {
          // console.log("CREATE LIST")
          currentList = new MFNode([item], [format]);
          currentList._id = currentList.createRandomMFNodeID();
        } else if (currentList.formats[0] === format) {
          // console.log("ADD ITEM TO LIST")
          currentList.addValue(item);
        } else {
          this.mfTree.push(currentList);
          currentList = null;
          currentList = new MFNode([item], [format]);
          currentList._id = currentList.createRandomMFNodeID();
        }
      }
      //
      // Nếu không phải list item thì cứ add vào tree như bình thường.
      // Trước khi add thì check qua currentList có lưu ref của list nào trong đó hay không?
      else {
        if (currentList) {
          this.mfTree.push(currentList);
          currentList = null;
        }
        this.mfTree.push(result);
      }
    } else {
      if ((!this.newLineStr(ele) || ele.split(/[\n\r]/).length >= 3) && currentList) {
        if (this.newLineStr(this.mfTree[this.mfTree.length - 1])) this.mfTree.pop();
        this.mfTree.push(currentList);
        currentList = null;
      }
      this.mfTree.push(ele);
    }
  });
};

/**
 * __Creator__: @NguyenAnhTuan1912
 * 
 * Phương thức này dùng để thêm rule vào `this.rules`.
 * Khi setup rule thì cần phải có cả 3 thuộc tính này mới setup được.
 * Và 3 thuộc tính này chính là 3 thuộc tính cơ bản để tạo nên những cái khác trong rule.
 * @param {string} type Kiểu format của rule.
 * @param {string} regInStr (Quan trọng nhất) biểu thức chính quy của rule ở dạng chuỗi.
 * @param {string} mf Kí tự MF.
 */
TextGenerator.prototype.addRule = function(type, regInStr, mf) {
  // Trước khi thêm rule thì phải check tí đã
  if (!type) throw new Error('The rule must has name.');
  if (!this.isRulesExist()) this.rules = {};
  if (this.isRuleExist(type))
    throw new Error(`This rule has been defined before. Rule: ${type}`);

  // Sau khi pass được qua tất cả test, thì thêm rule
  // Nếu như chuỗi truyền vào để tạo reg mà cũng sai thì là do chuỗi đó escape vẫn chưa đúng.
  let upperCaseType = type.toUpperCase();
  let reg = new RegExp(regInStr, 'g');
  let nonGReg = new RegExp(regInStr);
  const rule = {
    reg: reg,
    nonGReg: nonGReg,
    regInStr: regInStr,
    mf: mf,
    type: upperCaseType,
  };
  this.rules[mf] = rule;
};

/**
 * __Creator__: @NguyenAnhTuan1912
 * 
 * Phương thức này nhận một chuỗi và dĩ nhiên chuỗi này phải là MFWText hoặc
 * có chứa MFWText ở bên trong.
 * @param {string} text Chuỗi này là một MFWText hoặc là có MFWText ở bên trong.
 * @returns {MFNode}
 * 
 * @example
 * 
 * ...
 * let mf = "__Đây là chuỗi được in nghiêng__"
 * let mfNode = this.createMFNode(mf);
 * 
 * // Output: MFNode { formats: ["ITALIC"], values: ["Đây là chuỗi được in nghiêng"] }
 * console.log(mfNode)
 * ...
 */
TextGenerator.prototype.createMFNode = function(text) {
  let match = this.getMatch(text);
  let format = this.rules[match[1]].type;
  let value = match[2];
  let result = new MFNode([value], [format]);
  
  result._id = result.createRandomMFNodeID();

  // Có một số markdown sẽ chứa link trong đó, nếu như có thì
  // markdown này có nghĩa là image hoặc là link.
  if(hasLink(text)) {
    result.url = getLinkInText(text);
  }

  // Check xem trong Chuỗi cần format còn có MFWText nào hay không?
  // Chỉ những text nào có Format kết hợp hoặc Format lồng thì mfWTexts mới là một array.
  let mfWTexts = this.getVariousMatches(match[2], true);

  if(Array.isArray(mfWTexts)) {
    for(let mfWText of mfWTexts) {
      let child = this.createMFNode(mfWText);
      // console.log('SPECIAL CASE');
      // console.log(deeperMatch[1]);

      // console.log(deeperMatch);
      // console.log(child);
      
      // Format kết hợp
      if (mfWText === match[2]) {
        result.addFormats(child.formats);
        result.setValues(child.values);

        // Vì trong format kết hợp có thể sẽ có format lồng trong đó.
        if(child.children) {
          result.addChildren(child.children);
        }
      }

      // Format lồng
      if (mfWText !== match[2]) {
        // console.log('Format long');
        result.setValues(this.decomposeMF(match[2], false))
        result.addChildren(child);

        if(match[2].indexOf(mfWText) === 0) { 
          result.isChildrenRenderFirst = true;
        }
      }
    }
  }

  // Format kết hợp, format lồng.
  // if (this.testMF(match[2])) {
  //   let deeperMatch = this.getMatch(match[2]);
  //   let child = this.createMFNode(match[2]);
  //   // console.log('SPECIAL CASE');
  //   // console.log(deeperMatch[1]);

  //   // console.log(deeperMatch);
  //   // console.log(child);
    
  //   // Format kết hợp
  //   if (deeperMatch[0] === match[2]) {
  //     result.addFormats(child.formats);
  //     result.setValues(child.values);

  //     // Vì trong format kết hợp có thể sẽ có format lồng trong đó.
  //     if(child.children) {
  //       result.addChildren(child.children);
  //     }
  //   }

  //   // Format lồng
  //   if (deeperMatch[0] !== match[2]) {
  //     // console.log('Format long');
  //     result.setValues(this.decomposeMF(match[2], false))
  //     result.addChildren(child);

  //     if(match[2].indexOf(deeperMatch[0]) === 0) { 
  //       result.isChildrenRenderFirst = true;
  //     }
  //   }
  // }

  return result;
};

/**
 * __Creator__: @NguyenAnhTuan1912
 * 
 * Phương thức này dùng để lấy ra các capture group trong Regexp (Đã được cài từ trước).
 * Nó sẽ trả về một mảng gồm 3 phần tử:
 * 1. Chuỗi match: này là chuỗi có MF ở hai đầu (nó chính là chuỗi gốc hay `text mà mình truyền vào).
 * 2. Markdown Character: kí tự markdown.
 * 3. Chuỗi cần format: đương nhiên rồi, đây là chuỗi nằm ở trong MF.
 * @param {string} text Text có chứa MF ở trỏng, nếu như không có MF thì trả về lại `text`.
 * @returns {Array<string>}
 * 
 * @example
 * ...
 * let text = "__Đây là chữ nghiêng__"
 * let match = generator.getMatch(text);
 * 
 * // OUTPUT: ["__Đây là chữ nghiêng__", "__", "Đây là chữ nghiêng"]
 * console.log(matchWithoutG);
 * ...
 */
TextGenerator.prototype.getMatch = function(text) {
  if(!this.testMF(text)) return text;

  let mf = text.match(this.allMarkdownHeadRegex);

  if(!mf) mf = text.match(this.allRulesRegex)[0].match(this.allMarkdownHeadRegex);

  let rule = this.rules[mf[0]];
  
  if(!rule && this.testTextWithRules(mf[0] + " Random text for match.", LOW_MARK_CONVENTIONS.ORDERED_LIST.MF)) {
    rule = this.rules[LOW_MARK_CONVENTIONS.ORDERED_LIST.MF];
    let match = text.match(rule.nonGReg);
    
    match[1] = LOW_MARK_CONVENTIONS.ORDERED_LIST.MF;

    return match;
  };

  let match = text.match(rule.nonGReg);

  return match;
};

/**
 * __Creator__: @NguyenAnhTuan1912
 * 
 * Phương thức này dùng để trả về các match của MFWText trong cùng một chuỗi.
 * @param {string} text Chuỗi chứa nhiều markdown khác nhau.
 * @returns {Array<string>}
 * 
 * @example
 * 
 * let textExample = "**Chữ này được in đậm**, còn ==Chữ này được highlight==."
 * 
 * let matchExample = generator.getVariousMatches(textExample);
 * 
 * // OUTPUT: ["**Chữ này được in đậm**", "==Chữ này được highlight=="]
 * console.log(matchExample);
 */
TextGenerator.prototype.getVariousMatches = function(text) {
  return text.match(this.allRulesRegex);
}

/**
 * __Creator__: @NguyenAnhTuan1912
 * 
 * Phương thức này dùng để phân tách MFWText ra khỏi văn bản, tạo ra một mảng MFWText trong văn bản đó,
 * đồng thời cũng tạo ra một mảng chữ thường mà sau cùng merge 2 mảng này lại với nhau.
 * @param {boolean} isMerge Có merge mảng MFWText với Normal Text không? Nếu không thì trả về mỗi mảng Normal Text thôi.
 * @param {string} text Một văn bản cần được hiển thị định dạng.
 * @returns {Array<string>}
 */
TextGenerator.prototype.decomposeMF = function(text, isMerge = true) {
  let replacedText = text.replaceAll(this.allRulesRegex, '[MarkFormat]');
  let splitText = replacedText.split('[MarkFormat]');
  let allMarkformats = text.match(this.allRulesRegex);

  if(isMerge) {
    splitText = splitText.merge(allMarkformats);
  }
  splitText = splitText.filter((mf) => mf !== '');
  return splitText;
};

// Các functionđược định nghĩa để build TextGenerator
/**
 * __Creator__: @NguyenAnhTuan1912
 * 
 * Phương thức này dùng trong quá trình build TextGenerator.
 * Nó sẽ nhận vào các một chuỗi các kí tự MF, với `^` ở đầu mỗi kí tự.
 * @param {*} regStr 
 */
TextGenerator.prototype.generateRegForTesting = function(regStr) {
  if(!regStr) throw new Error(`${regStr} is not a valid string to make RegExp`);
  this.allMarkdownHeadRegex = new RegExp(regStr, 'g');
};

/**
 * __Creator__: @NguyenAnhTuan1912
 * 
 * Phương thức này dùng để tạo ra tất một biểu thức chính quy mà trong đó nó bao
 * gồm tất cả các biểu thức chính quy của các format khác.
 */
TextGenerator.prototype.generateAllRulesRegex = function() {
  if (!this.isRulesExist())
    throw new Error('Empty rules, please add more rules.');
  let cpOfRules = Object.assign({}, this.rules);
  let strForTest = '';
  for (let key in cpOfRules) {
    strForTest += '' + cpOfRules[key].regInStr + '|';
  }
  strForTest += '[\\n]+';
  this.allRulesRegex = new RegExp(strForTest, 'gm');
  this.allRulesNonGRegex = new RegExp(strForTest);
};

export default TextGenerator;