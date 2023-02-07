import moment from 'moment';

// 取的兩個時間的
export const getDuration = (startTime = moment(), endTime = moment()) => {
	if (!moment.isMoment(startTime)) {
		console.error(
			'startTime must be valid moment object in getDuration, ',
			startTime
		);
		return false;
	}

	if (!moment.isMoment(endTime)) {
		console.error(
			'endTime must be valid moment object in getDuration, ',
			endTime
		);
		return false;
	}
	const diffYear = endTime.diff(startTime, 'years');
	const diffMonth = Math.floor(endTime.diff(startTime, 'months', true));

	// 最小的單位
	if (diffYear === 0 && diffMonth === 0) {
		return '未滿1個月';
	}

	let text = '';
	// 計算年
	if (diffYear > 0) {
		text += `${diffYear}年`;
	}

	// 計算月
	if (diffMonth % 12 > 0) {
		text += `${diffMonth % 12}個月`;
	}

	return text;
};

// 距離當天結束的時間(晚上12點)
export const getExpireTime = () => {
	const date = new Date();
	const hour = 23 - date.getHours();
	const min = 59 - date.getMinutes();
	const sec = 59 - date.getSeconds();
	const ms = (3600 * hour + 60 * min + sec) * 1000;
	return ms;
};

// 取今年
export const nowYear = () => {
	var today = new Date();
	return today.getFullYear();
};
