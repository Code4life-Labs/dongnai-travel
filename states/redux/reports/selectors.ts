import type { AppState } from "../type";

export const reportsSelectors = {
  statusSelector(state: AppState) {
    return state.reports.status;
  },
  reportSectionDataSelector(state: AppState) {
    return state.reports.reportSection;
  },
  currentReportSelector(state: AppState) {
    return state.reports.currentReport;
  },
  reportsSelector(state: AppState) {
    return state.reports.reports;
  },
  preparationDataSelector(state: AppState) {
    return state.reports.preparationData;
  },
  preparingReportSelector(state: AppState) {
    return state.reports.preparingReport;
  },
  reportReasonsSelector(state: AppState) {
    return state.reports.reasons;
  },
  reportStatusesSelector(state: AppState) {
    return state.reports.statuses;
  },
};
