import TextGenerator from '../TextGenerator.js';

function TextGeneratorBuilder() {
  console.log('Builder is created');
  this.tree = new TextGenerator();
}

TextGeneratorBuilder.prototype.buildRules = function (rules) {
  for (let key in rules) {
    let rule = rules[key];
    this.tree.addRule(rule.TYPE, rule.RULE, rule.MF);
  }
  return this;
};
TextGeneratorBuilder.prototype.buildAllRulesInOne = function () {
  this.tree.generateAllRulesRegex();
  return this;
};
TextGeneratorBuilder.prototype.buildAllMF = function (text) {
  this.tree.generateRegForTesting(text);
  return this;
};
TextGeneratorBuilder.prototype.build = function () {
  return this.tree;
};

export default TextGeneratorBuilder;
