import req from "./https";

// 依專案查詢預約檔期
export const apiGetReservation = params => {
  return req("get", `/reservation?${params}`, null, "getReservation");
};

// 新增預約檔期
export const apiPostReservation = params => {
  return req("post", "/reservation", params, "postReservation");
};

// 刪除預約檔期
export const apiDeleteReservation = params => {
  return req(
    "delete",
    `/reservation/${params.id}`,
    params,
    "deleteReservation"
  );
};

// 修改預約檔期
export const apiPatchReservation = params => {
  return req("patch", `/reservation/${params.id}`, params, "patchReservation");
};

// 依專案預約者與委刊單期間取得委刊單號
export const apiGetReservationOrder = params => {
  return req("get", "/reservation/order", params, "getReservationOrder");
};

// 依委刊單號取得簡要檔期資訊
export const apiGetReservationOrderId = params => {
  return req(
    "get",
    `/reservation/order/${params.id}`,
    params,
    "getReservationOrderId"
  );
};

// 依委刊單號取得簡要檔期資訊
export const apiGetReservationCalendar = params => {
  return req("get", "/reservation/calendar", params, "getReservationCalendar");
};

// 依預約編號取得已預約檔期
export const apiGetReservationSchedule = params => {
  return req(
    "get",
    `/reservation/${params.reservationId}/schedule`,
    params,
    "getReservationSchedule"
  );
};

// 依專案和關鍵字查詢版位
export const apiGetReservationProjectSuggest = params => {
  return req(
    "get",
    `/reservation/project/${params.projectId}/board/suggest`,
    params,
    "getReservationProjectSuggest"
  );
};
