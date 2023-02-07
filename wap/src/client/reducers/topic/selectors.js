import {isErrorInput, isNestedBlock, mapStateKeyToIdtype} from './utils';
// selectors
import {getActivitiesByAids} from '../activity/selectors';

const emptyObj = {};
const emptyArr = [];

// 取得topic store
function topicState(state) {
	return state.topic;
}
function isEmptyObj(obj) {
	return obj === undefined || !Object.keys(obj).length;
}
// 拿到目前的取得目前瀏覽的職務類別
export function getFunc(state) {
	return topicState(state).func;
}
// 拿到所有的職務類別
export function getAllFunc(state) {
	return topicState(state).allFunc;
}
// 拿到by的職務類別
export function getByFunc(state) {
	return topicState(state).byFunc;
}
// 根據key和所要拿到的資料(ids, isLoading, isEnd,....回傳對應的資料)
export function getInfoByKey(state, key, subkey) {
	return (infoType) => {
		const {byFunc, func} = topicState(state);
		const targetStore = byFunc[func];

		if (targetStore === undefined || isEmptyObj(targetStore[key])) {
			return infoType === 'ids' ? [] : false;
		}

		if (isNestedBlock(key)) {
			return targetStore[key][subkey][infoType];
		}

		return targetStore[key][infoType];
	};
}

// 根據ids拿到對應的資料
export function getDataByIdsAndKey(state, ids, key, subkey) {
	if (isErrorInput(key, subkey)) return [];

	const idtype = mapStateKeyToIdtype(key);

	if (idtype === 'activity') {
		return getActivitiesByAids(state.activity, ids);
	}

	const {entities} = topicState(state);

	return ids.map(id => entities[idtype][id]);
}
// 拿到抹項目的所有資料，主要用在有巢狀的項目

export function getNestedDataByKey(state, key) {
	const {byFunc, func} = topicState(state);
	const targetStore = byFunc[func];

	if (targetStore === undefined || targetStore[key] === undefined) {
		return emptyObj;
	}
	return targetStore[key];
}

export function getBlockLoading(state, key) {
	return topicState(state).isLoading[key];
}
