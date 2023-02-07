import $ from 'jquery';
import clientConfig from 'src/configs/client';

export const CHECK_PJ_API = 'CHECK_PJ_API';
export const ANSWER_PJ_API = 'ANSWER_PJ_API';
export const REPORT_BRAND_PJ_API = 'REPORT_BRAND_PJ_API';
export const GET_FUTURE = 'GET_FUTURE';

export function checkPjAPI(params) {
	return {
		CALL_API: {
			type: CHECK_PJ_API,
			method: 'get',
			target: '/test/checkPjAPI',
			params
		}
	};
}
export function answerPjAPI(params) {
	return {
		CALL_API: {
			type: ANSWER_PJ_API,
			method: 'get',
			target: '/test/answerPjAPI',
			params
		}
	};
}
export function reportBrandPjAPI(params) {
	return {
		CALL_API: {
			type: REPORT_BRAND_PJ_API,
			method: 'post',
			target: '/test/reportBrandPjAPI',
			params
		}
	};
}
export function getFuture(jobcat) {
	// 由於ESB那層代CALL速度減慢且會有資訊不同步問題，前端壞或ESB壞或API壞，除錯不易。
	// 所以決議直接CALL LEONC那邊的jobwiki api
	// 用jsonp去解決掉cros的問題
	return (dispatch, getState) => $.ajax({
		type: 'GET',
		url: `${clientConfig.params.e104Url}/jb/jobwiki/jobCatMaster/future?jobcat=${jobcat}`,
		dataType: 'jsonp',
		jsonp: '104callback',
		success: (res) => {
			dispatch({
				type: GET_FUTURE,
				res
			});
		}
	});
}
