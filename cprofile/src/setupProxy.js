/* eslint-disable */
const proxy = require('http-proxy-middleware');
const yn = require('yn');
const request = require('request');
const server = require('../mockServer/server');

module.exports = function(app) {
	// 載入開發測試用的 mock API routes
	if (yn(process.env.TOGGLE_MOCK_API_SERVER)) {
		server(app);
	}

	// 載入 local 開發用 proxy HPM
	app.use(
		proxy(['/ajax', '/auth', '/connector', '/pusher'], {
			target: 'https://c1.plus.104-dev.com.tw',
			logLevel: 'debug',
			changeOrigin: true,
			ws: true,
			// onProxyRes: (proxyRes, req, res) => {
			// 	console.log(`[onProxyRes] req ${req.url}`);
			// 	console.log(req.headers);
			// 	console.log(`[onProxyRes] proxyRes ${req.url}`);
			// 	console.log(proxyRes.headers);
			// },
			onProxyReq: (proxyReq, req, res) => {
				proxyReq.setHeader('Origin', 'https://local.plus.104-dev.com.tw');
				// console.log(`[onProxyReq] req ${req.url}`);
				// console.log(req.headers);
				// console.log(`[onProxyReq] proxyReq ${req.url}`);
				// console.log(proxyReq.getHeaders());
			},
		})
	);
};
