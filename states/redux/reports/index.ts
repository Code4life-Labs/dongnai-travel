import { createSlice } from "@reduxjs/toolkit";

// Import thunks
import { reportsThunks } from "./middlewares";

// Import data
import ReportSectionData from "@/assets/json/report-description.json";

// Import types
import type {
  Report,
  ReportModel,
  ReportReason,
  ReportStatus,
} from "@/objects/report/type";

type InitialState = {
  reports: Array<Report>;
  currentReport: Report | null;
  reasons: Array<ReportReason>;
  statuses: Array<ReportStatus>;
  status: {
    isRefreshing: boolean;
  };
  reportSection: {
    status: {
      isSectionOpen: boolean;
      isSubmitting: boolean;
      isSubmitted: boolean;
    };
    itemId: string;
    itemType: string;
  };
  preparationData: typeof ReportSectionData;
};

const initialState: InitialState = {
  reports: [],
  currentReport: null,
  reasons: [],
  statuses: [],
  status: {
    isRefreshing: false,
  },
  reportSection: {
    status: {
      isSectionOpen: false,
      isSubmitting: false,
      isSubmitted: false,
    },
    itemType: "",
    itemId: "",
  },
  preparationData: ReportSectionData,
};

export const reportsSlice = createSlice({
  name: "reports",
  initialState: { ...initialState },
  reducers: {
    setCurrentReport(state, action) {
      state.currentReport = action.payload;
    },

    setIsSectionOpen(state, action) {
      state.reportSection.status.isSectionOpen = action.payload;
    },

    setReportItemType(state, action) {
      state.reportSection.itemType = action.payload;
    },

    setReportItemId(state, action) {
      state.reportSection.itemId = action.payload;
    },

    setReportSectionSubmittedStatus(state, action) {
      state.reportSection.status.isSubmitted = action.payload;
    },

    clearCurrentReport(state) {
      state.currentReport = null;
    },

    clearReports(state) {
      state.reports = [];
    },

    clearReportSection(state) {
      state.reportSection = { ...initialState.reportSection };
    },

    reset(state) {
      state = { ...initialState };
    },
  },
  extraReducers(builder) {
    builder.addCase(
      reportsThunks.getReportsAsync.pending,
      function (state, action) {
        state.status.isRefreshing = true;
      }
    );

    builder.addCase(
      reportsThunks.getReportsAsync.fulfilled,
      function (state, action) {
        if (action.payload) state.reports = action.payload;
        state.status.isRefreshing = true;
      }
    );

    builder.addCase(
      reportsThunks.getReportReasonsAsync.fulfilled,
      function (state, action) {
        if (action.payload) state.reasons = action.payload;
      }
    );

    builder.addCase(
      reportsThunks.getReportStatusesAsync.fulfilled,
      function (state, action) {
        if (action.payload) state.statuses = action.payload;
      }
    );

    builder.addCase(
      reportsThunks.createReportAsync.pending,
      function (state, action) {
        state.reportSection.status.isSubmitting = true;
      }
    );

    builder.addCase(
      reportsThunks.createReportAsync.fulfilled,
      function (state, action) {
        if (action.payload) state.reports.push(action.payload);
        state.reportSection.status.isSubmitting = false;
        state.reportSection.status.isSubmitted = true;
      }
    );
  },
});

export const reportsActions = reportsSlice.actions;
