/* eslint-disable */
import {
	PUSHER_CONNECT,
	PusherConnectAction,
	PUSHER_DISCONNECT,
	PusherDisconnectAction,
	PUSHER_CONNECT_ERROR,
	PusherConnectionErrorAction,
	PUSHER_CONNECT_SUCCESS,
	PusherConnectionSuccessAction,
	PUSHER_SUBSCRIBE_CHANNEL,
	PusherSubscribeChannelAction,
	PUSHER_SUBSCRIBE_CHANNEL_SUCCESS,
	PusherSubscribeChannelActionSuccess,
	PUSHER_SUBSCRIBE_CHANNEL_ERROR,
	PusherSubscribeChannelActionError,
	PUSHER_UNSUBSCRIBE_CHANNEL,
	PusherUnubscribeChannelAction,
	PUSHER_MESSAGE_RECEIVED,
	PusherMessageReceivedAction,
} from 'actions/pusher';

describe('pusher actions', () => {
	it('Pusher Connect Action', () => {
		const params = {
			key: '3345678',
			cluster: 'profile',
			authEndpoint: 'profile',
			encrypted: true,
		};
		const expectedAction = {
			type: PUSHER_CONNECT,
			key: params.key,
			options: params.options,
		};
		expect(PusherConnectAction(params)).toEqual(expectedAction);
	});

	it('Pusher Disconnect Action', () => {
		const meta = '';
		const expectedAction = {
			type: PUSHER_DISCONNECT,
			meta,
		};
		expect(PusherDisconnectAction(meta)).toEqual(expectedAction);
	});

	it('Pusher Connection Error Action', () => {
		const error = '';
		const eventName = 'error';
		const expectedAction = {
			type: PUSHER_CONNECT_ERROR,
			error,
			eventName,
		};
		expect(PusherConnectionErrorAction(error, eventName)).toEqual(
			expectedAction
		);
	});

	it('Pusher Connection Success Action', () => {
		const result = {
			id: 108190,
		};
		const expectedAction = {
			type: PUSHER_CONNECT_SUCCESS,
			result,
		};
		expect(PusherConnectionSuccessAction(result)).toEqual(expectedAction);
	});

	it('Pusher Subscribe Channel Action', () => {
		const channelName = 'GitHub';
		const expectedAction = {
			type: PUSHER_SUBSCRIBE_CHANNEL,
			channelName,
		};
		expect(PusherSubscribeChannelAction(channelName)).toEqual(expectedAction);
	});

	it('Pusher Subscribe Channel Action Success', () => {
		const expectedAction = {
			type: PUSHER_SUBSCRIBE_CHANNEL_SUCCESS,
		};
		expect(PusherSubscribeChannelActionSuccess()).toEqual(expectedAction);
	});

	it('Pusher Subscribe Channel Action Error', () => {
		const error = 'error';
		const expectedAction = {
			type: PUSHER_SUBSCRIBE_CHANNEL_ERROR,
			error,
		};
		expect(PusherSubscribeChannelActionError(error)).toEqual(expectedAction);
	});

	it('Pusher Unubscribe Channel Action', () => {
		const expectedAction = {
			type: PUSHER_UNSUBSCRIBE_CHANNEL,
		};
		expect(PusherUnubscribeChannelAction()).toEqual(expectedAction);
	});

	it('Pusher Message Received Action', () => {
		const category = 'notification';
		const msg = 'good';
		const expectedAction = {
			type: PUSHER_MESSAGE_RECEIVED,
			category,
			msg,
		};
		expect(PusherMessageReceivedAction(category, msg)).toEqual(expectedAction);
	});
});
