const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const yn = require('yn');

const auth = require('./router/auth');
const connector = require('./router/connector');
const custom = require('./router/custom');
const document = require('./router/document');
const gallery = require('./router/gallery');
const honor = require('./router/honor');
const sort = require('./router/sort');
const talent = require('./router/talent');
const user = require('./router/user');
const block = require('./router/block');
const endpoints = require('./router/endpoints');
const { warnTemplate } = require('./router/util');

global.initial = false;

/**
 * API 檢查登入 & 服務啟用
 */
const authenticationFilter = (req, res, next) => {
	// 只有 GET 不用檢查登入 & 服務啟用
	if (req.method === 'GET') return next();

	// 未登入
	if (!req.cookies.PI) {
		return res.status(401).json(warnTemplate('未登入'));
	}

	// 初始化不需要檢查啟用
	if (
		req.method === 'POST' &&
		/\/ajax\/users\/\d+\/initial/.test(req.originalUrl)
	)
		return next();

	// 未啟用
	if (!global.initial) {
		return res.status(403).json(warnTemplate('未啟用服務'));
	}
	return next();
};

/**
 * 開發測試用的 Express API server
 * @param {*} app
 */
const server = app => {
	// default middleware
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(cookieParser());
	app.use(authenticationFilter);

	// endpoints
	app.use('/', endpoints);

	// API
	app.use('/ajax', user);
	if (yn(process.env.MOCK_AUTH_AND_INITIAL_API) || yn(process.env.MOCK_ALL_API))
		app.use('/ajax/auth', auth);
	if (yn(process.env.MOCK_CONNECTOR_API) || yn(process.env.MOCK_ALL_API))
		app.use('/ajax/users/:pid/connectors', connector);
	if (yn(process.env.MOCK_CUSTOM_API) || yn(process.env.MOCK_ALL_API))
		app.use('/ajax/users/:pid/customs', custom);
	if (yn(process.env.MOCK_DOCUMENT_API) || yn(process.env.MOCK_ALL_API))
		app.use('/ajax/users/:pid/document', document);
	if (yn(process.env.MOCK_GALLERY_API) || yn(process.env.MOCK_ALL_API))
		app.use('/ajax/users/:pid/galleries', gallery);
	if (yn(process.env.MOCK_HONOR_API) || yn(process.env.MOCK_ALL_API))
		app.use('/ajax/users/:pid/honors', honor);
	if (yn(process.env.MOCK_SORT_API) || yn(process.env.MOCK_ALL_API))
		app.use('/ajax/users/:pid/sort', sort);
	if (yn(process.env.MOCK_TALENT_API) || yn(process.env.MOCK_ALL_API))
		app.use('/ajax/users/:pid/talents', talent);
	if (yn(process.env.MOCK_BLOCK_API) || yn(process.env.MOCK_ALL_API))
		app.use('/ajax/users/:pid/blocks', block);

	// app.use('/ajax', (req, res) => {
	//   res.status(404).json(warnTemplate('route not found'));
	// });
	return app;
};

module.exports = server;
