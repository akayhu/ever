/**
 * @description 監聽各個頁面發出請求 api 的集合
 */
const watchList = [
  {
    method: "post",
    name: "api/spareMaterial/decision",
    group: "spareMaterial",
    component: "cushion/uploadMaterial"
  },
  {
    method: "put",
    name: "api/exposure",
    group: "material",
    component: "material/uploadMaterial"
  }
];

/**
 * @param paramList 綁定更新傳入參數的接口
 * @param payload 要更新進 paramList 的參數 { method: "", name: "", group: "", component: "" }
 * @description 當傳入的 payload 符合在 watchList 裡面的 api name 及 http method，更新進去 paramList 裡，且相同的 group name 只會留一個在 paramList 裡
 * @returns {array} [{ method: "", name: "", group: "", component: "" }]
 */
export const updateApiInWatchList = paramList => payload => {
  return watchList
    .reduce(
      (acc, item) => {
        if (
          payload.method === item.method &&
          payload.name.match(new RegExp(item.name))
        ) {
          acc.unshift(item);
        }
        return acc;
      },
      [...paramList]
    )
    .reduce((acc, api) => {
      if (acc.map(item => item.group).indexOf(api.group) === -1) {
        acc.push(api);
      }
      return acc;
    }, []);
};

/**
 * @param paramList 綁定更新傳入參數的接口
 * @param payload 要移除在 paramList 的參數 { method: "", name: "", group: "", component: "" }
 * @description 當傳入的 payload 符合在 watchList 裡面的 api name 及 http method，將資料從 paramList 移除裡移除
 * @returns {array} [{ method: "", name: "", group: "", component: "" }]
 */
export const deleteApiInWatchList = paramList => payload => {
  return paramList.filter(
    item => item.name !== payload.name && item.method !== payload.method
  );
};

/**
 * @param paramList 綁定比對參數的接口
 * @param payload 要比對是否有相同資料在 paramList 的陣列 [{ method: "", name: "", group: "", component: "" }]
 * @description 當 paramList 中有符合 payload 裡的資料，回傳該筆資料出去
 * @returns {object} { method: "", name: "", group: "", component: "" }
 */
export const getApiInWatchList = paramList => payload => {
  let obj = {};
  payload.forEach(payloadItem => {
    const matchedItem = paramList.find(api => {
      return api.method === payloadItem.method && api.name === payloadItem.name;
    });
    if (matchedItem) obj = { ...matchedItem };
  }, false);
  return obj;
};

export const CUSHION_UPLOAD_MATERIAL_WATCHED_API_LIST = watchList.filter(
  item => item.component === "cushion/uploadMaterial"
);

export const MATERIAL_UPLOAD_MATERIAL_WATCHED_API_LIST = watchList.filter(
  item => item.component === "material/uploadMaterial"
);
