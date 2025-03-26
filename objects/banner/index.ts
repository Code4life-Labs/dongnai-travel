import { BannerAPI } from "./api";

export class BannerManager {
  static Api = new BannerAPI(process.env.EXPO_PUBLIC_DONGNAITRAVEL_API_URL!);

  private constructor() {}
}
