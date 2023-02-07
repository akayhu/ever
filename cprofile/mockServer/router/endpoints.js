const express = require('express');
const Pusher = require('pusher');
const yn = require('yn');
const endpoints = express.Router();
const {
	MOCK_AUTH_AND_INITIAL_API,
	MOCK_CONNECTOR_API,
	MOCK_ALL_API,
} = process.env;
const pusherConstructor = new Pusher({
	appId: 546609,
	key: '358edcfabdc5025fe562',
	secret: process.env.PUSHER_SECRET,
	cluster: 'ap1',
	encrypted: true,
});

if (yn(MOCK_AUTH_AND_INITIAL_API) || yn(MOCK_ALL_API)) {
	// pusher
	endpoints.post('/pusher/auth', (req, res, next) => {
		// 實際建立 pusher server auth 的口，因為 mock 掉太麻煩了~
		// 真的要 mock 就要用 socket.io 自己 handle 所有東西...
		const socketId = req.body.socket_id;
		const channel = req.body.channel_name;
		const auth = pusherConstructor.authenticate(socketId, channel);
		res.json(auth);
	});

	// 登入
	endpoints.get('/auth/login', (req, res, next) => {
		const { relayState } = req.query;
		res.cookie('CS', 'testcicicici', {
			expires: new Date(Date.now() + 3600000),
			httpOnly: true,
			secure: true,
		});
		res.cookie('SI', 'testsisisisi', {
			expires: new Date(Date.now() + 3600000),
			httpOnly: true,
			secure: true,
		});
		res.cookie('PI', 239876, {
			expires: new Date(Date.now() + 3600000),
			httpOnly: true,
			secure: true,
		});
		global.initial = false;
		res.redirect(relayState || '/editor');
	});

	// 登出
	endpoints.get('/auth/logout', (req, res, next) => {
		const { relayState } = req.query;
		res.clearCookie('CS');
		res.clearCookie('SI');
		res.clearCookie('PI');
		global.initial = false;
		res.redirect(relayState || '/');
	});
}

if (
	(yn(MOCK_CONNECTOR_API) && yn(MOCK_AUTH_AND_INITIAL_API)) ||
	yn(MOCK_ALL_API)
) {
	// Github OAuth
	endpoints.get('/connector/github', (req, res, next) => {
		const resultMap = {
			success: {
				error: '',
				data: {
					connection_type: 'GITHUB',
				},
				extra: 'Github token exists',
				success: 'true',
			},
			error: {
				error: 'something error',
				data: {
					connection_type: 'GITHUB',
				},
				extra: '',
				success: 'false',
			},
		};
		pusherConstructor.trigger(
			'private-239876',
			'notification',
			JSON.stringify(JSON.stringify(resultMap.success))
		);
		// 中間 oauth 流程就跳過啦~
		res.redirect('/redirect.html');
	});
}

module.exports = endpoints;
