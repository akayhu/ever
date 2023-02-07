import getURLQuery from 'utils/getURLQuery';
import { isValidStage } from 'utils/validation';


// 使用 query string 啟動 features，production 環境不啟用此功能
// ex: ?features=feat1,feat2
const getActiveFeaturesFromQuery = (query = getURLQuery()) => {
  if (typeof query.features === 'string' && isValidStage(['local', 'lab', 'staging'])) {
    return query.features.split(',').filter(name => name).reduce((featureMap, name) => Object.assign(featureMap, { [name]: true }), {});
  }
  return {};
};

// 功能開關
const initFeatures = {
  plusVIP: flags => isValidStage(['local', 'lab']), // 職人標章
};

export default {
  ...initFeatures,
  ...getActiveFeaturesFromQuery(),
}