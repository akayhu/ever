import * as MessageApi from './message_api';
// selectors
import { getIsLoading, getIsEnd, getLastDateTime } from '../../reducers/message/selectors';
// import moment from 'moment';

function isWrong(obj) {
	return Object.keys(obj).includes('error') || Object.keys(obj).includes('warning');
}
function canNotLoad(state, category) {
	return getIsLoading(state, category) || getIsEnd(state, category);
}

function actionMap(category) {
	switch (category) {
		case 'messageList':
		case 'updateMessageList':
			return MessageApi.getMessageListByTime;
		case 'chatList':
			return MessageApi.getChatList;
		default:
			return a => a;
	}
}

function parameterMap(category, getState, {chatId, count}) {
	const nowState = getState().message;
	switch (category) {
		case 'messageList':
			return {
				count: 15,
				dateTime: getLastDateTime(nowState) || getDateString()
			};
		case 'updateMessageList':
			return {
				count: 1,
				dateTime: getDateString()
			};
		case 'chatList':
			return {
				chatId,
				count: count || 1000,
				dateTime: nowTimeObj()
			};
		default:
			return {};
	}
}
// utils

const nowTimeObj = () => {
	const date = new Date();
	const	year = date.getFullYear(); // 年
	const	month = date.getMonth() + 1; // 月
	const	day = date.getDate(); // 日
	const	hours = date.getHours(); // 時
	const	minutes = date.getMinutes(); // 分
	const	seconds = date.getSeconds(); // 秒

	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`; // 年-月-日 時:分:秒;
};

const getDateString = () => {
	const pad2 = n => (n < 10 ? `0${n}` : `${n}`);
	const t = new Date();
	const year = t.getFullYear();
	const month = pad2(t.getMonth() + 1);
	const date = pad2(t.getDate());
	const hours = pad2(t.getHours());
	const minutes = pad2(t.getMinutes());
	const seconds = pad2(t.getSeconds());
	return `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
};


export { isWrong, canNotLoad, nowTimeObj, actionMap, parameterMap };
