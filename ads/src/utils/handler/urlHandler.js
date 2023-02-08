import { parse, format } from "url";
import { encode } from "querystring";
import isEmpty from "lodash/isEmpty";

/**
 * 強制將各型態網址加上 protocol https
 * @param originalUrl {string} 原url
 * @return {string}
 */
export function setHttps(originalUrl) {
  return originalUrl.replace(/^(.*?)\/\//g, "https://");
}

/**
 * 強制刪除 jobsource
 * @param originalUrl {string} 原URL
 * @return {string}
 */
export function removeJobSource(originalUrl) {
  const urlObject = parse(setHttps(originalUrl), true);
  if (
    !urlObject.query.hasOwnProperty("jobsource") &&
    !urlObject.query.hasOwnProperty("jobSource")
  ) {
    return originalUrl;
  }
  const filteredQuery = Object.keys(urlObject.query)
    .filter(key => key.toLowerCase() !== "jobsource")
    .reduce((obj, key) => {
      obj[key] = urlObject.query[key];
      return obj;
    }, {});
  urlObject.query = filteredQuery;
  urlObject.search = !isEmpty(filteredQuery) ? `?${encode(filteredQuery)}` : "";
  return format(urlObject);
}

export default {
  removeJobSource,
  setHttps
};
