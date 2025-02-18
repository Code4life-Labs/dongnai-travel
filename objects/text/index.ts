import { TextAPI } from "./api";

/**
 * An static class which is used to manage place
 * @NguyenAnhTuan1912
 */
export class TextManager {
  static Api = new TextAPI(
    `${process.env.EXPO_PUBLIC_DONGNAITRAVEL_API_URL!}/text`
  );

  private constructor() {}
}
