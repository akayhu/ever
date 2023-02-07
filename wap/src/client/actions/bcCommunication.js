export const GET_MSG_LIST = 'GET_MSG_LIST';
export const GET_MSG_DETAIL = 'GET_MSG_DETAIL';
export const GET_UNREAD_MSG_CNT = 'GET_UNREAD_MSG_CNT';
export const SEND_MSG = 'SEND_MSG';
export const DELETE_MSG = 'DELETE_MSG';
export const GET_ATTACH_FILE = 'GET_ATTACH_FILE';
export const CHANGE_READING_JOB_NO = 'CHANGE_READING_JOB_NO';
export const ADD_ACCEPT_CUST_NO = 'ADD_ACCEPT_CUST_NO';
export const UPLOAD_NEW_BCATTACH = 'UPLOAD_NEW_BCATTACH';
export const BASE_CONVERT = 'BASE_CONVERT';
export const SET_CONTACT_INFO = 'SET_CONTACT_INFO';
export const GET_COMPANY_LOGO = 'GET_COMPANY_LOGO';

export function triggerGetMsgList(jobNo) {
	return (dispatch) => {
		dispatch(getMsgList({
			pageNo: 1,
			pageRow: 50
		}));
		if (jobNo) {
			dispatch(getMsgDetail({
				asc: 0,
				jobNo,
				pageNo: 1,
				pageRow: 10,
				updateRead: 1
			})).then(() => {
				dispatch(changeReadingJobNo(jobNo));
			});
		}
	};
}
// 取得訊息列表
export function getMsgList(params) {
	return {
		CALL_API: {
			type: GET_MSG_LIST,
			method: 'get',
			target: '/bcCommunication/getMsgList',
			params
		}
	};
}

// 取得訊息詳細頁，可更新訊息串為已讀
export function getMsgDetail(params) {
	return {
		CALL_API: {
			type: GET_MSG_DETAIL,
			method: 'get',
			target: '/bcCommunication/getMsgDetail',
			params
		}
	};
}

// 傳送訊息
export function sendMsg(params) {
	return {
		CALL_API: {
			type: SEND_MSG,
			method: 'post',
			target: '/bcCommunication/sendMsg',
			params
		}
	};
}

// 監聽目前開哪封信
export function changeReadingJobNo(jobNo) {
	return {
		type: CHANGE_READING_JOB_NO,
		payload: jobNo
	};
}

// 新增已同意的公司
export function addAcceptCustNo(custNo) {
	return {
		type: ADD_ACCEPT_CUST_NO,
		payload: custNo
	};
}

export function uploadNewBCAttach(params) {
	return {
		CALL_API: {
			type: UPLOAD_NEW_BCATTACH,
			method: 'post',
			target: '/bcCommunication/uploadNewBCAttach',
			params
		}
	};
}

export function baseConvert(params) {
	return {
		CALL_API: {
			type: BASE_CONVERT,
			method: 'get',
			target: '/bcCommunication/baseConvert',
			params
		}
	};
}

export function setContactInfo(params) {
	return {
		CALL_API: {
			type: SET_CONTACT_INFO,
			method: 'post',
			target: '/bcCommunication/setContactInfo',
			params
		}
	};
}

export function getCompanyLogo(params) {
	return {
		CALL_API: {
			type: GET_COMPANY_LOGO,
			method: 'get',
			target: '/bcCommunication/getCompanyLogo',
			params
		}
	};
}