export const filterQueries = (queries, filterArr) => {
  return Object.keys(queries)
    .filter(x => !filterArr.includes(x))
    .reduce((newQueries, key) => {
      newQueries[key] = queries[key];
      return newQueries;
    }, {});
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

export default {
  filterQueries,
  parseObjQuery
};
