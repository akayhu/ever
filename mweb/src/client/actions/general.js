import {pickBy} from 'lodash/object';
import {getEnd, getLoading, checkForReset, getHasLoaded} from 'src/client/selectors';
import {actionMap, parameterMap, responseParser} from 'src/client/actions/utils';
import {isWrong} from 'src/util/checkTools';

export const REQUEST_DATA = 'REQUEST_DATA';
export function requestData({domain, key, option}) {
	return {
		type: REQUEST_DATA,
		payload: {domain, key, option},
	};
}

export const RECEIVE_DATA = 'RECEIVE_DATA';
export function receiveData({domain, key, data, option}) {
	return {
		type: RECEIVE_DATA,
		payload: {domain, key, ...data, option},
	};
}

export const RECEIVE_FAIL = 'RECEIVE_FAIL';
export function receiveFail({domain, key, option}) {
	return (dispatch) => {
		dispatch({
			type: RECEIVE_FAIL,
			payload: {domain, key, option},
		});
		return Promise.reject(`FAIL [${domain}-${key}]`);
	};
}

export const REACH_END = 'REACH_END';
export function reachEnd({domain, key, option}) {
	return {
		type: REACH_END,
		payload: {domain, key, option},
	};
}

// 重置資料用
export const RESET_LIST = 'RESET_LIST';
export function resetList({domain, key, option}) {
	const args = arguments[0];
	// 如果參數理沒有傳入option，把參數中除了domain, key的東西當做option
	// 忘了為什麼要這樣做了QQ
	if (!option) option = pickBy(args, (value, key) => ['domain', 'key'].indexOf(key) === -1);
	return {
		type: RESET_LIST,
		payload: {domain, key, option},
	};
}

// 將資料放到store.entities內
export const ADD_TO_ENTITIES = 'ADD_TO_ENTITIES';
export function addToEntities({domain, key, toEntity, byIds}) {
	return {
		type: ADD_TO_ENTITIES,
		payload: {domain, key, toEntity, byIds},
	};
}

// channel(也就是社團資料)、profile等資料是動態產生的
// 當在做 試圖取得這些資料 的動作時，要先去判斷存不存在
// 若不存在則需在store.entities中初始化一筆對應的channel or profile 的entity
// 如此一來才不會發生錯誤
export const INITIAL_ENTITY = 'INITIAL_ENTITY';
export function initialEntity({domain, key, toEntity, ...option}) {
	return {
		type: INITIAL_ENTITY,
		payload: {domain, key, toEntity, option},
	};
}

export const RESET_KEY_IN_ENTITY = 'RESET_KEY_IN_ENTITY';
export function resetKeyinEntity({domain, key, toEntity, ...option}) {
	return {
		type: RESET_KEY_IN_ENTITY,
		payload: {domain, key, toEntity, option},
	};
}
/**
 * 必須傳入domain和key, option為打action時可能用到的附加資訊
 * 1. 確認是否要打API
 * 	- 是否載完了			 		    getEnd
 * 	- 是否正在載入			 		 getLoading
 * 2. 打API前準備
 * 	- 組合要送的參數					 parameterMap
 * 	- 得到要打的api					actionCreator
 * 	- 發送請求action		 		 dispatch(requestData({domain, key, option}))
 * 3.	發送API
 * 	- 發送打API的action			 dispatch(actionCreator(parameter))
 * 	- 判斷回傳結果是否正常		isWrong(response)
 * 			-錯誤，停止後續動作		 dispatch(receiveFail({domain, key, option}))
 * 	- 解析回傳結果						responseParser({domain, key, response})
 * 	- 發送收到資料action     dispatch(receiveData({domain, key, data: rest, option}))
 */
export function loadListDataCenter({domain, key, ...option}) {
	return (dispatch, getState) => {
		let state = getState(option);
		// console.log(state);
		// console.log(state);
		
		if(getHasLoaded({state, domain, key, option}) && checkForReset({state, domain, key, option})){
			dispatch(resetList({domain, key, option}));
			state = getState(option);
		}
		
		// 判斷 是否end 以及 是否loading
		if (getEnd({state, domain, key, option}) || getLoading({state, domain, key, option})) {
			return Promise.resolve();
		}

		const parameter = parameterMap({state, domain, key, option});
		const actionCreator = actionMap({state, domain, key, option});

		dispatch(requestData({domain, key, option}));

		return dispatch(actionCreator(parameter)).then((res) => {
			const response = res.response;

			if (isWrong(response)) {
				return dispatch(receiveFail({domain, key, option}));
			}
			// {toEntity, byIds, end, dataList, offset}
			// rest 是放 dataList, offset，用來送到reducer做一些store的變更
			const {toEntity, byIds, end, ...rest} = responseParser({domain, key, response});
			dispatch(receiveData({domain, key, data: rest, option}));

			// 若式toEntity有值才會進入，因為不是所有api的回傳都要進入store.entities
			if (toEntity) {
				dispatch(addToEntities({domain, key, toEntity, byIds}));
			}
			
			if (end) {
				dispatch(reachEnd({domain, key, option}));
			}

			return Promise.resolve(response);
		});
	};
}
