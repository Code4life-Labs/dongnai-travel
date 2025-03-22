import { ReportAPI } from "./api";
import { ReportStorage } from "./storage";

export class BannerManager {
  static Api = new ReportAPI(process.env.EXPO_PUBLIC_DONGNAITRAVEL_API_URL!);
  static Storage = new ReportStorage();

  private constructor() {}
}
