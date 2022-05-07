import { Button, Input } from "antd";
import searchBarStyles from "@/pages/DataLogs/components/SearchBar/index.less";
import SearchBarSuffixIcon from "@/pages/DataLogs/components/SearchBar/SearchBarSuffixIcon";
import { PaneType, QueryParams } from "@/models/datalogs/types";
import DarkTimeSelect from "@/pages/DataLogs/components/DateTimeSelected";
import IconFont from "@/components/IconFont";
import { useModel } from "@@/plugin-model/useModel";
import { useIntl } from "umi";
import { useDebounceFn } from "ahooks";
import { DEBOUNCE_WAIT, FIRST_PAGE, TimeRangeType } from "@/config/config";
import moment, { DurationInputArg1, DurationInputArg2 } from "moment";
import { currentTimeStamp } from "@/utils/momentUtils";
import { useMemo } from "react";

const RawLogQuery = () => {
  const {
    currentLogLibrary,
    logPanesHelper,
    keywordInput,
    onChangeKeywordInput,
    doGetLogsAndHighCharts,
    startDateTime,
    endDateTime,
    activeTimeOptionIndex,
    onChangeCurrentLogPane,
    logsLoading,
    highChartLoading,
    activeTabKey,
    currentRelativeAmount,
    currentRelativeUnit,
    resetLogPaneLogsAndHighCharts,
  } = useModel("dataLogs");
  const { logPanes } = logPanesHelper;

  const i18n = useIntl();

  const oldPane = useMemo(() => {
    if (!currentLogLibrary?.id) return;
    return logPanes[currentLogLibrary?.id.toString()];
  }, [currentLogLibrary?.id, logPanes]);

  const doSearchLog = useDebounceFn(
    () => {
      if (!currentLogLibrary) return;
      const params: QueryParams = {
        page: FIRST_PAGE,
      };
      if (activeTabKey === TimeRangeType.Relative) {
        const start = moment()
          .subtract(
            currentRelativeAmount as DurationInputArg1,
            currentRelativeUnit as DurationInputArg2
          )
          .unix();
        const end = currentTimeStamp();
        params.st = start;
        params.et = end;
      }
      if (activeTabKey === TimeRangeType.Custom) {
        params.st = startDateTime;
        params.et = endDateTime;
      }
      const pane: PaneType = {
        ...(oldPane as PaneType),
        start: params?.st ?? oldPane?.start,
        end: params?.et ?? oldPane?.end,
        keyword: keywordInput,
        page: params.page,
        activeIndex: activeTimeOptionIndex,
      };
      onChangeCurrentLogPane(pane);
      doGetLogsAndHighCharts(currentLogLibrary?.id, { reqParams: params })
        .then((res) => {
          if (!res) {
            resetLogPaneLogsAndHighCharts(pane);
          } else {
            pane.logs = res.logs;
            pane.highCharts = res.highCharts;
            onChangeCurrentLogPane(pane);
          }
        })
        .catch(() => resetLogPaneLogsAndHighCharts(pane));
    },
    { wait: DEBOUNCE_WAIT }
  );

  return (
    <>
      <Input
        allowClear
        placeholder={`${i18n.formatMessage({
          id: "log.search.placeholder",
        })}`}
        className={searchBarStyles.inputBox}
        value={keywordInput}
        suffix={<SearchBarSuffixIcon />}
        onChange={(e) => {
          const keyword = e.target.value;
          onChangeKeywordInput(keyword);
          onChangeCurrentLogPane({ ...(oldPane as PaneType), keyword });
        }}
        onPressEnter={() => {
          doSearchLog.run();
        }}
      />
      <DarkTimeSelect />
      <Button
        loading={logsLoading || highChartLoading}
        onClick={() => {
          doSearchLog.run();
        }}
        className={searchBarStyles.searchBtn}
        type="primary"
        icon={<IconFont type={"icon-log-search"} />}
      >
        {i18n.formatMessage({ id: "search" })}
      </Button>
    </>
  );
};

export default RawLogQuery;