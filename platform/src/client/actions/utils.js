import * as BCApi from './bcCommunication';
import * as ConnectionApi from './connection';
import * as CCApi from './ccCommunication';
import * as NotificationApi from './notification';
import {
	getMsgData,
	getInviteData,
	getCcMessageData,
	getNotificationDataById
} from '../reducers/navigation/selectors';

export function mapTypeToApi(type) {
	switch (type) {
		case 1:
			return ConnectionApi.getInviteList({
				connectionStatus: 2,
				limit: 5,
				offset: 0
			});
		case 2:
			return CCApi.getMessageList({
				count: 5
			});
		case 3:
			return NotificationApi.getNotifictionByPid({
				limit: 5
			});
		case 8:
			return BCApi.getMsgList({
				pageNo: 1,
				pageRow: 5
			});
		default:
			return {};
	}
}

export function isEmpty(type, getState) {
	switch (type) {
		case 1:
			return !getInviteData(getState()).length;
		case 2:
			return !getCcMessageData(getState()).length;
		case 3:
			return !getNotificationDataById(getState()).length;
		case 8:
			return !getMsgData(getState()).length;
		default:
			return {};
	}
}

// 根據response的內容來判斷要更新的泡泡種類
// bubble action_number
const connectionAction = [501, 508, 509, 510, 511, 512, 513, 515, 516, 521, 522, 523];
export function getBubbleType(type, actionNumber) {
	// type為數字的狀態 (component點擊時觸發)
	if (Object.prototype.toString.call(type) === '[object Number]') {
		if (type === 1) return 'connectionBubbleCount';
		if (type === 2) return 'messageBubbleCount';
		if (type === 3) return 'notificationBubbleCount';
		if (type === 8) return 'bcCommunicationCount';
	}
	// long polling收到response時觸發
	if (type === 'notification') {
		if (connectionAction.indexOf(actionNumber) !== -1) return 'connectionBubbleCount';
		return 'notificationBubbleCount';
	} else if (type === 'plusMail') {
		return 'bcCommunicationCount';
	}
	return 'messageBubbleCount';
}
