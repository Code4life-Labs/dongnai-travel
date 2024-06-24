import { PlaceAPI } from "./api";
import { PlaceValidator } from "./validator";
import { PlaceStorage } from "./storage";

// Import types
import type { Place } from "./type";

export class PlaceManager {
  static Api = new PlaceAPI();
  static Validator = new PlaceValidator();
  static Storage = new PlaceStorage();

  private constructor() {}
}
