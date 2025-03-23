import { createAsyncThunk } from "@reduxjs/toolkit";

// Import objects
import { ReportManager } from "@/objects/report";

// Import types
import type { Report, ReportReason, ReportStatus } from "@/objects/report/type";
import type { AppState } from "../type";

const getReportsAsync = createAsyncThunk(
  "reports/getReportsAsync",
  async function (payload, thunkAPI) {
    try {
      const state = thunkAPI.getState() as AppState,
        reports = state.reports.reports,
        limit = 10,
        skip = reports ? reports.length : 0;

      const data = await ReportManager.Api.getReportsAsync({
        limit,
        skip,
      });

      return data as Array<Report>;
    } catch (error: any) {
      console.error(error.message);
    }
  }
);

const getReportReasonsAsync = createAsyncThunk(
  "reports/getReportReasonsAsync",
  async function () {
    try {
      // Get from local storage first
      let data = await ReportManager.Storage.getReportReasons();

      if (!data) {
        data =
          (await ReportManager.Api.getReportReasonsAsync()) as Array<ReportReason>;
        // Store to storage
        await ReportManager.Storage.saveReportReasons(data);
      }

      return data;
    } catch (error: any) {
      console.error(error.message);
    }
  }
);

const getReportStatusesAsync = createAsyncThunk(
  "reports/getReportStatusesAsync",
  async function () {
    try {
      let data = await ReportManager.Storage.getReportStatuses();

      if (!data) {
        data =
          (await ReportManager.Api.getReportStatusesAsync()) as Array<ReportStatus>;
        // Store to storage
        await ReportManager.Storage.saveReportStatuses(data);
      }

      return data;
    } catch (error: any) {
      console.error(error.message);
    }
  }
);

const createReportAsync = createAsyncThunk(
  "reports/createReportAsync",
  async function (payload: any) {
    try {
      const { reasonId, description, item } = payload as any;

      const result = await ReportManager.Api.createReportAsync(
        reasonId,
        description,
        item
      );

      return result;
    } catch (error: any) {
      console.error("Error - Submit report", error.message);
    }
  }
);

export const reportsThunks = {
  getReportsAsync,
  getReportReasonsAsync,
  getReportStatusesAsync,
  createReportAsync,
};
