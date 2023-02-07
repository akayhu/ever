import { forEach } from 'lodash/collection';
import {loadListDataCenter} from 'src/client/actions/general';
import { loadUserConfigByType, updatePersonalConfig } from 'src/client/actions/global';
import { saveUserConfig } from 'src/client/actions/utils';

/**
 * changeMainTab - 切換到其他分頁用(latest, all)
 * 換頁時會去檢察分頁是否有載過資料，沒有的話再去撈
 *
 * @param {string} tab - 切換的分頁(hot, latest, all)
 */
export const CHANGE_MAIN_TAB = 'CHANGE_MAIN_TAB';
export const changeMainTab = (tab, paramsTab, typeList) => (dispatch, getState) => {
	dispatch({
		type: CHANGE_MAIN_TAB, payload: {tab},
	});
	dispatch(updatePersonalConfig({
		pid: getState().user.pid,
		updateData: JSON.stringify([{
			type: typeList,
			value: paramsTab
		}])
	}))
	if (!getState().main[tab].hasLoaded) {
		return dispatch(loadListDataCenter({domain: 'main', key: tab}));
	}
	return Promise.resolve('done');
};

/**
 * 進入首頁時初始化用
 * 會先去檢查首頁(state.main.hot)是否有載過資料，沒有的話再去撈
 */
export const initMainPage = (typeList, optionDesc) => (dispatch, getState) => {
	if (!getState().main.hot.hasLoaded) {
		dispatch(loadUserConfigByType({
			pid: getState().user.pid,
			typeList
		})).then(res => {
			const key = changeKey(res.response[0].value, optionDesc) || 'hot';
			
			dispatch({
				type: CHANGE_MAIN_TAB, payload: {tab: key},
			});
			
			dispatch(saveUserConfig(typeList, res.response[0].value))
			return dispatch(loadListDataCenter({domain: 'main', key}));
		})
	}
	return Promise.resolve('done');
};

// 連續寫十幾個小時了不好意思寫出這種廢code
function changeKey(key, optionDesc) {
	let returnValue;
	forEach(Object.keys(optionDesc), (value) => {
		if (optionDesc[value] === key) {
			returnValue = value;
		}
	})
	return returnValue;
}
