// Import from utils
import { StorageUtils } from "@/utils/storage";

// Import type
import type { ReportReason, ReportStatus } from "./type";

export class ReportStorage {
  constructor() {}

  async saveReportReasons(reportReasons: Array<ReportReason>) {
    StorageUtils.setItemAsync("REPORT_REASONS_KEY", reportReasons);
  }
  async getReportReasons(): Promise<Array<ReportReason>> {
    return StorageUtils.getItemAsync("REPORT_REASONS_KEY");
  }
  async getReportReasonByName(name: string) {
    const reportReasons = await this.getReportReasons();
    return reportReasons.find((type) => type.name === name);
  }

  async saveReportStatuses(reportStatuses: Array<ReportStatus>) {
    StorageUtils.setItemAsync("REPORT_STATUSES_KEY", reportStatuses);
  }
  async getReportStatuses(): Promise<Array<ReportStatus>> {
    return StorageUtils.getItemAsync("REPORT_STATUSES_KEY");
  }
  async getReportByName(name: string) {
    const reportStatuses = await this.getReportStatuses();
    return reportStatuses.find((status) => status.name === name);
  }
}
