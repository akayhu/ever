// constant
export const QUERY_COLLEAGE_LIST = 'QUERY_COLLEAGE_LIST';
export const ADD_COLLEAGUE_WISH = 'ADD_COLLEAGUE_WISH';
export const REMOVE_COLLEAGUE = 'REMOVE_COLLEAGUE';
export const REMOVE_COLLEAGUE_REQ = 'REMOVE_COLLEAGUE_REQ';
export const QUERY_COLLEAGUE_WISH_STATUS = 'QUERY_COLLEAGUE_WISH_STATUS';
export const QUERY_APPRAISE_LIST = 'QUERY_APPRAISE_LIST';
export const QUERY_APPRAISE_LIST_OF_OWNER = 'QUERY_APPRAISE_LIST_OF_OWNER';
export const ADD_APPRAISE_TEXT = 'ADD_APPRAISE_TEXT';
export const QUERY_APPRAISE_PENDING_LIST = 'QUERY_APPRAISE_PENDING_LIST';
export const QUERY_APPRAISE_LIST_NOT_SORT = 'QUERY_APPRAISE_LIST_NOT_SORT';
export const DELETE_APPRAISE_TEXT = 'DELETE_APPRAISE_TEXT ';
export const PUBLISH_APPRAISE_TEXT = 'PUBLISH_APPRAISE_TEXT';
export const MODIFY_PUBLISH_APPRAISE_TEXT = 'MODIFY_PUBLISH_APPRAISE_TEXT';
export const DELETE_PENDDING_APPRAISE = 'DELETE_PENDDING_APPRAISE';
export const CLEAR_APPRAISE = 'CLEAR_APPRAISE';
// action creator
export function queryColleagueList(params) {
	return {
		'CALL_API': {
			type: QUERY_COLLEAGE_LIST,
			method: 'get',
			target: '/profile/colleague/queryColleagueList',
			params: params
		}
	};
}

export function addColleagueWish(params) {
	return {
		'CALL_API': {
			type: ADD_COLLEAGUE_WISH,
			method: 'post',
			target: '/profile/colleague/addColleague',
			params
		}
	};
}

export function removeColleagueWishRequest(params) {
	return {
		'CALL_API': {
			type: REMOVE_COLLEAGUE_REQ,
			method: 'post',
			target: '/profile/colleague/removeColleague',
			params
		}
	};
}


export function removeColleagueWish(params) {
	return (dispatch, getState) => {
		dispatch(removeColleagueWishRequest(params)).then(() => {
			dispatch({ type: REMOVE_COLLEAGUE, pid: getState().user.pid });
		});
	};
}

export function colleagueWishStatus(params) {
	return {
		'CALL_API': {
			type: QUERY_COLLEAGUE_WISH_STATUS,
			method: 'get',
			target: '/profile/colleague/colleagueWishStatus',
			params
		}
	};
}

export function queryAppraiseListOfOwner(params) {
	return {
		'CALL_API': {
			type: QUERY_APPRAISE_LIST_OF_OWNER,
			method: 'get',
			target: '/profile/appraise/queryAppraiseListOfOwner',
			params: params
		}
	};
}

export function queryAppraiseList(params) {
	return {
		'CALL_API': {
			type: QUERY_APPRAISE_LIST,
			method: 'get',
			target: '/profile/appraise/queryAppraiseList',
			params: params
		}
	};
}

export function queryAppraiseListNotSort(params) {
	return {
		'CALL_API': {
			type: QUERY_APPRAISE_LIST_NOT_SORT,
			method: 'get',
			target: '/profile/appraise/queryAppraiseList',
			params: params
		}
	};
}

export function addAppraiseText(params) {
	return {
		'CALL_API': {
			type: ADD_APPRAISE_TEXT,
			method: 'post',
			target: '/profile/appraise/addAppraiseText',
			params: params
		}
	}
}

export function queryAppraisePendingList(params) {
	return {
		'CALL_API': {
			type: QUERY_APPRAISE_PENDING_LIST,
			method: 'get',
			target: '/profile/appraise/queryAppraisePendingList',
			params: params
		}
	}
}

export function publishAppraiseText(params) {
	return {
		'CALL_API': {
			type: PUBLISH_APPRAISE_TEXT,
			method: 'post',
			target: '/profile/appraise/publishAppraiseText',
			params: params
		}
	}
}

export function modifyPublishAppraiseText(params) {
	return {
		'CALL_API': {
			type: MODIFY_PUBLISH_APPRAISE_TEXT,
			method: 'post',
			target: '/profile/appraise/publishAppraiseText',
			params: params
		}
	}
}

export function deleteAppraiseText(params) {
	return {
		'CALL_API': {
			type: DELETE_APPRAISE_TEXT ,
			method: 'post',
			target: '/profile/appraise/deleteAppraiseText',
			params: params
		}
	}
}

export function deletePenddingAppraise(params) {
	return {
			type: DELETE_PENDDING_APPRAISE,
			params: params
	}
}

export function clearAppraise(data) {
	return (dispatch, getState) => {
		dispatch({type: CLEAR_APPRAISE});
		if(data) { data(); }
	}
}
