import moment from 'moment';

const nowTime = moment().unix() * 1000;

// 取上架廣告
export const GET_ON_ADVERTISING = 'GET_ON_ADVERTISING';

// actionType.GET_ALL_ADVERTISING 取得所有AD資料
export const GET_ALL_ADVERTISING = 'GET_ALL_ADVERTISING';
export const getAllAdvertising = params => (dispatch) => {
	return dispatch({
		CALL_API: {
			type: GET_ALL_ADVERTISING,
			method: 'get',
			target: '/activityNews/getAllAdvertising',
			params,
		}
	}).then((response) => {
		if (response.response) {
			const onAdList = response.response.filter((adData) => {
				// 判斷活動下檔 請協助呼叫
				// http://api.104-dev.com.tw/services/ActivityNewsService/outOfAdvertising?adid=活動Id
				// 2018/3/28 因查不到未登廣告會被為何自動下架，所以未登廣告先不做自動刪除過期廣告動作(activitySGPBoard)
				// 2018/6/6 得知，nowTime如果使用者電腦時間調整大於下架時間就會執行下架動作，故前端都拿掉下架功能
				// if (adData && adData.offDate <= nowTime && params.type !== 'activitySGPBoard') {
				// 	dispatch(outOfAdvertising({adid: adData.adid}));
				// 	return false;
				// }
				return (adData && adData.onDate <= nowTime && nowTime < adData.offDate);
			});

			// 只取上架時間
			dispatch({
				type: GET_ON_ADVERTISING,
				onAdList
			});
		}
	});
};

// actionType.OUT_OF_ADVERTISING 發下架api但前端不做任何動作
export const OUT_OF_ADVERTISING = 'OUT_OF_ADVERTISING';
export const outOfAdvertising = (params) => {
	return {
		CALL_API: {
			type: OUT_OF_ADVERTISING,
			method: 'get',
			target: '/activityNews/outOfAdvertising',
			params,
		}
	};
};
