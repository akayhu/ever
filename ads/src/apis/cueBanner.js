import req from "./https";
import { arrayChangeStrQuery, filterQueries } from "@/utils/queryString";

// 查詢合約內容(Banner-商品列表)
export const apiGetCueBannerId = params => {
  return req(
    "get",
    `/cue/banner/quotation/project/${params.id}`,
    params,
    "apiGetCueBannerId"
  );
};

// 查詢Cue表檔期預約
export const apiGetCueBannerIdReservation = params => {
  return req(
    "get",
    `/cue/banner/project/${params.id}/reservation`,
    params,
    "apiGetCueBannerIdReservation"
  );
};

// 將檔期移出Cue表
export const apiDeleteCueBannerIdReservation = params => {
  const groupId = arrayChangeStrQuery("groupId", params.groupId);
  return req(
    "delete",
    `/cue/banner/quotation/${params.quotationId}/reservation?${groupId}`,
    filterQueries(params, ["groupId"]),
    "apiDeleteCueBannerIdReservation"
  );
};

// 將檔期加入Cue表
export const apiPatchCueBannerIdReservation = params => {
  return req(
    "patch",
    `/cue/banner/quotation/${params.quotationId}/reservation`,
    params.requestCueReservations,
    "apiPatchCueBannerIdReservation"
  );
};
