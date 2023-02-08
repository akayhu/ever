import req from "./https";

export const apiGetSummary = params => {
  //   return req("get", `/dashboard/all`, params);
  return new Promise((resolve, reject) => {
    let res = {
      unUpload: Math.floor(Math.random() * 2),
      unCue: Math.floor(Math.random() * 2),
      unDelete: Math.floor(Math.random() * 2)
    };
    setTimeout(() => {
      resolve(res);
    }, 1000);
  });
};

export const apiGetReservation = params => {
  return req(
    "get",
    `/dashboard/reservation-list?${params}`,
    null,
    "getReservation"
  );
};

export const apiGetExpiredReservation = params => {
  return req(
    "get",
    `/dashboard/expired-reservation`,
    params,
    "getExpiredReservation"
  );
};
