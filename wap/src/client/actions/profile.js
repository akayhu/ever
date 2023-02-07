import Promise from 'bluebird';
import { loadDataCenter, setPrivacy, isAllowReadProfile } from 'src/client/actions/privacy';
// import { isWrong } from 'src/util/checkTools';
import { getConnectionStatus } from 'src/client/actions/connection';
import clientConfig from 'src/configs/client';
import {actions as CPlatformActions} from 'c_platform';
const { setMetadata } = CPlatformActions.metadata;

const isWrong = (obj = {}) => {
	return !obj.response || Object.keys(obj.response).includes('error') || Object.keys(obj.response).includes('warning');
}

export const initProfilePage = targetPid => (dispatch, getState) => {

	const myPid = getState().user.pid;
	if( parseInt(targetPid) === parseInt(myPid) ) {
		dispatch(checkIdentity(myPid, targetPid));
		dispatch(loadProfile({ pid: targetPid }))
	}else {

	/**
	 * 看其他人的profile
	 */
		dispatch(isAllowReadProfile({pidList: targetPid}))
			.then((res) => {
				if(!res || !res.response || res.response.length === 0){
					return dispatch(initialFail('privacy',targetPid, res));
				}
			})
			.then(() => dispatch(getConnectionStatus({pid: myPid, targetPid})).then((res)=>{
				if(!res || isWrong(res) || (res[targetPid] && res[targetPid].connectionStatus === 4)){
					return dispatch(initialFail('block',targetPid, res));
				}

				dispatch(checkIdentity(myPid, targetPid, res.response));
				dispatch(loadDataCenter('queryPrivacyInfo', { pid: targetPid }));

				dispatch(loadProfile({ pid: targetPid }))
					.then(( res ) => {
						if(!res || isWrong(res)){
							return dispatch(initialFail('profile',targetPid, res));
						}else {
							dispatch(viewProfile({
								productKey: clientConfig.params.apnum,
								pid: myPid,
								targetPid
							}));
						}
					});

			}))
	}
};

export const INITIAL_FAIL = 'INITIAL_FAIL';
export function initialFail(process, targetPid, response) {
	return {
		type: INITIAL_FAIL,
		process,
		targetPid,
		response
	}
}

export const LOAD_PROFILE_SUCCESS = 'LOAD_PROFILE_SUCCESS';
export function loadProfileSuccess(pid, data) {

	return {
		type: LOAD_PROFILE_SUCCESS,
		response: data,
		pid
	}
}


export const LOADED_PROFILE = 'LOADED_PROFILE';
export const loadProfile = params => (dispatch, getState) => {

	const myPid = getState().user.pid;

	return dispatch(loadProfileAPI(params)).then((res) => {

		if(!res || isWrong(res)){
			return dispatch(initialFail('profile',params.pid, res));
		}else {

			try{
				dispatch(setMetadata('profile',{
					pid: params.pid,
					name: res.response.userName,
					image: res.response.avatarWebUrl
					}
				))
			}catch(e) {
				console.log(e);
			}

			return dispatch(loadProfileSuccess(myPid, res))
		}
	})
}

export const LOADED_PROFILE_API = 'LOADED_PROFILE_API';
export function loadProfileAPI(params) {
	return {
		'CALL_API': {
			type: LOADED_PROFILE_API,
			method: 'get',
			target: '/profile/'+params.pid,
			params: params
		}
	};
}

export const CHECK_IDENTITY = 'CHECK_IDENTITY';
export function checkIdentity(userPid, paramsPid, status) {
	return {
		type: CHECK_IDENTITY,
		userPid: userPid,
		paramsPid: paramsPid,
		status: status
	};
}

export const SET_PROFILE_PID = 'SET_PROFILE_PID';
export function setProfilePid(targetPid) {
	return {
		type: SET_PROFILE_PID,
		targetPid
	}
}

export const VIEW_AS = 'VIEW_AS';
export function viewAs(viewas, interactionLock) {
	return {
		type: VIEW_AS,
		viewas: viewas,
		interactionLock: interactionLock
	};
}

export const UPDATE_COVER_IMAGE_REQ = 'UPDATE_COVER_IMAGE_REQ';
export function updateCoverImageRequest(params) {
	return {
		'CALL_API': {
			type: UPDATE_COVER_IMAGE_REQ,
			method: 'post',
			target: '/profile/updateCoverImage',
			params: params
		}
	};
}

export const UPDATE_COVER_IMAGE = 'UPDATE_COVER_IMAGE';
export function updateCoverImage(params) {
	return (dispatch) => {
		return dispatch(updateCoverImageRequest(params)).then((response) => {
			dispatch({ type: UPDATE_COVER_IMAGE, response, params });
		});
	};
}

export const ADJUST_COVER_IMAGE_REQ = 'ADJUST_COVER_IMAGE_REQ';
export function adjustCoverImageRequest(params) {
	return {
		'CALL_API': {
			type: ADJUST_COVER_IMAGE_REQ,
			method: 'post',
			target: '/profile/adjustCoverImage',
			params: params
		}
	};
}

export const ADJUST_COVER_IMAGE = 'ADJUST_COVER_IMAGE';
export function adjustCoverImage(params) {
	return (dispatch) => {
		return dispatch(adjustCoverImageRequest(params)).then((response) => {
			dispatch({ type: ADJUST_COVER_IMAGE, response, params });
		});
	};
}

export const DELETE_COVER_IMAGE = 'DELETE_COVER_IMAGE';
export function deleteCoverImage(params) {
	return {
		'CALL_API': {
			type: DELETE_COVER_IMAGE,
			method: 'post',
			target: '/profile/deleteCoverImage',
			params: params
		}
	};
};


export const CROP_AVATAR_IMAGE = 'CROP_AVATAR_IMAGE';
export function cropAvatarImage(avatar) {
	return {
		type: CROP_AVATAR_IMAGE,
		avatar: avatar
	};
}


export const UPDATE_AVATAR_IMAGE_REQ = 'UPDATE_AVATAR_IMAGE_REQ';
export function updateAvatarImageReq(params) {
	return {
		'CALL_API': {
			type: UPDATE_AVATAR_IMAGE_REQ,
			method: 'post',
			target: '/profile/updateAvatarImage',
			params
		}
	};
}

export const UPDATE_AVATAR_IMAGE = 'UPDATE_AVATAR_IMAGE';
export function updateAvatarImage(params, coverIsDefault) {
	return (dispatch) => {
		dispatch(updateAvatarImageReq(params)).then((response) => {
			dispatch({ type: UPDATE_AVATAR_IMAGE, response, params, coverIsDefault });
		});
	};
}

export const ADJUST_AVATAR_IMAGE_REQ = 'ADJUST_AVATAR_IMAGE_REQ';
export function adjustAvatarImageReq(params) {
	return {
		'CALL_API': {
			type: ADJUST_AVATAR_IMAGE_REQ,
			method: 'post',
			target: '/profile/adjustAvatarImage',
			params
		}
	};
}

export const ADJUST_AVATAR_IMAGE = 'ADJUST_AVATAR_IMAGE';
export function adjustAvatarImage(params) {
	return (dispatch) => {
		dispatch(adjustAvatarImageReq(params)).then((response) => {
			dispatch({ type: ADJUST_AVATAR_IMAGE, response, params });
		});
	};
}

export const DELETE_AVATAR_IMAGE = 'DELETE_AVATAR_IMAGE';
export function deleteAvatarImage(params) {
	return {
		'CALL_API': {
			type: DELETE_AVATAR_IMAGE,
			method: 'post',
			target: '/profile/deleteAvatarImage',
			params
		}
	};
};


export const UPDATE_USERNAME_DISPLAY = 'UPDATE_USERNAME_DISPLAY';
export function updateUsernameDisplay (params) {
	return {
		'CALL_API': {
			type: UPDATE_USERNAME_DISPLAY,
			method: 'post',
			target: '/profile/profilePersonal/updateUserNameDisplay',
			params
		}
	};
}

export const UPDATE_USER_INTRODUCTION = 'UPDATE_USER_INTRODUCTION';
export function updateUserIntroduction (params) {
	return {
		'CALL_API': {
			type: UPDATE_USER_INTRODUCTION,
			method: 'post',
			target: '/profile/profilePersonal/updateUserIntroduction',
			params: params
		}
	};
}

export const LOADED_USERINFO = 'LOADED_USERINFO';
export function loadedUserInfo (params) {
	return {
		'CALL_API': {
			type: LOADED_USERINFO,
			method: 'get',
			target: '/profile/profilePersonal/getUserInfo',
			params: params
		}
	};
}

export const LOAD_USER_CONFIG = 'LOAD_USER_CONFIG';
export function loadUserConfig(params) {
	return {
		'CALL_API': {
			type: LOAD_USER_CONFIG,
			method: 'get',
			target: '/personal/config/queryPersonalConfigByPid',
			params: params
		}
	};
}
export const LOAD_USER_CONFIG_BY_TYPE = 'LOAD_USER_CONFIG_BY_TYPE';
export function loadUserConfigByType(params) {
	return {
		'CALL_API': {
			type: LOAD_USER_CONFIG_BY_TYPE,
			method: 'get',
			target: '/personal/config/queryPersonalConfigByPidAndType',
			params: params
		}
	};
}

export const UPDATE_USER_CONFIG = 'UPDATE_USER_CONFIG';
export function updatePersonalConfig(params) {
	return {
		'CALL_API': {
			type: UPDATE_USER_CONFIG,
			method: 'post',
			target: '/personal/config/updatePersonalConfig',
			params: params
		}
	};
}

export const INIT_USER_CONFIG = 'INIT_USER_CONFIG';
export function initUserConfig() {
	return (dispatch, getState) => {
		return new Promise((resolve) => {
			dispatch({ type: INIT_USER_CONFIG, initConig: getState().profile.config });
			resolve();
		});
	};
}

export const INIT_USER = 'INIT_USER';
export function initialUser(params) {
	return {
		'CALL_API': {
			type: INIT_USER,
			method: 'post',
			target: '/profile/profilePersonal/initialUser',
			params: params
		}
	};
}

export const VIEW_PROFILE = 'VIEW_PROFILE';
export function viewProfile(params) {
	return {
		'CALL_API': {
			type: VIEW_PROFILE,
			method: 'get',
			target: '/profile/accessRecord/viewProfile',
			params: params
		}
	};
}

export const CHECK_ROUTES = 'CHECK_ROUTES';
export function checkRoutes(keyword) {
	return {
		'CALL_API': {
			type: CHECK_ROUTES,
			method: 'get',
			target: '/routes/'+keyword,
			params: {returnAll: true}
		}
	};
}

export const GET_NAMECARD = 'GET_NAMECARD';
export function getNameCard(params) {
	return {
		CALL_API: {
			type: GET_NAMECARD,
			method: 'get',
			target: '/profile/profileNameCard/getNameCard',
			params
		}
	};
}

export const GET_NAMECARD_LIST = 'GET_NAMECARD_LIST';
export function getNameCardList(params) {
	return {
		CALL_API: {
			type: GET_NAMECARD_LIST,
			method: 'get',
			target: '/profile/profileNameCard/getNameCardList',
			params
		}
	};
}

var profileActions = require('./profile');
module.exports =  Object.assign({}, profileActions);
