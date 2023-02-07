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
			params: {}
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

export const checkLogin = () => (dispatch, getState) => {
	const user = getState().user;
	
	if(!user.isLogin){
		if(confirm("此為會員功能！請先登入！")){
			dataLayer.push({
				'event': 'gaEvent',
				'eventCategory': '共用',
				'eventAction': 'Dialog - 我要登入',
				'eventLabel': location.pathname
		 	});
			location.href="/sso/saml-login";
		} else {
			dataLayer.push({
				'event': 'gaEvent',
				'eventCategory': '共用',
				'eventAction': 'Dialog - 稍後再說',
				'eventLabel': location.pathname
		 	});
		}
		return false;
	}else{
		return true;
	}
};

export const GET_AC_USERNAME = 'GET_AC_USERNAME';
export function getACUserName(params) {
	return {
		'CALL_API': {
			type: GET_AC_USERNAME,
			method: 'get',
			target: '/account/name',
			params: params
		}
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

