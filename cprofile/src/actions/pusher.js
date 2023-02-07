export const PUSHER_CONNECT = 'PUSHER_CONNECT';
export const PusherConnectAction = params => ({
	type: PUSHER_CONNECT,
	key: params.key,
	options: params.options,
});

export const PUSHER_DISCONNECT = 'PUSHER_DISCONNECT';
export const PusherDisconnectAction = meta => ({
	type: PUSHER_DISCONNECT,
	meta,
});

export const PUSHER_CONNECT_ERROR = 'PUSHER_CONNECT_ERROR';
export const PusherConnectionErrorAction = (error, eventName = 'error') => ({
	type: PUSHER_CONNECT_ERROR,
	error,
	eventName,
});

export const PUSHER_CONNECT_SUCCESS = 'PUSHER_CONNECT_SUCCESS';
export const PusherConnectionSuccessAction = result => ({
	type: PUSHER_CONNECT_SUCCESS,
	result,
});

export const PUSHER_SUBSCRIBE_CHANNEL = 'PUSHER_SUBSCRIBE_CHANNEL';
export const PusherSubscribeChannelAction = channelName => ({
	type: PUSHER_SUBSCRIBE_CHANNEL,
	channelName,
});

export const PUSHER_SUBSCRIBE_CHANNEL_SUCCESS =
	'PUSHER_SUBSCRIBE_CHANNEL_SUCCESS';
export const PusherSubscribeChannelActionSuccess = () => ({
	type: PUSHER_SUBSCRIBE_CHANNEL_SUCCESS,
});

export const PUSHER_SUBSCRIBE_CHANNEL_ERROR = 'PUSHER_SUBSCRIBE_CHANNEL_ERROR';
export const PusherSubscribeChannelActionError = error => ({
	type: PUSHER_SUBSCRIBE_CHANNEL_ERROR,
	error,
});

export const PUSHER_UNSUBSCRIBE_CHANNEL = 'PUSHER_UNSUBSCRIBE_CHANNEL';
export const PusherUnubscribeChannelAction = () => ({
	type: PUSHER_UNSUBSCRIBE_CHANNEL,
});

export const PUSHER_MESSAGE_RECEIVED = 'PUSHER_MESSAGE_RECEIVED';
export const PusherMessageReceivedAction = (
	category = 'notification',
	msg
) => ({
	type: PUSHER_MESSAGE_RECEIVED,
	category,
	msg,
});
