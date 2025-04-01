import React from "react";
import { View, Animated } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import { router } from "expo-router";

// Import components
import AppText from "../app_text";
import BottomSheetScroll from "../bottom_sheet/BottomSheetScroll";
import { RectangleButton } from "../buttons";

// Import hooks
import { useReports, useReportSection } from "@/hooks/useReport";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";

// Import state
import { Styles } from "@/styles";

type ReportReasonsProps = {
  reportReasons:
    | Array<{
        reasonKey: string;
        title: any;
        description: [];
      }>
    | undefined;
  reportSectionData: any;
  submit(reasonKey: string, description: string): void;
};

type ReportDescriptionProps = {
  description: Array<string>;
  submit(description: string): void;
};

type ReportResultProps = {
  itemType: string;
  close(): void;
};

function ReportResult(props: ReportResultProps) {
  return (
    <View style={{ justifyContent: "center" }}>
      <AppText size="h3" style={{ textAlign: "center" }}>
        Thanks for reporting this {props.itemType}
      </AppText>
      <AppText style={{ textAlign: "center" }}>
        Please wait for our review and descision for next steps.
      </AppText>
      <AppText
        color="secondary"
        style={[
          { textAlign: "center" },
          Styles.spacings.mt_22,
          Styles.spacings.mb_22,
        ]}
        onPress={() => {
          router.push("/settings/reports");
          props.close();
        }}
      >
        Show reports' status
      </AppText>

      <RectangleButton
        onPress={() => {
          props.close();
        }}
      >
        Done
      </RectangleButton>
    </View>
  );
}

function ReportDescription(props: ReportDescriptionProps) {
  const { theme } = useTheme();

  return (
    <View style={[Styles.spacings.mb_12]}>
      {props.description &&
        props.description.map((item, index) => {
          const style: any = {
            width: "100%",
            backgroundColor: theme.background,
            justifyContent: "space-between",
            borderTopWidth: 1,
          };

          if (index === props.description!.length - 1) {
            style.borderBottomWidth = 1;
          }

          return (
            <RectangleButton
              key={index}
              style={[style]}
              onPress={() => {
                console.log("Submit:", item);
                props.submit(item);
              }}
            >
              <AppText
                style={{
                  color: theme.onBackground,
                  fontSize: 16,
                  width: "80%",
                }}
              >
                {item}
              </AppText>
              <AntDesign
                size={12}
                name="right"
                style={{ color: theme.onBackground, fontSize: 16 }}
              />
            </RectangleButton>
          );
        })}
    </View>
  );
}

function ReportReasons(props: ReportReasonsProps) {
  const { theme } = useTheme();
  const [reasonKey, setReasonKey] = React.useState<string | null>(null);
  const [descriptionList, setDescriptionList] =
    React.useState<Array<string> | null>(null);

  return (
    <View style={[Styles.spacings.mb_12]}>
      {props.reportReasons &&
        !descriptionList &&
        props.reportReasons.map((item, index) => {
          const style: any = {
            width: "100%",
            backgroundColor: theme.background,
            justifyContent: "space-between",
            borderTopWidth: 1,
          };

          if (index === props.reportReasons!.length - 1) {
            style.borderBottomWidth = 1;
          }

          return (
            <RectangleButton
              key={index}
              style={[style]}
              onPress={() => {
                setDescriptionList(item.description);
                setReasonKey(item.reasonKey);
              }}
            >
              <AppText
                style={{
                  color: theme.onBackground,
                  fontSize: 16,
                  width: "80%",
                }}
              >
                {item.title}
              </AppText>
              <AntDesign
                size={12}
                name="right"
                style={{ color: theme.onBackground, fontSize: 16 }}
              />
            </RectangleButton>
          );
        })}
      {descriptionList && (
        <View>
          <ReportDescription
            description={descriptionList}
            submit={(description) => props.submit(reasonKey!, description)}
          />
          <RectangleButton
            type="opacity"
            onPress={() => {
              setDescriptionList(null);
              setReasonKey(null);
            }}
          >
            Back
          </RectangleButton>
        </View>
      )}
    </View>
  );
}

export default function ReportSection() {
  const { reasons, reportsDispatchers } = useReports();
  const { preparationData, reportSectionData, reportSectionDispatchers } =
    useReportSection();
  const { language } = useLanguage();

  const reportReasons = React.useMemo(() => {
    if (preparationData && reportSectionData.itemType)
      return Object.entries(preparationData).map(([key, value]) => {
        return {
          reasonKey: key,
          title: (value as any)[reportSectionData.itemType].title[
            language.code
          ],
          description: (value as any)[reportSectionData.itemType].description[
            language.code
          ],
        };
      });
  }, [
    reportSectionData,
    preparationData,
    reportSectionData.itemType,
    language.code,
  ]);

  React.useEffect(() => {
    reportsDispatchers.fetchReportReasons();
    reportsDispatchers.fetchReportStatuses();
  }, []);

  if (reportReasons && !reportSectionData.status.isSectionOpen) {
    return;
  }

  return (
    <BottomSheetScroll
      snapPoints={["70%"]}
      isOpen={reportReasons && reportSectionData.status.isSectionOpen}
      close={() => {
        reportSectionDispatchers.closeReportSection();
      }}
      labelBtn="Submit"
      handleLabelBtn={() => {}}
      handleStyle={[
        Styles.shapes.ronuded_top_left_12,
        Styles.shapes.ronuded_top_right_12,
      ]}
      bottomSheetScrollViewStyle={Styles.spacings.pb_18}
      haveBtn={false}
    >
      {!reportSectionData.status.isSubmitted && (
        <View style={Styles.spacings.mb_12}>
          <AppText size="h3">Report {reportSectionData.itemType}</AppText>
          <AppText>
            Something wrong about this {reportSectionData.itemType}
          </AppText>
        </View>
      )}

      {reportSectionData.status.isSubmitted ? (
        <ReportResult
          itemType={reportSectionData.itemType}
          close={() => {
            reportSectionDispatchers.closeReportSection();
          }}
        />
      ) : (
        <ReportReasons
          reportReasons={reportReasons}
          reportSectionData={reportSectionData}
          submit={(reasonKey, description) => {
            const selectedReason = reasons.find(
              (reason) => reason.value === reasonKey
            );
            reportSectionDispatchers.submitReport(
              selectedReason?._id!,
              description,
              reportSectionData.itemId,
              reportSectionData.itemType
            );
          }}
        />
      )}
    </BottomSheetScroll>
  );
}
