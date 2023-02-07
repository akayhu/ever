export const LOADED_USERLIST = 'LOADED_USERLIST';
export function loadUserList(params) {
	return {
		'CALL_API': {
			type: LOADED_USERLIST,
			method: 'get',
			target: '/profile/list',
			params: params
		}
	};
};

export const LOADED_USER = 'LOADED_USER';
export function loadUser(params) {
	return {
		'CALL_API': {
			type: LOADED_USER,
			method: 'get',
			target: '/profile/'+params.pid,
			params: params
		}
	};
};

export const ADDED_USER = 'ADDED_USER';
export function addUser(params) {
	return {
		'CALL_API': {
			type: ADDED_USER,
			method: 'post',
			target: '/profile',
			params: params
		}
	};
};

export const UPDATED_USER = 'UPDATED_USER';
export function updateUser(params) {
	return {
		'CALL_API': {
			type: UPDATED_USER,
			method: 'put',
			target: '/profile/'+params.pid,
			params: params
		}
	};
};

export const DELETED_USER = 'DELETED_USER';
export function deleteUser(params) {
	return {
		'CALL_API': {
			type: DELETED_USER,
			method: 'delete',
			target: '/profile/'+params.pid,
			params: params
		}
	};
};

export const DELETED_MULTIUSER = 'DELETED_MULTIUSER';
export function deleteMultiUser(params) {
	return {
		'CALL_API': {
			type: DELETED_MULTIUSER,
			method: 'post',
			target: '/profile/delete',
			params: params
		}
	};
};

export const INITIAL_ACCOUNT = 'INITIAL_ACCOUNT';
export function initialAccount(params) {
	return {
		'CALL_API': {
			type: INITIAL_ACCOUNT,
			method: 'get',
			target: '/account/initial',
			params: params
		}
	};
};

export const UPDATE_MTS = 'UPDATE_MTS';
export function updateMts(params) {
	return {
		'CALL_API': {
			type: UPDATE_MTS,
			method: 'post',
			target: '/mts',
			params: params
		}
	};
};
