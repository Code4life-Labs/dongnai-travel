import { PlaceAPI } from "./api";
import { PlaceValidator } from "./validator";

// Import types
import type { Place } from "./type";

export class PlaceManager {
  static Api = new PlaceAPI();
  static Validator = new PlaceValidator();

  private constructor() {}
}

function hello(name: string) {
  return class {};
}
