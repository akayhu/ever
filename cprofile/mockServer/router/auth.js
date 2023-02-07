const express = require('express');
const auth = express.Router();
const { resTemplate } = require('./util');

const resMap = {
	logout: {
		type: 0,
		PI: null,
	},
	incomplete: {
		type: 1,
		PI: null,
	},
	loginButNoInitial: {
		type: 2,
		PI: 239876,
	},
	loginAndInitial: {
		type: 3,
		PI: 239876,
	},
};

/**
 * 取得登入 & 啟用狀態
 * https://c1.plus.104-dev.com.tw/swagger-ui.html#/rest-auth-controller/getAuthStatusUsingGET
 */
auth.get('/status', (req, res) => {
	if (req.cookies.CS && req.cookies.SI) {
		if (!req.cookies.PI) {
			res.json(resTemplate(resMap.incomplete));
			return;
		}

		res.json(
			global.initial
				? resTemplate(resMap.loginAndInitial)
				: resTemplate(resMap.loginButNoInitial)
		);
		return;
	}
	res.clearCookie('CS');
	res.clearCookie('SI');
	res.clearCookie('PI');
	global.initial = false;
	res.json(resTemplate(resMap.logout));
});

module.exports = auth;
