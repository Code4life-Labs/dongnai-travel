import TextGenerator from "../TextGenerator.js";

function TextGeneratorPrototype(treeProto) {
  /**
   * @type {TextGenerator}
   */
  this.treePrototype = Object.assign({}, treeProto);
  this.clone = function() {
    return new TextGenerator(
      this.treePrototype.rules,
      this.treePrototype.allMarkdownHeadRegex,
      this.treePrototype.allRulesRegex,
      this.treePrototype.allRulesNonGRegex,
      this.treePrototype.renderer
    );
  }
}

export default TextGeneratorPrototype;