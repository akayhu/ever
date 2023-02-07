/* constatns */
export const UPDATE_ENDORSE_DESC = 'UPDATE_ENDORSE_DESC';
export const DELETE_ENDORSE = 'DELETE_ENDORSE';
export const DELETE_ENDORSE_IN_STATE = 'DELETE_ENDORSE_IN_STATE';
export const REMOVE_ENDORSE_FOR_USER = 'REMOVE_ENDORSE_FOR_USER';
export const REMOVE_ENDORSE_FOR_USER_IN_STATE = 'REMOVE_ENDORSE_FOR_USER_IN_STATE';
export const CREATE_ENDORSE = 'CREATE_ENDORSE';
export const ADD_ENDORSE_FOR_USER = 'ADD_ENDORSE_FOR_USER';
export const ADD_ENDORSE_FOR_USER_IN_STATE = 'ADD_ENDORSE_FOR_USER_IN_STATE';
export const GET_ENDORSE_LIST = 'GET_ENDORSE_LIST';
export const GET_ENDORSE_LIST_CONCAT = 'GET_ENDORSE_LIST_CONCAT';
export const INIT_ENDORSE_USER_LIST = 'INIT_ENDORSE_USER_LIST';
export const GET_ENDORSE_USER_LIST = 'GET_ENDORSE_USER_LIST';
export const UPDATE_ENDORSE_SORT_LIST = 'UPDATE_ENDORSE_SORT_LIST';
export const GET_ENDORSE_SORT_LIST = 'GET_ENDORSE_SORT_LIST';

/* action creators */
export function getEndorseList(params) {
	return {
		'CALL_API': {
			type: GET_ENDORSE_LIST,
			method: 'get',
			target: '/profile/profileEndorse/getEndorseList',
			params: params
		}
	};
}

export function getEndorseListConcat(params) {
	return {
		'CALL_API': {
			type: GET_ENDORSE_LIST_CONCAT,
			method: 'get',
			target: '/profile/profileEndorse/getEndorseList',
			params: params
		}
	};
}

export function getEndorseSortList(params) {
	return {
		'CALL_API': {
			type: GET_ENDORSE_SORT_LIST,
			method: 'get',
			target: '/profile/profileEndorse/getEndorseSortList',
			params: params
		}
	};
}

export function updateEndorseDesc(params) {
	return {
		'CALL_API': {
			type: UPDATE_ENDORSE_DESC,
			method: 'post',
			target: '/profile/profileEndorse/updateEndorseDesc',
			params: params
		}
	}
}

// deleteEndorse
export function deleteEndorse(params) {
	return {
		'CALL_API': {
			type: DELETE_ENDORSE,
			method: 'post',
			target: '/profile/profileEndorse/deleteEndorse',
			params: params
		}
	}
}
export function deleteEndorseInState(params) {
	return {
		type: DELETE_ENDORSE_IN_STATE,
		params: params
	}
}

// removeEndorseForUser
export function removeEndorseForUser(params) {
	return {
		'CALL_API': {
			type: REMOVE_ENDORSE_FOR_USER,
			method: 'post',
			target: '/profile/profileEndorse/removeEndorseForUser',
			params: params
		}
	}
}
export function removeEndorseForUserInState(params) {
	return {
		type: REMOVE_ENDORSE_FOR_USER_IN_STATE,
		params: params
	}
}

// createEndorse
export function createEndorse(params) {
	return {
		'CALL_API': {
			type: CREATE_ENDORSE,
			method: 'post',
			target: '/profile/profileEndorse/createEndorse',
			params: params
		}
	}
}
// addEndorseForUser
export function addEndorseForUser(params) {
	return {
		'CALL_API': {
			type: ADD_ENDORSE_FOR_USER,
			method: 'post',
			target: '/profile/profileEndorse/addEndorseForUser',
			params: params
		}
	}
}
export function addEndorseForUserInState(params) {
	return {
		type: ADD_ENDORSE_FOR_USER_IN_STATE,
		params: params
	}
}

// initEndorseUserList
export function initEndorseUserList(data) {
	return {
		type: INIT_ENDORSE_USER_LIST,
		data: data
	}
}

// getEndorseUserList
export function getEndorseUserList(params) {
	return {
		'CALL_API': {
			type: GET_ENDORSE_USER_LIST,
			method: 'get',
			target: '/profile/profileEndorse/getEndorseUserList',
			params: params
		}
	}
}

export function updateEndorseSort(params) {
	return {
		'CALL_API': {
			type: UPDATE_ENDORSE_SORT_LIST,
			method: 'post',
			target: '/profile/profileEndorse/updateEndorseSort',
			params: params
		}
	};
}
