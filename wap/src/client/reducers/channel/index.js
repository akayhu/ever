import { combineReducers } from 'redux';
import mediaNewActivity from './list/mediaNewActivity';
import channelList from './list/channelList';
import channelInfo from './info/channelInfo';

const channel = combineReducers({
	channelList,
	channelInfo,
	mediaNewActivity
});

export default channel;

export function getChannelInfo(state) {
	return state.channelInfo.mediaInfo;
}
export function getChannelInfoData(state) {
	return getChannelInfo(state).dataInfo;
}
export function getChannelId(state) {
	return getChannelInfoData(state).id;
}
export function getIsAdmin(state) {
	return getChannelInfoData(state).isAdmin;
}
export function getIsEditor(state) {
	return getChannelInfoData(state).isEditor;
}
export function getDataByKey(state, key) {
	return transByCategory(state, key, '');
}
export function getTab(state, category) {
	return transByCategory(state, category, 'tab');
}
export function getDataList(state, category) {
	return transByCategory(state, category, 'dataList');
}
export function getCurrentCount(state, category) {
	return transByCategory(state, category, 'total');
}
export function getCurrentOffset(state, category) {
	return transByCategory(state, category, 'offset');
}
export function getIsLoading(state, category) {
	return transByCategory(state, category, 'loading');
}
export function getHasNext(state, category) {
	return transByCategory(state, category, 'hasNext');
}
export function filterMember(state, category) {
	return state.filter(member => (
		//	role
		//	0為一般成員
		// 	1為編輯者
		//  2為管理員
		// 【頻道成員】tab時顯示全部人
		category === 'admin' ? member.role !== 0 : true
	));
}
export function inChannelList(category) {
	return ['all', 'joined', 'recommend'].indexOf(category) !== -1;
}
export function inChannelInfo(category) {
	return ['channelActivity', 'channelMember', 'channelAdmin', 'mediaInfo', 'searchKeyword'].indexOf(category) !== -1;
}
function transByCategory(state, category, key) {
	if (inChannelList(category)) return key ? state.channelList[category][key] : state.channelList[category];
	if (inChannelInfo(category)) {
		// tab放在不同階層另外處理，建議console出state做檢查
		if (key === 'tab') return state.channelInfo[key];
		return key ? state.channelInfo[category][key] : state.channelInfo[category];
	}

	return key ? state[category][key] : state[category];
}
