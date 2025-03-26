// Import from bases
import { API } from "@/classes/API";

// Import from utils
import { RouteUtils } from "@/utils/route";

// Import types
import type { Report, ReportReason, ReportStatus } from "./type";
import type { GetMultipleBaseOptions } from "@/types/api";

type GetReportsAsyncOptions = {} & GetMultipleBaseOptions;
type GetReportAttributesOptions = {} & GetMultipleBaseOptions;
type GetReportAsyncOptions = {
  id: string;
};
type CreateReportAsyncItemParamerter = {
  id: string;
  type: "user" | "place" | "blog";
};

export class ReportAPI {
  api!: API;

  constructor(baseURL: string) {
    this.api = new API({ baseURL });
  }

  /**
   * Get reports
   * @param options
   * @returns
   */
  async getReportsAsync(options: GetReportsAsyncOptions) {
    try {
      const { limit = 10, skip = 0 } = options;
      const user = API.getUser();
      const url = RouteUtils.getPath("users", user._id, "reports");
      console.log("URL:", url);
      let query = `limit=${limit}&skip=${skip}`;
      let headers: Record<string, any> = API.addAuthorizationToHeader({});

      const response = await this.api.get(RouteUtils.mergeQuery(url, query), {
        headers,
      });

      return response.data.data as Array<Report>;
    } catch (error: any) {
      console.warn(error.message);
      return null;
    }
  }

  /**
   * Get report reasons
   * @param options
   * @returns
   */
  async getReportReasonsAsync() {
    try {
      const url = RouteUtils.getPath("reports/reasons");
      let headers: Record<string, any> = API.addAuthorizationToHeader({});

      const response = await this.api.get(url, {
        headers,
      });

      return response.data.data as Array<ReportReason>;
    } catch (error: any) {
      console.warn(error.message);
      return null;
    }
  }

  /**
   * Get report statuses
   * @param options
   * @returns
   */
  async getReportStatusesAsync() {
    try {
      const url = RouteUtils.getPath("reports/statuses");
      let headers: Record<string, any> = API.addAuthorizationToHeader({});

      const response = await this.api.get(url, {
        headers,
      });

      return response.data.data as Array<ReportStatus>;
    } catch (error: any) {
      console.warn(error.message);
      return null;
    }
  }

  /**
   * Get report statuses
   * @param options
   * @returns
   */
  async createReportAsync(
    reasonId: string,
    description: string,
    item: CreateReportAsyncItemParamerter
  ) {
    try {
      const user = API.getUser();
      const url = RouteUtils.getPath("users", user._id, "report");
      const headers: Record<string, any> = API.addAuthorizationToHeader({});
      const body = {
        reporterId: user._id,
        reasonId,
        description,
        [`${item.type}Id`]: item.id,
      };

      console.log("Body:", body);

      const response = await this.api.post(url, body, {
        headers,
      });

      return response.data.data as Report;
    } catch (error: any) {
      console.warn("Error - Create report async", error.message);
      return null;
    }
  }
}
