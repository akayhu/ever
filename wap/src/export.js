"use strict";

var canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);
var c_wap = {};

if(global && global.isomorphic === true){
	// actions
	var accessRecordAction = require('./client/actions/accessRecord.js');
	var connectionAction = require('./client/actions/connection.js');
	var chronicleAction = require('./client/actions/chronicle.js');
	//var privacyAction = require('./client/actions/privacy.js');
	var profileAction = require('./client/actions/profile.js');
	var socialAction = require('./client/actions/social/index.js');
	var searchAction = require('./client/actions/search.js');
	var endorseAction = require('./client/actions/endorse.js');
	var activityAction = require('./client/actions/activity/index.js');
	// reducers
	var accessRecordReducer = require('./client/reducers/accessRecord.js');
	var profileReducer = require('./client/reducers/profile.js');
	var chronicleReducer = require('./client/reducers/chronicle.js');
	var globalReducer = require('./client/reducers/global.js');
	var groupReducer = require('./client/reducers/group/index.js');
	var notificationReducer = require('./client/reducers/notification.js');
	var searchReducer = require('./client/reducers/search.js');
	var endorseReducer = require('./client/reducers/endorse.js');
	var activityReducer = require('./client/reducers/activity/index.js');
	var socialReducer = require('./client/reducers/social/index.js');
	// i18n
	var en = require('./client/locales/en/en.js');
	var zhTW = require('./client/locales/zhTW/zhTW.js');

	c_wap = {
		time: process.env.updateDateTime,
		actions : {
			connection: connectionAction,
			chronicle: chronicleAction,
			profile: profileAction,
			social: socialAction,
			search: searchAction,
			endorse: endorseAction,
			activity: activityAction,
			accessRecord: accessRecordAction
		},
		components : {},
		middlewares : {},
		reducers : {
			profile: profileReducer,
			chronicle: chronicleReducer,
			global: globalReducer,
			group: groupReducer,
			search: searchReducer,
			endorse: endorseReducer,
			activity: activityReducer,
			notification: notificationReducer,
			social: socialReducer,
			accessRecord: accessRecordReducer
		},
		locales: {
			en: en,
			zhTW: zhTW
		},
		utils: {}
	}
}

if(!canUseDOM){
	var exportServerPath = "./exportServer";
	c_wap.server = require(exportServerPath);
}

module.exports = c_wap;
