import $ from 'jquery';

export const GETACCUSEITEM = 'GETACCUSEITEM';
export function getAccuseItem( params ) {
	return (dispatch, getState) => {
		const state = getState();
		const accuseType = params.type;
		const checkKey = accuseType === 1 ? 'activity' : 'user';
		const itemData = state.accuse.accuseItem[checkKey];
		const check = itemData.length > 0;

		if(check){
			return dispatch({
				type: GETACCUSEITEM,
				accuseType: checkKey,
				itemData
			});
		}else{
			return $.get('/ajax/accuse/getAccuseItem', params, response =>{
				dispatch({
					type: GETACCUSEITEM,
					accuseType: checkKey,
					itemData,
					response
				});
			});
		}
	};
}

export const ACCUSE_TERRIBLE_PERSON = 'ACCUSE_TERRIBLE_PERSON';
export function accuseTerriblePerson( selection, comment ) {
	return (dispatch, getState) => {
		var params = {
			//pid: this.props.user.pid,
			targetPid: getState().accuse.accuseData.pid,
			accuseItem: selection,
			description: comment,
			otherComment: '',
			ip: "",
			language: "",
			browser: "",
			https: "",
			cookie: ""
		};
		
		
		return dispatch({
			'CALL_API': {
				type: ACCUSE_TERRIBLE_PERSON,
				method: 'post',
				target: '/accuse/accuseTerriblePerson',
				params: params
			}
		});
	};
}

export const ACCUSE_TERRIBLE_ACTIVITY = 'ACCUSE_TERRIBLE_ACTIVITY';
export function accuseTerribleActivity( selection, comment ) {
	return (dispatch, getState) => {
		var params = {
			targetPid: getState().accuse.accuseData.userInfo.pid,
			aid: (getState().accuse.accuseData.aidParent !== null)? getState().accuse.accuseData.aidParent : getState().accuse.accuseData.aid,
			commentId: (getState().accuse.accuseData.aidParent !== null)? getState().accuse.accuseData.aid : "",
			accuseItem: selection,
			description: comment,
			otherComment: "",
			ip: "",
			language: "",
			browser: "",
			https: "",
			cookie: ""
		};
		
		return dispatch({
			'CALL_API': {
				type: ACCUSE_TERRIBLE_ACTIVITY,
				method: 'post',
				target: '/accuse/accuseTerribleActivity',
				params: params
			}
		});
	};
}

export const ACCUSE_TRIGGER = 'ACCUSE_TRIGGER';
export function accuseTrigger(accuseType, itemData){
	return (dispatch, getState) => {
		if(accuseType !== 'none' && getState().accuse.accuseItem[accuseType].length === 0){
			let url = "";

			switch(accuseType){
				case 'activity': 
					url = '/ajax/accuse/getAccuseItem?type=1';
					break;
				case 'user':
					url = '/ajax/accuse/getAccuseItem?type=2';
					break;
				default: 
					url = '/ajax/accuse/getAccuseItem?type=1';
			}

			$.get(url, response =>{
				dispatch({
					type: GETACCUSEITEM,
					response,
					accuseType
				});

				dispatch({
					type: ACCUSE_TRIGGER,
					accuseType,
					itemData
				});

			});

		}else{
			dispatch({
				type: ACCUSE_TRIGGER,
				accuseType,
				itemData
			});
		}
	}
}
