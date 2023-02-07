import * as ProfileActionType from '../actions/profile';
import newsletterConfig from '../containers/newsletter/newsletter';
import notificationConfig from '../containers/newsletter/notification';

const arrayToObj = dataArray => {
	const newObj = {};
	for (let i = 0, maxLength = dataArray.length; i < maxLength; i += 1) {
		const keyName = dataArray[i].key;
		const value = dataArray[i].option[0].value;
		newObj[keyName] = { value };
	}
	return newObj;
};

export const initState = {
	config: arrayToObj(newsletterConfig.concat(notificationConfig)),
	user_info: {},
	profile_pool: {},
	viewas: 'other',
	viewasInfo: '',
	interactionLock: '',
	user_info_loaded: false,
	watchingProfile: 0
};

const getInitialState = () => JSON.parse(JSON.stringify(initState));

export default function profileReducer(state = getInitialState(), action){
	try{
		let user = {};
		//let res = getResponse(action.response);
		let userPid = null;
		let paramsPid = null;
		let status = null;

		switch (action.type) {

			case ProfileActionType.LOAD_PROFILE_SUCCESS:
				if (!action.response || !action.response.response) return state;
				
				if( action.pid == action.response.response.pid ) 
					state.user_info = action.response.response;
				else 
					state.profile_pool[action.response.response.pid] = action.response.response;
				
				return {
					...state
				}

			case ProfileActionType.INITIAL_FAIL:
				if (!action.response) return state;
				
				state.profile_pool[action.targetPid] = {
					block: true,
					response: action.response
				};

				return {
					...state
				}

			// case ProfileActionType.LOADED_PROFILE:
			// 	if(!action.response || !action.response.response) return state;
			// 	// if(action.response.pid === state)
			// 	return Object.assign({}, state, { user_info: action.response.response });

			case ProfileActionType.SET_PROFILE_PID:

				const watchingProfile = action.targetPid;
				return {
					...state,
					watchingProfile
				}

			case ProfileActionType.CHECK_IDENTITY:
				userPid = action.userPid;
				paramsPid = action.paramsPid;
				status = action.status;

				state.viewasInfo = '';
				state.interactionLock = 0;

				if(typeof userPid === 'string') {
					userPid = parseInt(userPid);
				}

				if(typeof paramsPid === 'string') {
					paramsPid = parseInt(paramsPid);
				}

				if (userPid === paramsPid) { //self
					return  Object.assign({}, state, {viewas: 'self'} );
				} else if(status[paramsPid] && status[paramsPid].connectionStatus === 3){
					return  Object.assign({}, state, {viewas: 'friend'} );
				} else {
					return  Object.assign({}, state, {viewas: 'other'} );
				}

			case ProfileActionType.VIEW_AS:
				if (action.viewas === 'friend') {
					return  Object.assign({}, state, {viewas: action.viewas, interactionLock: action.interactionLock, viewasInfo: '這是你的個人檔案在「朋友」下被看到的樣子。'});
				} else {
					return  Object.assign({}, state, {viewas: action.viewas, interactionLock: action.interactionLock, viewasInfo: '這是你的個人檔案在「公開」下被看到的樣子。'});
				}

			case ProfileActionType.UPDATE_COVER_IMAGE:
			case ProfileActionType.ADJUST_COVER_IMAGE:
				if (action.response === null) return state;
				state.user_info.coverPhotoFileId = action.response.coverPhotoFileId;
				state.user_info.coverWebUrl = action.response.coverWebUrl;
				var { ltx, lty,	rbx, rby } = action.params;
				state.user_info.coverCoordinate = { ltx, lty, rbx, rby };
				return Object.assign({}, state);

			case ProfileActionType.DELETE_COVER_IMAGE:
				if (action.response === null) return state;
				state.user_info.coverPhotoFileId = action.response.coverPhotoFileId;
				state.user_info.coverWebUrl = action.response.coverWebUrl;
				state.user_info.coverCoordinate = {};
				return Object.assign({}, state);

			case ProfileActionType.CROP_AVATAR_IMAGE:
				state.user_info.crop_avatar_image = action.avatar;
				return Object.assign({}, state);

			case ProfileActionType.UPDATE_AVATAR_IMAGE:
			case ProfileActionType.ADJUST_AVATAR_IMAGE:
				if (action.response === null) return state;

				state.user_info = { ...state.user_info };

				state.user_info.avatarWebUrl = action.response.avatarWebUrl;
				state.user_info.avatarPhotoFileId = action.response.avatarPhotoFileId;
				var { ltx, lty,	rbx, rby } = action.params;
				state.user_info.avatarCoordinate = { ltx, lty, rbx, rby };
				state.user_info.completeStatus.avatar = 1;
				if (action.coverIsDefault) {
					state.user_info.completeRate = state.user_info.completeRate + 5;
				}

				return Object.assign({}, state);

			case ProfileActionType.DELETE_AVATAR_IMAGE:
				if (action.response === null) return state;

				state.user_info = { ...state.user_info };

				state.user_info.avatarWebUrl = action.response.avatarWebUrl;
				state.user_info.avatarPhotoFileId = action.response.avatarPhotoFileId;
				state.user_info.avatarCoordinate = {};
				state.user_info.completeStatus.avatar = 0;
				state.user_info.completeRate = state.user_info.completeRate - 5;

				return Object.assign({}, state);

			case ProfileActionType.UPDATE_USERNAME_DISPLAY:
				if (action.response === null || !action.response.response) return state;
				state.user_info.userName = action.response.response.userName;
				return Object.assign({}, state);

			case ProfileActionType.UPDATE_USER_INTRODUCTION:
				if (action.response === null || !action.response.response) return state;
				state.user_info.introduction = action.response.response.introduction;
				return Object.assign({}, state);

			case ProfileActionType.LOADED_USERINFO:
				state.user_info_loaded = true;
				if (action.response === null || !action.response.response) return state;
				return Object.assign({}, state, {user_info: action.response.response});

			case ProfileActionType.LOAD_USER_CONFIG:
			case ProfileActionType.UPDATE_USER_CONFIG:
				if (action.response === null || !action.response.response) return state;
				if (typeof (action.response.response) !== 'object') return state;
				const configs = action.response.response;
				const newConfigs = {};
				for (const c in configs) {
					newConfigs[configs[c].type] = configs[c];
				}
				return Object.assign({}, state, { config: Object.assign({}, state.config, newConfigs) });

			case ProfileActionType.LOAD_USER_CONFIG_BY_TYPE:
				if (action.response === null || !action.response.response) return state;

				if (typeof state.config === 'undefined') {
					state.config = {};
				}

				if (action.response.response[0]) {
					state.config[action.response.response[0].type] = action.response.response[0];
				}
				return Object.assign({}, state, {config: Object.assign({}, state.config)});

			case ProfileActionType.INIT_USER_CONFIG:
				const initConig = Object.assign({}, action.initConig);
				return Object.assign({}, state, { config: initConig });

			case ProfileActionType.VIEW_PROFILE:
				return state;

			case ProfileActionType.INIT_USER:
				if (action.response === null || !action.response.response) return state;
				return  Object.assign({}, state, {user_info: action.response.response});

			case ProfileActionType.CHECK_ROUTES:
				return  Object.assign({}, state);

			default:
				return state;
		}
	}catch(e){
		console.log(e)
		return state;
	}
}
