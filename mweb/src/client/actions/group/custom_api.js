import * as GroupApi from './group_api';
import {loadListDataCenter, initialEntity, resetKeyinEntity} from 'src/client/actions/general';
import {idToCategory} from './utils';
import {isWrong} from 'src/util/checkTools';
import { actions as CPlatformActions } from 'c_platform';
import clientConfig from 'src/configs/client';

const domain = 'group';
const { setMetadata } = CPlatformActions.metadata;

/**
 * 當group要取得到非PageModel的資料使用的
 * 目前用於
 * 	-	請求取得所有Group的類別queryGroupCategoryList()
 * 	- 取得自己的社團的初始資料getMyGroupInitData()(有五大類)
 *
 * @param {object} {domain, key, ...option} - 內涵domain, key, 其餘的會被放入option中
 */
export const REQUEST_GROUP_DATA = 'REQUEST_GROUP_DATA';
export const requestGroupData = ({domain, key, ...option}) => ({
	type: REQUEST_GROUP_DATA,
	payload: {domain, key, ...option},
});

/**
 * 當group接收到非PageModel的資料使用的
 * 目前用於
 * 	-	請求取得所有Group的類別queryGroupCategoryList()
 * 	- 取得自己的社團的初始資料getMyGroupInitData()(有五大類)
 *
 * @param {object} {domain, key, ...option} - 內涵domain, key, 其餘的會被放入option中
 */
export const RECEIVE_GROUP_DATA = 'RECEIVE_GROUP_DATA';
export const receiveGroupData = ({domain, key, ...option}) => ({
	type: RECEIVE_GROUP_DATA,
	payload: {domain, key, ...option},
});

/**
 * 當group接收非PageModel資料發生錯誤時使用的
 * 目前用於
 * 	-	請求取得所有Group的類別queryGroupCategoryList()
 * 	- 取得自己的社團的初始資料getMyGroupInitData()(有五大類)
 * @param {object} {domain, key, ...option} - 內涵domain, key, 其餘的會被放入option中
 */
export const RECEIVE_GROUP_DATA_FAIL = 'RECEIVE_GROUP_DATA_FAIL';
export function receiveGroupDataFail({domain, key, option}) {
	return (dispatch) => {
		dispatch({
			type: RECEIVE_GROUP_DATA_FAIL,
			payload: {domain, key, option},
		});
		return Promise.reject(`FAIL [${domain}-${key}]`);
	};
}

/**
 * 切換group的tab
 * 1. 發出切換group tab的action
 * 2. 判斷此分頁(社團類別)是否有載入資料了
 * 		-若無則去撈資料，subDomain為all or activity or member需要多設定option，dispatch(loadListDataCenter({...}))
 *
 * @param {string|number} tab - 要切換的分頁名，為Group類別的子項目
 * @param {string} subDomain - 要切換的分頁類別，為'all' 或 'self' 或 'currentChannel'
 * @param {number} channelId - 要切換的社團首頁的channelId
 */
export const CHANGE_GROUP_TAB = 'CHANGE_GROUP_TAB';
export const changeGroupTab = (tab, subDomain, channelId) => (dispatch, getState) => {
	dispatch({
		type: CHANGE_GROUP_TAB,
		payload: {tab, subDomain, channelId},
	});
	/**
	 * A. 當subDomain === 'currentChannel'表示在社團獨立頁，須帶channelId
	 * 		此時的tab會為activity(文章頁)、member(成員頁)
	 *
	 * B. 當subDomain為all或是self表示在列表頁
	 * 		此時的tab會為社團分類如'知識技術','品味生活','joined', 'managed'...
	 *
	 * 要檢查切過去的分頁有沒有撈過資料，沒有的話要去打Api
	 */
	if (subDomain === 'currentChannel') {
		if (!getState().entities.channels[channelId][tab].hasLoaded) {
			return dispatch(loadListDataCenter({
				domain: domain,
				key: tab,
				channelId,
			}));
		}
	} else if (!getState().group[subDomain].byGroup[tab].hasLoaded) {
		return dispatch(loadListDataCenter({
			domain: domain,
			key: tab,
		}));
	}

	return Promise.resolve('done');
};

/**
 * 進入公開社團時要觸發的action
 * 1. 判斷是否載入過社團列表頁了 Object.keys(getState().group.all.byGroup).length > 0
 * 		-無，打GroupApi.queryGroupCategoryList()取得所有Group的類別(目前預設有四大類)
 * 		[TODO] 若此API失敗的處理
 * 2. 切換分頁state.group.tab.all到第一個類別
 */
export const initGroupPage = () => (dispatch, getState) => {
	dispatch({type: 'INIT_GROUP_PAGE'});
	const key = 'initGroupPage';
	let dummyPromise;
	const userPid = getState().user.pid;
	dispatch(setMetadata('group', {
		pid: userPid,
		title: '公開社團 - 104 職涯社群',
		url: `https:${clientConfig.params.wapUrl}/m/group`,
		mUrl: `https:${clientConfig.params.wapUrl}/m/group`,
	}));

	if (!Object.keys(getState().group.all.byGroup).length) {
		dummyPromise = () => {
			dispatch(requestGroupData({domain, key}));
			return dispatch(GroupApi.queryGroupCategoryList()).then(({response}) => {
				if (isWrong(response)) {
					return dispatch(receiveGroupDataFail({domain, key}));
				}
				return dispatch(receiveGroupData({domain, key, response}));
			});
		};
	} else {
		dummyPromise = () => Promise.resolve();
	}

	return dummyPromise()
		.then(() => {
			const firstGroupName = Object.keys(getState().group.all.byGroup)[0];
			return dispatch(changeGroupTab(firstGroupName, 'all'));
		})
		.catch((reason) => { console.info(reason); });
};

/**
 * 進入我的社團時要觸發的action
 * 1. 判斷是否載入過我的社團列表頁了 state.group.self.length > 0
 * 		-無，打GroupApi.getMyGroupInitData()取得自己的社團的初始資料(有五大類)
 * 2. 切換分頁state.group.tab.all到第一個類別
 */
export const initMyGroupPage = () => (dispatch, getState) => {
	dispatch({type: 'INIT_MY_GROUP_PAGE'});
	const key = 'initMyGroupPage';
	let dummyPromise;
	const userPid = getState().user.pid;
	dispatch(setMetadata('group', {
		pid: userPid,
		title: '我的社團 - 104 職涯社群',
		url: `https:${clientConfig.params.wapUrl}/m/myGroup`,
		mUrl: `https:${clientConfig.params.wapUrl}/m/myGroup`,
	}));

	if (!Object.keys(getState().group.self.byGroup).length) {
		dummyPromise = () => {
			dispatch(requestGroupData({domain, key}));
			return dispatch(GroupApi.getMyGroupInitData()).then(({response}) => {
				if (isWrong(response)) {
					return dispatch(receiveGroupDataFail({domain, key}));
				}
				return dispatch(receiveGroupData({domain, key, response}));
			});
		};
	} else {
		dummyPromise = () => Promise.resolve();
	}

	return dummyPromise()
	// .then((response) => {
		
	// 	console.log(response);
		
	// 	const firstGroupName = Object.keys(getState().group.self.byGroup)[0];
	// 	return dispatch(changeGroupTab(firstGroupName, 'self'));
	// });
};

/**
 * 進入社團首頁時觸發的action
 * 1. 進入initSingleGroupInfo這個function，去看entities納的channels是否存在此channelId的資料了
 * 2. 切換group的分頁
 *
 * @param {number} channelId - 要進入的社團的channelId
 */
export const initGroupActivityPage = channelId => (dispatch, getState) => {
	dispatch({type: 'INIT_GROUP_MAIN_PAGE'});
	return dispatch(changeGroupTab('activity', 'currentChannel', channelId));
};

/**
 * 進入社團首頁的成員列表時觸發的action
 * 1. 進入initSingleGroupInfo這個function，去看entities納的channels是否存在此channelId的資料了
 * 2. 切換group的分頁
 *
 * @param {number} channelId - 要進入的社團的channelId
 */
export const initGroupMemberPage = (channelId) => (dispatch, getState) => {
	dispatch({type: 'INIT_GROUP_MEMBER_PAGE'});
	return dispatch(changeGroupTab('member', 'currentChannel', channelId));
};

/**
 * 判斷entities內的channels是否已經有此channel的資料
 * 目前只用在initGroupMemberPage與initGroupMainPage
 *
 * @param {function} dispatch - store的dispatch
 * @param {function} getState - store的getState
 * @param {number} channelId - 要進入的社團的channelId
 */
export const initSingleGroupInfo = channelId => (dispatch, getState) => {
	dispatch({type: 'INIT_GROUP_MAIN_PAGE'});
	
	const key = 'initSingleGroup';
	const entity = getState().entities.channels[channelId];
	const userPid = getState().user.pid;
 // 若不存在於entities中或沒載入過，去取得groupInfo並且新增於entities.channels[channelId]
	const dummyPromise = !entity || !entity.hasLoaded
		? () => dispatch(GroupApi.getGroupInfo({channelId}))
						.then((res) => {
							let source = {};
							if (!isWrong(res.response)) {
								source = res.response;
								dispatch(setMetadata('group', {
									pid: userPid,
									title: `${source.name.substring(0, 49)} - 104 職涯社群`,
									name: source.name,
									image: {
										url: `https:${source.coverWebUrl}`,
										width: 960,
										height: 350,
									},
									description: `${source.description.substring(0, 149)} - 104 職涯社群`,
									url: `https:${clientConfig.params.wapUrl}/m/group/${channelId}`,
									mUrl: `https:${clientConfig.params.wapUrl}/m/group/${channelId}`,
								}));
							}
							dispatch(initialEntity({
								toEntity: 'channels',
								domain,
								key,
								channelId,
								source,
							}));
							
							return res.response;
						})
		: () => Promise.resolve(entity.channelInfo);
	return dummyPromise();
}

export function triggerApplyJoinGroup(channelId, joinSetting) {
	return dispatch =>
		dispatch(GroupApi.applyJoinGroup({ channelId })).then(res => {
			if (res.response) {
				// const resetCategory = joinSetting ? 'waitForJoin' : 'joined';
				
				// dispatch(setShouldReset(resetCategory));
				// dispatch(loadDataByCategory('myGroupTitle'));
				
				dispatch(resetKeyinEntity({
					toEntity: 'channels',
					domain,
					key: 'resetKeyinEntity',
					channelId,
					resetKey: {
						isApplying: (joinSetting ? true : false),
						isMember: (joinSetting ? false : true)
					},
				}));
				
				return true;
			}
			
			return false;
		});
}

export function triggerCancelApplyJoin(channelId) {
	return dispatch =>
		dispatch(GroupApi.cancelApplyJoin({ channelId })).then(res => {
			if (res.response) {
				// dispatch(setShouldReset(category));
				
				// if (categoryId) {
				// 	dispatch(setShouldReset(idToCategory(categoryId)));
				// }
				
				// dispatch(loadDataByCategory('myGroupTitle'));
				
				dispatch(resetKeyinEntity({
					toEntity: 'channels',
					domain,
					key: 'resetKeyinEntity',
					channelId,
					resetKey: {
						isApplying: false,
						isMember: false
					},
				}));
				
				return true;
			}
			
			return false;
		});
}

export function triggerLeaveGroup(channelId) {
	return dispatch =>
		dispatch(GroupApi.leaveGroup({ channelId })).then(res => {
			if (res.response) {
				// dispatch(setShouldReset(category));
				// dispatch(setShouldReset(idToCategory(categoryId)));
				// dispatch(loadDataByCategory('myGroupTitle'));
				
				dispatch(resetKeyinEntity({
					toEntity: 'channels',
					domain,
					key: 'resetKeyinEntity',
					channelId,
					resetKey: {
						isAdmin: false,
						isApplying: false,
						isMember: false,
						isHead: false,
						noticeStatus: false
					},
				}));
				
				return true;
			}
			
			return false;
		});
}

export function triggerNoticeStatus(channelId, noticeStatus, type) {
	return dispatch =>
		dispatch(GroupApi.setNoticeStatus({targetId: channelId, status: noticeStatus, type})).then(res => {
			if (res.response) {
				// dispatch(setShouldReset(category));
				// dispatch(setShouldReset(idToCategory(categoryId)));
				// dispatch(loadDataByCategory('myGroupTitle'));
				
				dispatch(resetKeyinEntity({
					toEntity: 'channels',
					domain,
					key: 'resetKeyinEntity',
					channelId,
					resetKey: {
						noticeStatus: noticeStatus
					},
				}));
				
				return true;
			}
			
			return false;
		});
}

// export const setShouldReset = (category) => ({
// 	type: SET_SHOULD_RESET,
// 	category
// });
