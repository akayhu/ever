import req from "./https";
import { arrayChangeStrQuery, filterQueries } from "@/utils/queryString";

// 新增Cue表專案型服務
export const apiPostCueProjectId = params => {
  return req(
    "post",
    `/cue/project/${params.projectId}/projectService`,
    params,
    "apiPostCueProjectId"
  );
};

// 刪除Cue表專案型服務
export const apiDeleteCueProjectId = params => {
  const cueProjectServiceId = arrayChangeStrQuery(
    "cueProjectServiceId",
    params.cueProjectServiceId
  );
  return req(
    "delete",
    `/cue/project/${params.projectId}/projectService?${cueProjectServiceId}`,
    filterQueries(params, ["cueProjectServiceId"]),
    "apiDeleteCueProjectId"
  );
};

// 依專案型服務查詢該服務拉Cue清單
export const apiGetCueProjectId = params => {
  return req(
    "get",
    `/cue/project/${params.projectId}/projectService/${params.id}`,
    params,
    "apiGetCueProjectId"
  );
};

// 將專案型服務加入Cue中(無法取消)
export const apiPutCueProjectId = params => {
  return req(
    "put",
    `/cue/quotation/${params.quotationId}/projectService/${params.id}`,
    params.modifyCueProjectService,
    "apiPutCueProjectId"
  );
};

// 依報價專案查詢Cue表專案型服務
export const apiGetCueQuotationProjectId = params => {
  return req(
    "get",
    `/cue/quotation/project/${params.id}`,
    params,
    "apiGetCueQuotationProjectId"
  );
};
