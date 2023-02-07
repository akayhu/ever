import Pusher, { Pusher as PusherInterface } from 'pusher-js';
import { Observable } from 'rxjs/Rx';
import { combineEpics } from 'redux-observable';
import { Store } from 'redux';
import {
	PUSHER_CONNECT,
	PUSHER_DISCONNECT,
	PUSHER_CONNECT_SUCCESS,
	PUSHER_CONNECT_ERROR,
	PUSHER_SUBSCRIBE_CHANNEL,
	PUSHER_SUBSCRIBE_CHANNEL_SUCCESS,
	PUSHER_UNSUBSCRIBE_CHANNEL,
	PUSHER_MESSAGE_RECEIVED,
} from '../actions/pusher';

let pusherClinet = PusherInterface;

export const connectToPusher = (action$) => {
	return action$
		.ofType(PUSHER_CONNECT)
		.mergeMap((res) => {
			return Observable.create((observer) => {
				Pusher.logToConsole = false;
				pusherClinet = new Pusher(res.key, res.options);
				pusherClinet.connection.bind('connected', (result) => {
					observer.next({
						type: PUSHER_CONNECT_SUCCESS,
						result
					});
				});

				pusherClinet.connection.bind('error', (error) => {
					observer.error({
						type: PUSHER_CONNECT_ERROR,
						error
					});
				});

				// const channel = pusherClinet.subscribe(`private-${pid}`);
				// channel.bind('notification', (data) => {
				// 	observer.next({
				// 		type: PUSHER_MESSAGE_RECEIVED,
				// 		msg: data
				// 	});
				// });

				// channel.bind('pusher:subscription_succeeded', () => {
				// 	observer.next({
				// 		type: PUSHER_SUBSCRIBE_CHANNEL_SUCCESS,
				// 	});
				// });
			});
		});
};

export const subscribeToChannel = (action$, store) => {
	const pid = store.getState().user.pid;

	return action$
		.ofType(PUSHER_CONNECT_SUCCESS)
		.mergeMap((res) => {
			return Observable.create((observer) => {
				const channel = pusherClinet.subscribe(`private-${pid}`);
				channel.bind('notification', (data) => {
					observer.next({
						type: PUSHER_MESSAGE_RECEIVED,
						category: 'notification',
						msg: data
					});
				});

				channel.bind('pusher:subscription_succeeded', (data) => {
					observer.next({
						type: PUSHER_SUBSCRIBE_CHANNEL_SUCCESS,
					});
				});
			});
		});
};

export const pusherEpic = combineEpics(
	connectToPusher,
	subscribeToChannel
);
