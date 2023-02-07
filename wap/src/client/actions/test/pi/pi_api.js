export const CHECK_PI_API = 'CHECK_PI_API';
export const ANSWER_PI_API = 'ANSWER_PI_API';
export const REPORT_BRAND_PI_API = 'REPORT_BRAND_PI_API';
export const CHANGE_PI_REPORT_AUTHORITY = 'CHANGE_PI_REPORT_AUTHORITY';

export function checkPiAPI(params) {
	return {
		CALL_API: {
			type: CHECK_PI_API,
			method: 'get',
			target: '/test/checkPiAPI',
			params
		}
	};
}
export function answerPiAPI(params) {
	return {
		CALL_API: {
			type: ANSWER_PI_API,
			method: 'get',
			target: '/test/answerPiAPI',
			params
		}
	};
}
export function reportBrandPiAPI(params) {
	return {
		CALL_API: {
			type: REPORT_BRAND_PI_API,
			method: 'post',
			target: '/test/reportBrandPiAPI',
			params
		}
	};
}

// 由於測評報告頁的資料與權限設定寫在同一支api上，在切換報告觀看權限時，需另設另外一支否則Source B與C的資料會不同
// 但client端這邊都是要看C的資料，所以跟上面那支雖然打同一支api但是分開使用兩個action
export function changePiReportAuthority(params) {
	return {
		CALL_API: {
			type: CHANGE_PI_REPORT_AUTHORITY,
			method: 'post',
			target: '/test/reportBrandPiAPI',
			params
		}
	};
}
