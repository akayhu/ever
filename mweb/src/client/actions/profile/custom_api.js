import { keyBy } from 'lodash/collection';
import * as ProfileApi from './profile_api';
import * as PrivacyApi from 'src/client/actions/privacy';
import * as Connection from 'src/client/actions/connection';
import {
	loadListDataCenter,
	initialEntity,
	receiveFail,
	addToEntities
} from 'src/client/actions/general';
import clientConfig from 'src/configs/client';
import {isWrong} from 'src/util/checkTools';
const {actions: {metadata : {setMetadata}}} = require('c_platform');

/**
 * 在這裡打的action的paylord domain會是'profile', toEntity會是'profiles'
 */
const domain = 'profile';
const toEntity = 'profiles';


/**
 * 當profile接收到非PageModel的資料使用的
 * 目前用於
 * 	-	訪客紀錄(getGuestRecord)
 *  - 學經歷程就(getAllExp)
 */
export const RECEIVE_PROFILE_DATA = 'RECEIVE_PROFILE_DATA';
export const receiveProfileData = ({domain, key, ...option}) => ({
	type: RECEIVE_PROFILE_DATA,
	payload: {domain, key, option},
});


/**
 * 初始化entities.profiles[targetPid]，為一個空的profileEntity
 * 目前用於
 * 	-	changeProfilePage
 */
export const INITIAL_EMPTY_PROFILE = 'INITIAL_EMPTY_PROFILE';
export const initialEmptyProfile = ({domain, key, ...option}) => ({
	type: INITIAL_EMPTY_PROFILE,
	payload: {domain, key, option},
});

/**
 * 切換profile頁面用的
 * 1. 先檢查entities.profiles[targetPid]裡面是否存在，沒有的話會初始化一個profileEntity
 * 2. 若tab = activity時會先檢查是否載入過了，沒有才載入
 * 3. 若tab = info時會先檢查是否載入過了，沒有的話走initProfilePage
 *
 * @param {number} pid - 對方的pid
 * @param {number} tab - 要切換的分頁名(info, activity)
 * @param {number} notLoadInfo - 不載入info頁面的資料，用在initProfilePage
 */
export const CHANGE_PROFILE_PAGE = 'CHANGE_PROFILE_PAGE';
export const changeProfilePage = ({tab, targetPid, notLoadInfo}) => (dispatch, getState) => {
	dispatch({
		type: CHANGE_PROFILE_PAGE,
		payload: {pid: targetPid, tab},
	});

	if (!getState().entities.profiles[targetPid]) {
		const key = 'init';
		dispatch(initialEmptyProfile({domain, key, targetPid}));
	}
	if (tab === 'activity') {
		if (!getState().entities.profiles[targetPid].activity.hasLoaded) {
			return dispatch(loadListDataCenter({domain: 'profile', key: 'activity', targetPid}));
		}
	} else if (tab === 'info' && !notLoadInfo) {
		if (!getState().entities.profiles[targetPid].hasLoaded) {
			return dispatch(initProfilePage(targetPid));
		}
	}
};


/**
 * 取得viewAs
 * 1. 先取的人脈關係getConnectionStatus，根據關係設定viewAs
 *
 * @param {number} targetPid - 要取的viewAs的pid
 */
export const GET_VIEW_AS = 'GET_VIEW_AS';
export const getViewAs = targetPid => dispatch => dispatch(ProfileApi.getConnectionStatus({targetPid})).then((res) => {
	const response = res.response;
	if (isWrong(response)) {
		return Promise.reject('INIT_ERROR[profile}]');
	}
	
	const responseTargetPid = response[targetPid];
	let pid = null;
	let connectionStatus = 0;
	let subscribeStatus = false;
	let notificationStatus = false;
	let viewAs;
	
	if(responseTargetPid){
		pid = responseTargetPid.pid;
		connectionStatus = responseTargetPid.connectionStatus;
		subscribeStatus = responseTargetPid.subscribeStatus;
		notificationStatus = responseTargetPid.notificationStatus;
	}
	
	if (pid === parseInt(targetPid, 10)) {
		viewAs = 'self';
	} else if (connectionStatus === 3) {
		viewAs = 'friend';
	} else {
		viewAs = 'other';
	}
	dispatch({type: GET_VIEW_AS, payload: {viewAs, connectionStatus, subscribeStatus, notificationStatus}});
	return Promise.resolve({viewAs, connectionStatus});
});

/**
 * 進入profile頁時初始化用
 * 1. 先取的viewAs
 * 2. 根據profile有沒有載入過去設訂dummyPromise
 * 		有: dummyPromise = () => Promise.resolve()
 * 		無: dummyPromise 會先去取得profile的資料(userInfo) -> 初始化entities.profiles[targetPid] -> 載入profile其他區塊的資料
 *
 * @param {number} targetPid - profile的pid
 */
export const initProfilePage = targetPid => (dispatch, getState) => {
	const profileEntities = getState().entities.profiles;
	const key = 'info';
	let dummyPromise;

	const handleAllowReadProfile = () => dispatch(PrivacyApi.isAllowReadProfile({pidList: targetPid})).then((res) => {
		const response = res.response;
		if (isWrong(response)) {
			return dispatch(receiveFail({domain, key, option: {targetPid}}));
		}
	})

	// 檢查是否已經存在於state.entities.profiles了
	if (!profileEntities[targetPid] || !profileEntities[targetPid].hasLoaded) {
		// 去撈profile的資料來初始state.entities.profiles[targetPid]
		dummyPromise = () => dispatch(ProfileApi.loadProfile({pid: targetPid}))
			.then(({response}) => {
				if (isWrong(response)) {
					return dispatch(receiveFail({domain, key, option: {targetPid}}));
				}
				
				if(response){
					dispatch(setMetadata('profile',{
						pid: response.pid,
						title: response.userName + ' - 104 職涯社群',
						description: response.introduction,
						image: response.avatarWebUrl,
						userName: response.userName,
						location: response.location,
						companyName: response.companyName,
						jobTitle: response.jobTitle,
						url: 'https:' + clientConfig.params.wapUrl+"/profile/"+response.pid
					}));
				}else{
					dispatch(setMetadata('profile'));
				}
				
				dispatch(initialEntity({domain, key, toEntity, targetPid, source: response}));
				// 取得其他profile區塊的資料
				return dispatch(initLoadProcess(targetPid));
			});
	} else {
		dummyPromise = () => Promise.resolve();
	}

	dispatch(changeProfilePage({tab: 'info', targetPid, notLoadInfo: true}));

	return dispatch(getViewAs(targetPid))
		.then(({viewAs, connectionStatus}) => {
			if (connectionStatus === 4) return Promise.reject('IS BLOCK');
		})
		.then(handleAllowReadProfile)
		.then(dummyPromise)
		.then(() => {
			const userPid = getState().user.pid;
			
			if((userPid/1 === targetPid/1) || userPid/1 === -3){
				return Promise.resolve();
			}
			
			return dispatch(ProfileApi.viewProfile({
				// productKey: clientConfig.params.apnum,
				pid: userPid,
				targetPid
			}));
		})
		.then(() => Promise.resolve(`SUCCESS INIT [${domain}-${key}]`));
};

/**
 * 取得 profile 的區塊資料
 * guest, event, gallery, appraise, endorse, colleague
 *
 * @param {number} targetPid - profile的pid
 */
export const initLoadProcess = targetPid => (dispatch) => {
	let gallery = 1, endorse = 1, colleague = 1, appraise = 1;
		// 檢查隱私設定
	return dispatch(PrivacyApi.queryPrivacyInfo({pid: targetPid}))
			.then(({response}) => {
				({gallery, endorse, colleague, appraise} = response);
				return Promise.resolve();
			})
			.then(() => dispatch(getGuestRecord(targetPid)))
			.then(() => dispatch(getAllExp(targetPid)))
			.then(() => {
				if (gallery){
					return dispatch(loadListDataCenter({domain, key: 'gallery', targetPid})).then((res) => {
						var dataList = res ? res.dataList : [];
						
						const domain = 'singlePage';
						const key = 'gallery';
						const toEntity = 'activities';
						const byIds = keyBy(dataList, 'aid');
						dispatch(addToEntities({domain, key, toEntity, byIds}));
					})
				}else{
					return Promise.resolve();
				}
			})
			.then(() => appraise ? dispatch(loadListDataCenter({domain, key: 'appraise', targetPid})) : Promise.resolve())
			.then(() => endorse ? dispatch(loadListDataCenter({domain, key: 'endorse', targetPid})) : Promise.resolve())
			.then(() => colleague ? dispatch(loadListDataCenter({domain, key: 'colleague', targetPid})) : Promise.resolve())
			.then(() => Promise.resolve(`SUCCESS initLoadProcess[${targetPid}]`));
			// 上面單純只是想要讓他造順序call而已
};

/**
 * 取得訪客紀錄數字
 *
 * @param {number} targetPid - profile的pid
 */
export const getGuestRecord = targetPid => (dispatch) => {
	const key = 'guest';

	return dispatch(ProfileApi.queryViewerCount({targetPid})).then((res) => {
		const response = res.response;
		if (isWrong(response)) {
			return dispatch(receiveFail({domain, key}));
		}

		dispatch(receiveProfileData({domain, key, targetPid, source: response}));
		return Promise.resolve(`SUCCESS [${domain}-${key}]`);
	});
};

/**
 * 取得用戶訪客紀錄
 *
 * @param {number} targetPid - profile的pid
 */
export const getGuestRecordOfUser = targetPid => (dispatch) => {
	const key = 'guest_user';

	return dispatch(ProfileApi.queryViewer({targetPid})).then((res) => {
		const response = res.response;
		if (isWrong(response)) {
			return dispatch(receiveFail({domain, key}));
		}

		dispatch(receiveProfileData({domain, key, targetPid, source: response}));
		return Promise.resolve(`SUCCESS [${domain}-${key}]`);
	});
};

/**
 * 取得企業訪客紀錄
 *
 * @param {number} targetPid - profile的pid
 */
export const getGuestRecordOfComp = targetPid => (dispatch) => {
	const key = 'guest_comp';

	return dispatch(ProfileApi.queryViewerFromPro({targetPids: targetPid})).then((res) => {
		const response = res.response;
		if (isWrong(response)) {
			return dispatch(receiveFail({domain, key}));
		}

		dispatch(receiveProfileData({domain, key, targetPid, source: response[0]}));
		return Promise.resolve(`SUCCESS [${domain}-${key}]`);
	});
};


/**
 * 取得學歷、經歷、成就用
 *
 * @param {number} targetPid - profile的pid
 */
export const getAllExp = targetPid => (dispatch) => {
	const key = 'event';

	return dispatch(ProfileApi.loadChronicle({targetPid})).then((res) => {
		if (isWrong(res)) {
			return dispatch(receiveFail({domain, key}));
		}

		dispatch(receiveProfileData({domain, key, targetPid, source: res}));
		return Promise.resolve(`SUCCESS [${domain}-${key}]`);
	});
};


// ######### 用在profile頁的互動(交友、關注等等) #########

/**
 * 更改connection status (state.profile.connectionStatus)
 * 更改subscribe status (state.profile.subscribeStatus)
 */
export const CHANGE_CONNECTION_STATUS = 'CHANGE_CONNECTION_STATUS';
export const changeConnectionStatus = (key, status) => ({
	type: CHANGE_CONNECTION_STATUS,
	payload: {key, status},
});


/**
 * 觸發交友邀請
 *
 * @param {object} params - invite這個Api所需的參數，格式{targetPid,relationType, memo: ''}
 */
export const triggerInvite = params => dispatch => dispatch(Connection.invite(params)).then(({response}) => {
	if (isWrong(response)) {
		const { errorCode } = response;
		let msg = '發生錯誤';
		let canRetry = false;
			// 根據errorCode設定回傳的訊息，和是否可以重試
		if (errorCode === 800) {
			msg = '你的朋友數太多';
		} else if (errorCode === -800) {
			msg = '對方的朋友數太多';
		} else if (errorCode === -3) {
			msg = '無法邀請';
		} else if (errorCode === -1) {
			msg = '已經是朋友了';
			dispatch(changeConnectionStatus('connectionStatus', 3));
			return true;
		} else {
			canRetry = true;
		}

		return {errorCode, msg, canRetry};
	}
	dispatch(changeConnectionStatus('connectionStatus', 1));
	return true;
});

/**
 * 觸發刪除名片
 *
 * @param {number} targetPid - 要刪除對象之pid
 */
export const triggerDisConnect = targetPid => dispatch => dispatch(Connection.disconnect({targetPid})).then(({response}) => {
	if (isWrong(response)) {
		const { errorCode } = response;
		return {
			errorCode,
			msg: '發生錯誤',
			canRetry: true,
		};
	}
	dispatch(changeConnectionStatus('connectionStatus', 0));
	return true;
});

/**
 * 觸發收回交友邀請
 *
 * @param {number} targetPid - 要收回交友邀請對象之pid
 */
export const triggerRevoke = targetPid => dispatch => dispatch(Connection.revoke({targetPid})).then(({response}) => {
	if (isWrong(response)) {
		const { errorCode } = response;
		return {
			errorCode,
			msg: '發生錯誤',
			canRetry: true,
		};
	}
	dispatch(changeConnectionStatus('connectionStatus', 0));
	return true;
});

/**
 * 觸發接受交友邀請
 *
 * @param {number} targetPid - 要接受交友邀請對象之pid
 */
export const triggerAccept = targetPid => dispatch => dispatch(Connection.accept({targetPid})).then(({response}) => {
	if (isWrong(response)) {
		const { errorCode } = response;
		let msg = '發生錯誤';
		let canRetry = false;
			// 根據errorCode設定回傳的訊息，和是否可以重試
		if (errorCode === 800) {
			msg = '你的朋友數太多';
		} else if (errorCode === -800) {
			msg = '對方的朋友數太多';
		} else if (errorCode === -3) {
			msg = '無法邀請';
		} else if (errorCode === -1) {
			msg = '已經是朋友了';
			dispatch(changeConnectionStatus('connectionStatus', 3));
			return true;
		} else {
			canRetry = true;
		}

		return {errorCode, msg, canRetry};
	}
	dispatch(changeConnectionStatus('connectionStatus', 3));
	return true;
});

/**
 * 觸發拒絕交友邀請
 *
 * @param {number} targetPid - 要拒絕交友邀請對象之pid
 */
export const triggerReject = targetPid => dispatch => dispatch(Connection.reject({targetPid})).then(({response}) => {
	if (isWrong(response)) {
		const { errorCode } = response;
		return {
			errorCode,
			msg: '發生錯誤',
			canRetry: true,
		};
	}
	dispatch(changeConnectionStatus('connectionStatus', 0));
	return true;
});

/**
 * 觸發關注與取消關注
 *
 * @param {number} targetPid - 對方之pid
 * @param {bool} toSubscribe - 接受或取消
 */
export const triggerSubscribe = (targetPid, toSubscribe) => (dispatch) => {
	let actionShouldTrigger;
	if (toSubscribe) {
		actionShouldTrigger = Connection.subscribe;
	} else {
		actionShouldTrigger = Connection.unsubscribe;
	}
	return dispatch(actionShouldTrigger({targetPid})).then(({response}) => {
		if (isWrong(response)) {
			const { errorCode } = response;
			return {
				errorCode,
				msg: '發生錯誤',
				canRetry: true,
			};
		}
		dispatch(changeConnectionStatus('subscribeStatus', toSubscribe));
		return true;
	});
};

/**
 * 觸發接受通知與取消通知
 *
 * @param {number} targetPid - 對方之pid
 * @param {bool} toNotify - 接受或取消
 */
export const triggerNotify = (targetPid, toNotify) => dispatch => dispatch(Connection.notice({targetPid, status: toNotify})).then(({response}) => {
	if (isWrong(response)) {
		const { errorCode } = response;
		return {
			errorCode,
			msg: '發生錯誤',
			canRetry: true,
		};
	}
	dispatch(changeConnectionStatus('notificationStatus', toNotify));
	return true;
});
