// import LogRocket from 'logrocket';
// import setupLogRocketReact from 'logrocket-react';
import store from './store';
import generalConfig from './config/general';
import { isValidStage, isValidRoute } from 'utils/validation';
import persistState from './localStorage';
import { accountProcessStart } from 'actions/user';
// import { requestFetchCategoryJSON } from 'actions/category';

const initialize = () => {
	// 瀏覽器套件
	global.commonBrowser104 &&
		global.commonBrowser104.init({
			date: '2018年11月19日',
			browserVersion: 'IE10',
			lowest: [10],
			support: ['ie'],
			fixedHeight: '50px',
		});

	// 初始化 localStorage
	persistState.init();

	// 取得登入狀態
	store.dispatch(accountProcessStart());

	// 取得類目選單資料
	// store.dispatch(requestFetchCategoryJSON({ dataSource: 'JobCat' }));
	// store.dispatch(requestFetchCategoryJSON({ dataSource: 'Indust' }));

	// 針對 prerender 不啟用任何 saas
	if (window.injectProperty) return;

	// 針對開發環境不啟用 sass
	if (isValidStage(['local'])) return;

	if (isValidRoute(generalConfig.saasBypassPath)) return;

	// 初始化 Drift，Freebird 專案嵌入 iframe 則不顯示
	// if (window.location.pathname.indexOf('commonMode') === -1) {
	// 	global.drift && global.drift.load(generalConfig.drift);
	// }

	// 初始化 LogRocket
	// LogRocket.init(generalConfig.logrocket, {
	// 	release: process.env.REACT_APP_COMMITHASH,
	// 	network: {
	// 		// 遮蔽 request body 資料
	// 		requestSanitizer(request) {
	// 			const ignorePattern = [
	// 				{
	// 					pattern: '/users/\\d+/basic',
	// 					ignoreAll: false,
	// 					handler: request => ({ ...request, body: null }),
	// 				},
	// 				{
	// 					pattern: '/member',
	// 					ignoreAll: false,
	// 					handler: request => ({ ...request, body: null }),
	// 				},
	// 			];

	// 			for (let i = 0; i < ignorePattern.length; ++i) {
	// 				const setting = ignorePattern[i];
	// 				const reg = new RegExp(setting.pattern, 'ig');
	// 				if (reg.test(request.url))
	// 					return setting.ignoreAll ? null : setting.handler(request);
	// 			}
	// 			return request;
	// 		},
	// 	},
	// });
	// setupLogRocketReact(LogRocket);

	// Integration
	// LogRocket.getSessionURL(function(sessionURL) {
	// 	global.drift.track('LogRocket', { sessionURL: sessionURL });
	// });
};

export default initialize;
