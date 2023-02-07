

import {server} from 'c_platform';
import {actionDisConnect, updateMts} from '../server/controllers/MtsController';
import {actionView} from '../server/controllers/MeController';
import {actionActivity} from '../server/controllers/ActivityController';
import {actionCode} from '../server/controllers/ErrorController';
import {ssoActionCode} from '../server/controllers/SSOErrorController';
import {actionAjax} from '../server/controllers/IndexController';
import {
	actionWelcome,
	actionProfile,
	actionSearch,
	actionGroup,
	actionGroupId,
	actionChannelId,
	actionContact,
	actionMedia,
	actionMediaKeyword,
	actionMyCollect,
	actionPrivacy,
	actionSitemap,
	actionSitemapCustom,
	actionOpenSearch,
} from '../server/controllers/RoutesController';

const routes = {
	...server.configs.routes,
	'/sitemap_custom.xml':{
		method: 'get',
		handler: actionSitemapCustom
	},
	'/sitemap.xml':{
		method: 'get',
		handler: actionSitemap
	},
	'/mts/disConnect/:targetPid/:ts/:config': {
		method: 'all',
		handler: [actionDisConnect, updateMts],
		layout: 'IndexLayout'
	},
	'/welcome': {
		method: 'all',
		handler: actionWelcome
	},
	'/me': {
		method: 'all',
		handler: actionView
	},
	'/profile/:pid': {
		method: 'get',
		handler: actionProfile,
		layout: 'ProfileLayout'
	},
	'/channel': {
		method: 'get',
		layout: 'ChannelLayout'
	},
	'/channel/:cid': {
		method: 'get',
		handler: actionChannelId,
		layout: 'ChannelLayout'
	},
	'/group': {
		method: 'get',
		layout: 'GroupLayout'
	},
	'/group/:gid': {
		method: 'get',
		handler: actionGroupId,
		layout: 'GroupLayout'
	},
	'/activity/:aid': {
		method: 'get',
		layout: 'ActivityLayout'
	},
	'/notification': {
		method: 'get',
		layout: 'FullHeightLayout'
	},
	'/message': {
		'/cc': {
			method: 'get',
			layout: 'FullHeightLayout'
		},
		'/bc': {
			method: 'get',
			layout: 'FullHeightLayout'
		}
	},
	'/error': {
		'/:errorCode': {
			method: 'all',
			handler: actionCode,
			layout: 'ErrorLayout'
		},
		'/:errorCode/:error_status': {
			method: 'all',
			handler: actionCode,
			layout: 'ErrorLayout'
		}
	},
	'/initial': {
		method: 'get',
		login: true
	},
	'/privacy': {
		method: 'get',
		login: true
	},
	'/newsletter': {
		method: 'get',
		login: true
	},
	'/test/job': {
		method: 'get',
		login: true
	},
	'/test/org': {
		method: 'get',
		login: true
	},
	'/test/industry': {
		method: 'get',
		login: true
	},
	'/search/p/:keyword': {
		method: 'get',
		handler: actionSearch
	},
	'/opensearch.xml': {
		method: 'get',
		handler: actionOpenSearch
	},
	'/p/group/:gid': {
		method: 'get',
		handler: actionGroup
	},
	'/contact/reply': {
		method: 'get',
		handler: actionContact
	},
	'/media/:cid': {
		method: 'get',
		handler: actionMediaKeyword
	},
	'/media': {
		method: 'get',
		handler: actionMedia
	},
	'/privacy/set': {
		method: 'get',
		handler: actionPrivacy
	},
	'/privacyCheck': {
		method: 'get',
		handler: actionPrivacy
	},
	'/myCollect': {
		method: 'get',
		handler: actionMyCollect
	},
	'/104beagiver/:current': {
		method: 'get',
		layout: 'BeAGiverLayout'
	},
	'/104beagiver': {
		method: 'get',
		layout: 'BeAGiverLayout'
	},
	'/mail/:type/:action': {
		method: 'get',
		login: true
	},
	'/sso/:other': {
		method: 'all',
		handler: ssoActionCode,
		layout: 'ErrorLayout'
	}
};

if (process.env.NODE_ENV === 'dev') {
	if (global.isomorphic === true) {
		routes['/ajax'] = {
			'/*': {
				method: 'all',
				handler: actionAjax
			}
		};
	}
}

export default routes;
