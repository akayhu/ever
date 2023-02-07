"use strict";

var canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);
var c_platform = {};



if(global && global.isomorphic === true){
	// actions
	var alertAction = require('./client/actions/alert');
	var bcCommunicationAction = require('./client/actions/bcCommunication');
	var bubblesAction = require('./client/actions/bubbles');
	var ccCommunicationAction = require('./client/actions/ccCommunication');
	var connectionAction = require('./client/actions/connection');
	var languageAction = require('./client/actions/language');
	var layerControlAction = require('./client/actions/layerControl');
	var metadataActions = require('./client/actions/metadata');
	var notificationAction = require('./client/actions/notification');
	var profileAction = require('./client/actions/profile');
	var pusherAction = require('./client/actions/pusher');
	var testAction = require('./client/actions/test');
	var userAction = require('./client/actions/user');
	// compoennts
	var AppRoot = require('./client/containers/App').default;
	var ViewWrapper = require('./client/containers/ViewWrapper').default;
	// middlewares
	var asyncFeApi = require('./client/middlewares/asyncFeApi').default;
	var compareReduxState = require('./client/middlewares/compareReduxState').default;
	// reducers
	var bcCommunicationReducer = require('./client/reducers/bcCommunication');
	var bubblesReducer = require('./client/reducers/bubbles');
	var ccCommunicationReducer = require('./client/reducers/ccCommunication');
	var connectionReducer = require('./client/reducers/connection');
	var metadataReducer = require('./client/reducers/metadata');
	var navigationReducer = require('./client/reducers/navigation');
	var notificationReducer = require('./client/reducers/notification');
	var alertReducer = require('./client/reducers/alert');
	var historyReducer = require('./client/reducers/history');
	var languageReducer = require('./client/reducers/language');
	var profileReducer = require('./client/reducers/profile');
	var userReducer = require('./client/reducers/user');
	var testReducer = require('./client/reducers/test');
	// epics
	var pusherEpic = require('./client/epics/pusher');
	// render
	var commonRender = require('./client/render/common').default;
	var render = require('./client/render').default;
	// i18n
	var en = require('./client/locales/en/en');
	var zhTW = require('./client/locales/zhTW/zhTW');
	// utils
	var compose = require('./util/compose').default;
	var sendErrorToSlack = require('./util/SendErrorToSlackUtil').default;
	var tagToComponent = require('./util/tagToComponent').default;
	var timeago = require('./util/timeago').default;
	
	c_platform = {
		...c_platform,
		time: process.env.updateDateTime,
		actions: {
			alert: alertAction,
			bcCommunication: bcCommunicationAction,
			bubbles: bubblesAction,
			ccCommunication: ccCommunicationAction,
			connection: connectionAction,
			language: languageAction,
			layerControl: layerControlAction,
			metadata: metadataActions,
			notification: notificationAction,
			profile: profileAction,
			pusher: pusherAction,
			test: testAction,
			user: userAction
		},
		components: {
			AppRoot: AppRoot,
			ViewWrapper : ViewWrapper
		},
		middlewares: {
			asyncFeApi: asyncFeApi,
			compareReduxState : compareReduxState
		},
		reducers: {
			bcCommunication: bcCommunicationReducer,
			bubbles: bubblesReducer,
			ccCommunication: ccCommunicationReducer,
			connection: connectionReducer,
			metadata: metadataReducer,
			navigation: navigationReducer,
			notification: notificationReducer,
			alert: alertReducer,
			history: historyReducer,
			language: languageReducer,
			profile: profileReducer,
			user: userReducer,
			test: testReducer
		},
		epics: {
			pusher: pusherEpic
		},
		render: {
			common: commonRender,
			clientRender: render
		},
		i18n: {
			en: en,
			zhTW: zhTW
		},
		utils: {
			compose: compose,
			sendErrorToSlack: sendErrorToSlack,
			tagToComponent: tagToComponent,
			timeago: timeago
		}
	};
}

if(!canUseDOM){
	var exportServerPath = "./exportServer";
	c_platform.server = require(exportServerPath);
}

var generalConfig = require('./configs/generalConfig');
c_platform.configs = generalConfig;

module.exports = c_platform;