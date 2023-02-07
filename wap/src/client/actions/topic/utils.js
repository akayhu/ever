import * as TopicApi from './topic_api';
import {keyBy} from 'lodash/collection';
import {mapStateKeyToIdtype} from '../../reducers/topic/utils';
import async from 'async';

// selectors
import {getInfoByKey, getFunc} from '../../reducers/topic/selectors';

const normalBlock = ['followed', 'gallery', 'honor', 'channel', 'group'];
const nestedBlock = ['news', 'endorse', 'related'];
const special = ['initialEndorse', 'initialRelated', 'initialHonor'];
const allBlockName = [...normalBlock, ...nestedBlock, ...special];

// 確認key是否為巢狀項目
export function isNestedBlock(key) {
	if (nestedBlock.indexOf(key) !== -1)
		return true;
	return false;
}

// 確認key是否存在[allBlockName], 需要subkey的話，是否有傳入
export function isErrorInput(key, subkey) {
	if (allBlockName.indexOf(key) === -1) {
		console.error(`Invalid key: ${key}`);
		return true;
	}
	if (nestedBlock.indexOf(key) !== -1 && !subkey) {
		console.error(`${key} should has a subKey name`);
		return true;
	}
	return false;
}

// 根據state, key, subkey產生打api所需的參數
export function parameterMap(state, key, subkey, options = {}) {
	const getInfoByType = getInfoByKey(state, key, subkey);
	switch (key) {
		case 'news':
			return {
				funcName: getFunc(state),
				offset: getInfoByType('offset'),
				// 超過五筆會有看更多
				limit: 6,
				topic: options.topic || ''
			};
		case 'followed':
		case 'gallery':
		case 'group':
		case 'honor':
			return {
				func: getFunc(state),
				offset: getInfoByType('offset'),
				limit: 10
			};
		case 'endorse':
			return {
				func: getFunc(state),
				item: subkey,
				offset: getInfoByType('offset'),
				limit: 10
			};
		case 'related':
			return {
				func: subkey,
				offset: getInfoByType('offset'),
				limit: 10
			};
		case 'initialEndorse':
		case 'initialRelated':
		case 'channel':
		case 'initialHonor':
			return {
				func: getFunc(state)
			};
		default:
			return options;
	}
}

// 根據key回傳對應的Api 函式
export function actionMap(key) {
	switch (key) {
		case 'news':
			return TopicApi.getWorkspaceListHot;
		case 'related':
		case 'followed':
			return TopicApi.getFollowedList;
		case 'gallery':
			return TopicApi.getGalleryList;
		case 'honor':
			return TopicApi.getHonorList;
		case 'channel':
			return TopicApi.initMediaSection;
		case 'group':
			return TopicApi.initGroupSection;
			// return TopicApi.getGroupList;
		case 'endorse':
			return TopicApi.getEndorsePeopleList;
		case 'initialEndorse':
			return TopicApi.initEndorseSection;
		case 'initialRelated':
			return TopicApi.initRelatedSection;
		case 'initialHonor':
			return TopicApi.initHonorSection;
		default:
			return null;
	}
}

// 根據key回傳在entities中對應到的類型
function mapStateKeyToIteratee(key) {
	const idType = mapStateKeyToIdtype(key);
	switch (idType) {
		case 'person': return 'pid';
		case 'channel': return 'id';
		case 'activity': return 'aid';
		case 'honor': return 'eventId';
		default: return '';
	}
}

// 將source根據key轉成ids ([id...])和 byIds ({id1: {...}, id2: {...}})
export function getIdsAndByIds(source, key, iteratee) {
	// 紀錄第一筆是誰
	if (source.length > 0) source[0]['first'] = true;
	const _iteratee = iteratee || mapStateKeyToIteratee(key);
	const byIds = keyBy(source, _iteratee);
	const ids = Object.keys(byIds);
	return {byIds, ids};
}

// 根據key, subkey去判斷此項目是否已經在載入中
export function notLoadData(state, key, subkey) {
	if (getInfoByKey(state, key, subkey)('isLoading') || getInfoByKey(state, key, subkey)('isEnd'))
		return true;
	return false;
}

/**
 將巢狀資料(initialEndorse, initialRelated)成
 {
	 subkey1: {data1}
	 subkey2: {data2}
	 subkey3: {data3}
	 subkey4: {data4}
 }
*/
export function extractFromNestedData(source) {
	return source.reduce((final, curr) => ({...final, [curr.id]: curr}), {});
}

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const raceWithDelay = (p, d) => callback => Promise.race([p(), d]).then(() => callback(null));
export const requestWrapper = ms => (dispatch, requestFn) => (actions) => {
	const funcArray = actions.map((action) => {
		const reqPromise = dispatch.bind(this, requestFn(action));
		const delayPromise = delay(ms);
		return raceWithDelay(reqPromise, delayPromise);
	});
	async.series(funcArray);
};
