"use strict";

import { createElogByAction } from '../../util/elog';
import { browserHistory } from 'react-router'
import {actions as CPlatformActions} from 'c_platform';
import { loadDataByCategory as messageLoadData } from 'src/client/actions/message/custom_api';

const { CREATE_ALERT } = CPlatformActions.alert;
const codeWhiteList = [ 212 ];


/**
 * 這隻middleware要做的事情越來越雜了...
 * 之後應該好好整理一下
 *
 * @export
 * @returns
 */

export default function elog(){
	return (store) => (next) => (action) => {

		if (action.type === 'UPDATE_BUBBLE') {
			if (action.targetBubble === 'messageBubbleCount') {
				setTimeout(() => store.dispatch(messageLoadData('updateMessageList')), 1000);
				store.dispatch(messageLoadData('chatList', { chatId: action.data.id, count: 1000}));
			}
		}

		if (action.type === 'SHOW_PLATFORM_ALERT') {
			return next({
				type: CREATE_ALERT,
				desc: action.text
			});
		}
		if(action.response && action.response.response && action.response.response.warning &&( process.env.NODE_ENV!=='production' || codeWhiteList.indexOf(action.response.response.warning.code) > 0) ) {

			return next({
				type: CREATE_ALERT,
				desc: action.response.response.warning.desc
			});
		}
		return next(action);
	}
}