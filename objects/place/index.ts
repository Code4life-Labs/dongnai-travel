import { PlaceAPI } from "./api";

// Import types
import type { Place } from "./type";

export class PlaceManager {
  static Api = new PlaceAPI();

  private constructor() {}
}
