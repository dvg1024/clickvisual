import IconFont from "@/components/IconFont";
import { QueryTypeEnum } from "@/config/config";
import { PaneType } from "@/models/datalogs/types";
import searchBarStyles from "@/pages/DataLogs/components/SearchBar/index.less";
import useUrlState from "@ahooksjs/use-url-state";
import { useModel } from "@umijs/max";
import { Button } from "antd";
import { useEffect, useMemo } from "react";

const OtherSearchBar = ({ isShowSwitch }: { isShowSwitch: boolean }) => {
  const [usrState] = useUrlState<any>();
  const {
    statisticalChartsHelper,
    logPanesHelper,
    currentLogLibrary,
    onChangeCurrentLogPane,
    logsLoading,
    highChartLoading,
    onChangeInitValue,
    keywordInput,
  } = useModel("dataLogs");
  const { logPanes } = logPanesHelper;
  const { activeQueryType, setActiveQueryType } = statisticalChartsHelper;

  const oldPane = useMemo(() => {
    if (!currentLogLibrary?.id) return;
    return logPanes[currentLogLibrary?.id.toString()];
  }, [currentLogLibrary?.id, logPanes]);

  const handleClick = () => {
    const queryType =
      activeQueryType === QueryTypeEnum.LOG
        ? QueryTypeEnum.TABLE
        : QueryTypeEnum.LOG;
    setActiveQueryType(queryType);
    queryType == QueryTypeEnum.TABLE && onChangeInitValue(keywordInput || "");
    onChangeCurrentLogPane({ ...(oldPane as PaneType), queryType });
  };

  useEffect(() => {
    if (usrState?.mode == 1) {
      handleClick();
    }
  }, [usrState?.mode]);

  return (
    <>
      {isShowSwitch && (
        <Button
          onClick={handleClick}
          loading={logsLoading || highChartLoading}
          className={searchBarStyles.checkBtn}
          icon={<IconFont type={"icon-switch"} />}
        ></Button>
      )}
    </>
  );
};
export default OtherSearchBar;
