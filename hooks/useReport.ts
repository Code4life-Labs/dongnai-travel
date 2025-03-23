import React from "react";
import { useSelector, useDispatch } from "react-redux";

// Import redux actions
import { reportsActions } from "@/states/redux/reports";

// Import redux middlewares
import { reportsThunks } from "@/states/redux/reports/middlewares";

// Import selectors
import { reportsSelectors } from "@/states/redux/reports/selectors";

// Import types
import type { AppState, AppDispatch } from "@/states/redux/type";
import type { Report, ReportModel } from "@/objects/report/type";

export const { useReports, useReportsActions, useReportsState } = (function () {
  const createDispatchers = function (dispatch: AppDispatch) {
    return {
      fetchReports() {
        dispatch(reportsThunks.getReportsAsync());
      },

      fetchReportReasons() {
        dispatch(reportsThunks.getReportReasonsAsync());
      },

      fetchReportStatuses() {
        dispatch(reportsThunks.getReportStatusesAsync());
      },

      setCurrentReport(report: Report) {
        dispatch(reportsActions.setCurrentReport(report));
      },

      clearCurrentReport() {
        dispatch(reportsActions.clearCurrentReport());
      },

      clearReports() {
        dispatch(reportsActions.clearReports());
      },

      reset() {
        dispatch(reportsActions.reset());
      },
    };
  };

  return {
    /**
     * Use this hook to manage `reports` and get actions to
     * manipulate `reports`
     * @returns
     */
    useReports() {
      const reports = useSelector(reportsSelectors.reportsSelector);
      const status = useSelector(reportsSelectors.statusSelector);
      const currentReport = useSelector(reportsSelectors.currentReportSelector);
      const reasons = useSelector(reportsSelectors.reportReasonsSelector);
      const statuses = useSelector(reportsSelectors.reportStatusesSelector);
      const dispatch = useDispatch();
      const reportsDispatchers = createDispatchers(dispatch);

      return {
        reports,
        currentReport,
        status,
        reasons,
        statuses,
        reportsDispatchers,
      };
    },

    /**
     * Use this hook to get only actions, it does not affect component's
     * life cycle when `reports` is updated
     * @returns
     */
    useReportsActions() {
      const dispatch = useDispatch();
      return createDispatchers(dispatch);
    },

    /**
     * Use this hook to get only `reports`
     * @returns
     */
    useReportsState() {
      const reports = useSelector(reportsSelectors.reportsSelector);
      const status = useSelector(reportsSelectors.statusSelector);
      const currentReport = useSelector(reportsSelectors.currentReportSelector);
      const reasons = useSelector(reportsSelectors.reportReasonsSelector);
      const statuses = useSelector(reportsSelectors.reportStatusesSelector);

      return {
        reports,
        currentReport,
        status,
        reasons,
        statuses,
      };
    },
  };
})();

const createReportSectionDispatchers = function (dispatch: AppDispatch) {
  return {
    setReportSectionVisible(status?: boolean) {
      dispatch(reportsActions.setIsSectionOpen(Boolean(status)));
    },

    setReportSectionSubmittedStatus(status?: boolean) {
      dispatch(reportsActions.setReportSectionSubmittedStatus(Boolean(status)));
    },

    submitReport(
      reasonId: string,
      description: string,
      itemId: string,
      itemType: string
    ) {
      dispatch(
        reportsThunks.createReportAsync({
          reasonId,
          description,
          item: { id: itemId, type: itemType },
        })
      );
    },

    openReportSection(id: string, type: string) {
      dispatch(reportsActions.setReportItemId(id));
      dispatch(reportsActions.setReportItemType(type));
      dispatch(reportsActions.setIsSectionOpen(Boolean(true)));
    },

    closeReportSection() {
      dispatch(reportsActions.clearReportSection());
    },
  };
};

/**
 * Use this function to manage `report-section`
 * @returns
 */
export function useReportSection() {
  const preparationData = useSelector(reportsSelectors.preparationDataSelector);
  const preparingReport = useSelector(reportsSelectors.preparingReportSelector);
  const reportSectionData = useSelector(
    reportsSelectors.reportSectionDataSelector
  );
  const dispatch = useDispatch();
  const reportSectionDispatchers = createReportSectionDispatchers(dispatch);

  return {
    preparationData,
    preparingReport,
    reportSectionData,
    reportSectionDispatchers,
  };
}
