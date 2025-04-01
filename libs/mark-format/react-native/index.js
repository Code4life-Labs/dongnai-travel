import TextGeneratorBuilder from '../src/creator/TextGeneratorBuilder.js';
import TextGeneratorPrototype from '../src/creator/TextGeneratorPrototype.js';
import ReactNativeRenderer from './render/ReactNativeRenderer.js';
import RunArrayConfigs from '../src/configs/array.config.js';

import { LOW_MARK_CONVENTIONS, HIGH_MARK_CONVENTIONS, ALLMFs } from '../src/rules.js'

import formatTypeToStyle from './config/toReactNative.config.js';

RunArrayConfigs();

/*
  File này chính là file export toàn bộ code của package trong này.
  Hiện tại nó chỉ mới như này thôi như tương lai sẽ thêm một số thứ nữa vào đây.
*/

//
// Dưới đây là các bước để build một TextGenerator mới
// Tạo một generator mới.
const generator = new TextGeneratorBuilder()
  .buildRules(LOW_MARK_CONVENTIONS)
  .buildRules(HIGH_MARK_CONVENTIONS)
  .buildAllRulesInOne()
  .buildAllMF(ALLMFs)
  .build();

// Tạo một renderer mới và gán nó cho generator. Coi như là mặc định.
generator.renderer = new ReactNativeRenderer(formatTypeToStyle);

// Tọa ra một prototype, để sau này có dùng nhiều tới TextGenerator
// thì chỉ cần build ra thôi, không cần phải set up lại từ đầu như
// các bước trên.
const ReactNativeTextGeneratorProto = new TextGeneratorPrototype(generator);

export { ReactNativeTextGeneratorProto };