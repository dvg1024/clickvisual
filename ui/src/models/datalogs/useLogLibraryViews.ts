import { useState } from "react";
import useRequest from "@/hooks/useRequest/useRequest";
import api, { CreatedViewRequest, ViewResponse } from "@/services/dataLogs";
import { formatMessage } from "@@/plugin-locale/localeExports";
import { message } from "antd";

export default function useLogLibraryViews() {
  const [visibleDraw, setVisibleDraw] = useState<boolean>(false);
  const [visibleFormModal, setVisibleFormModal] = useState<boolean>(false);
  const [isModifyLog, setIsModifyLog] = useState<boolean>(false);
  const [isAssociatedLinkLogLibrary, setIsAssociatedLinkLogLibrary] =
    useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [editView, setEditView] = useState<CreatedViewRequest | undefined>();
  const [viewList, setViewList] = useState<ViewResponse[]>([]);
  const [currentEditLogLibrary, setCurrentEditLogLibrary] = useState<any>();

  const onChangeVisibleDraw = (visible: boolean) => {
    setVisibleDraw(visible);
  };
  const onChangeVisibleFormModal = (visible: boolean) => {
    setVisibleFormModal(visible);
  };
  const onChangeIsModifyLog = (visible: boolean) => {
    setIsModifyLog(visible);
  };

  const onChangeIsAssociatedLinkLogLibrary = (flag: boolean) => {
    setIsAssociatedLinkLogLibrary(flag);
  };

  const onChangeCurrentEditLogLibrary = (val: any) => {
    setCurrentEditLogLibrary(val);
  };

  const onChangeIsEdit = (flag: boolean) => {
    setIsEdit(flag);
  };

  const getViewList = useRequest(api.getViews, {
    loadingText: false,
    onSuccess: (res) => setViewList(res.data),
  });

  const createdView = useRequest(api.createdView, {
    loadingText: false,
    onSuccess() {
      message.success(
        formatMessage({
          id: "datasource.logLibrary.views.success.created",
        })
      );
    },
  });

  const updatedView = useRequest(api.updatedView, {
    loadingText: false,
    onSuccess() {
      message.success(
        formatMessage({
          id: "datasource.logLibrary.views.success.updated",
        })
      );
    },
  });

  const deletedView = useRequest(api.deletedView, {
    loadingText: false,
    onSuccess() {
      message.success(
        formatMessage({
          id: "datasource.logLibrary.views.success.deleted",
        })
      );
    },
  });

  const getView = useRequest(api.getViewInfo, {
    loadingText: false,
    onSuccess: (res) => {
      setEditView({
        id: res.data.id,
        viewName: res.data.name,
        isUseDefaultTime: res.data.isUseDefaultTime,
        key: res.data.key,
        format: res.data.format,
      });
    },
  });

  return {
    viewsVisibleDraw: visibleDraw,
    viewVisibleModal: visibleFormModal,
    viewIsEdit: isEdit,
    isModifyLog,
    isAssociatedLinkLogLibrary,
    currentEditLogLibrary,
    onChangeViewVisibleModal: onChangeVisibleFormModal,
    onChangeViewsVisibleDraw: onChangeVisibleDraw,
    onChangeViewIsEdit: onChangeIsEdit,
    onChangeIsModifyLog,
    onChangeCurrentEditLogLibrary,
    onChangeIsAssociatedLinkLogLibrary,
    getViewList,
    createdView,
    updatedView,
    deletedView,
    doGetViewInfo: getView,
    viewList,
    editView,
  };
}
