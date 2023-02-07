import Pusher, { Pusher as PusherInterface } from 'pusher-js';
import { Observable } from 'rxjs/Rx';
import { combineEpics } from 'redux-observable';
// import { Store } from 'redux';
import {
	PUSHER_CONNECT,
	PUSHER_CONNECT_SUCCESS,
	PusherConnectionSuccessAction,
	PusherConnectionErrorAction,
	PusherDisconnectAction,
	PusherSubscribeChannelActionSuccess,
	PusherSubscribeChannelActionError,
	PusherMessageReceivedAction,
} from '../actions/pusher';

let pusherClinet = PusherInterface;

export const connectToPusher = action$ => {
	return action$.ofType(PUSHER_CONNECT).mergeMap(res => {
		return Observable.create(observer => {
			try {
				Pusher.logToConsole = false;
				// For Pusher Sending Cookie: https://github.com/pusher/pusher-js/issues/62
				Pusher.Runtime.createXHR = () => {
					let xhr = new XMLHttpRequest();
					xhr.withCredentials = true;
					return xhr;
				};
				pusherClinet = new Pusher(res.key, res.options);

				// Pusher Connect States: https://pusher.com/docs/client_api_guide/client_connect#example-state-changes
				pusherClinet.connection.bind('connected', result =>
					observer.next(PusherConnectionSuccessAction(result))
				);
				pusherClinet.connection.bind('error', error =>
					observer.next(PusherConnectionErrorAction(error, 'error'))
				);

				// 沒有網路連線
				pusherClinet.connection.bind('unavailable', error =>
					observer.next(
						observer.next(PusherConnectionErrorAction(error, 'unavailable'))
					)
				);

				// channel 連線被手動中斷
				pusherClinet.connection.bind('disconnected', data =>
					observer.next(PusherDisconnectAction(data))
				);
			} catch (e) {
				observer.next(PusherConnectionErrorAction(e, 'unexpected'));
				observer.error(e);
			}
		});
	});
};

export const subscribeToChannel = (action$, store) => {
	return action$.ofType(PUSHER_CONNECT_SUCCESS).mergeMap(res => {
		return Observable.create(observer => {
			try {
				const pid = store.getState().getIn(['user', 'pid']);
				const channel = pusherClinet.subscribe(`private-${pid}`);
				channel.bind('notification', data =>
					observer.next(PusherMessageReceivedAction('notification', data))
				);
				channel.bind('pusher:subscription_succeeded', data =>
					observer.next(PusherSubscribeChannelActionSuccess())
				);
				channel.bind('pusher:subscription_error', status =>
					observer.next(PusherSubscribeChannelActionError(status))
				);
			} catch (e) {
				observer.next(PusherSubscribeChannelActionError(e, 'unexpected'));
				observer.error(e);
			}
		});
	});
};

export const pusherEpic = combineEpics(connectToPusher, subscribeToChannel);
