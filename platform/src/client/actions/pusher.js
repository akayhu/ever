export const PUSHER_CONNECT = 'PUSHER_CONNECT';
export const PUSHER_DISCONNECT = 'PUSHER_DISCONNECT';
export const PUSHER_CONNECT_ERROR = 'PUSHER_CONNECT_ERROR';
export const PUSHER_CONNECT_SUCCESS = 'PUSHER_CONNECT_SUCCESS';
export const PUSHER_SUBSCRIBE_CHANNEL = 'PUSHER_SUBSCRIBE_CHANNEL';
export const PUSHER_SUBSCRIBE_CHANNEL_SUCCESS = 'PUSHER_SUBSCRIBE_CHANNEL_SUCCESS';
export const PUSHER_UNSUBSCRIBE_CHANNEL = 'PUSHER_UNSUBSCRIBE_CHANNEL';
export const PUSHER_MESSAGE_RECEIVED = 'PUSHER_MESSAGE_RECEIVED';


export const PusherConnectAction = (params) => {

	return {
		type: PUSHER_CONNECT,
		key: params.key,
		options: params.options
	};
};

export const PusherDisconnectAction = () => {
	return {
		type: PUSHER_DISCONNECT
	};
};

export const PusherConnectionErrorAction = (error) => {
	return {
		type: PUSHER_CONNECT_ERROR,
		error
	};
};

export const PusherConnectionSuccessAction = (result) => {
	return {
		type: PUSHER_CONNECT_SUCCESS,
		result
	};
};

export const PusherSubscribeChannelAction = (channelName) => {
	return {
		type: PUSHER_SUBSCRIBE_CHANNEL,
		channelName
	};
};

export const PusherSubscribeChannelActionSuccess = () => {
	return {
		type: PUSHER_SUBSCRIBE_CHANNEL_SUCCESS
	};
};

export const PusherUnubscribeChannelAction = () => {
	return {
		type: PUSHER_UNSUBSCRIBE_CHANNEL
	};
};

export const PusherMessageReceivedAction = (msg) => {
	return {
		type: PUSHER_MESSAGE_RECEIVED,
		msg
	};
};

