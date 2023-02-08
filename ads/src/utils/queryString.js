export const stringifyObjQuery = query => {
  if (!(typeof query === "object" && query !== null)) return "";
  let str = "";
  Object.keys(query).forEach((key, index) => {
    let prefix = index ? "&" : "";
    str += `${prefix + key}=${JSON.stringify(query[key])}`;
  });
  return str;
};

export const arrayChangeStrQuery = (queryKey, queryArray) => {
  if (!Array.isArray(queryArray)) return "";
  let str = "";
  queryArray.forEach((key, index) => {
    let prefix = index ? "&" : "";
    str += `${prefix + queryKey}=${key}`;
  });
  return str;
};

export const stringifyAryQuery = query => {
  if (!Array.isArray(query)) return "";
  return query.map(item => stringifyObjQuery(item)).join(",");
};

export const parseObjQuery = query => {
  if (typeof query !== "string") return {};
  let obj = {};
  query.split("&").forEach(param => {
    let [key, val] = param.split("=");
    obj[key] = JSON.parse(val);
  });
  return obj;
};

export const parseAryQuery = query => {
  if (typeof query !== "string") return [];
  return query.split(",").map(param => parseObjQuery(param));
};

export const filterQueries = (queries, filterArr) => {
  return Object.keys(queries)
    .filter(x => !filterArr.includes(x))
    .reduce((newQueries, key) => {
      newQueries[key] = queries[key];
      return newQueries;
    }, {});
};

export default {
  stringifyObjQuery,
  stringifyAryQuery,
  parseAryQuery,
  parseObjQuery,
  filterQueries,
  arrayChangeStrQuery
};
