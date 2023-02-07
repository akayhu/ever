import $ from 'jquery';

export const CHECK_PO_API = 'CHECK_PO_API';
export const ANSWER_PO_API = 'ANSWER_PO_API';
export const REPORT_BRAND_PO_API = 'REPORT_BRAND_PO_API';
export const CHANGE_PO_REPORT_AUTHORITY = 'CHANGE_PO_REPORT_AUTHORITY';

export function checkPoAPI(params) {
	return {
		CALL_API: {
			type: CHECK_PO_API,
			method: 'get',
			target: '/test/checkPoAPI',
			params
		}
	};
}
export function answerPoAPI(params) {
	return {
		CALL_API: {
			type: ANSWER_PO_API,
			method: 'get',
			target: '/test/answerPoAPI',
			params
		}
	};
}
export function reportBrandPoAPI(params) {
	return {
		CALL_API: {
			type: REPORT_BRAND_PO_API,
			method: 'post',
			target: '/test/reportBrandPoAPI',
			params
		}
	};
}

// 由於測評報告頁的資料與權限設定寫在同一支api上，在切換報告觀看權限時，需另設另外一支否則Source B與C的資料會不同
// 但client端這邊都是要看C的資料，所以跟上面那支雖然打同一支api但是分開使用兩個action
export function changePoReportAuthority(params) {
	return {
		CALL_API: {
			type: CHANGE_PO_REPORT_AUTHORITY,
			method: 'post',
			target: '/test/reportBrandPoAPI',
			params
		}
	};
}
