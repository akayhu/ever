"use strict";

import React from "react";
import {components} from "c_platform";
import { Router, Route, IndexRoute } from "react-router";

// import IndexIndex from "src/client/containers/index/index";
// import InitialIndex from "src/client/containers/initial/index";
// import PrivacyIndex from "src/client/containers/privacy/index";
// import NewsletterIndex from "src/client/containers/newsletter/index";
// import ActivitySinglePage from "src/client/containers/activity/singlePage";
// import SearchIndex from "src/client/containers/search/index";
// import SearchPersonListIndex from "src/client/containers/search/searchPersonList/index";
// import SearchGroupListIndex from "src/client/containers/search/searchGroupList/index";
// import SearchChannelListIndex from "src/client/containers/search/searchChannelList/index";
// import SearchActivityListIndex from "src/client/containers/search/searchActivityList/index";
// import ProfileIndex from "src/client/containers/profile/index";
// import ProfileMain from "src/client/containers/profile/main";
// import Component_activitiesPersonalList from "src/client/component_activities/personalList";
// import Component_connectionIndex from "src/client/component_connection/index";
// import GroupGroupList from "src/client/containers/group/groupList";
// import GroupGroupApplyform from "src/client/containers/group/groupApplyform";
// import GroupGroupMain from "src/client/containers/group/groupMain";
// import GroupGroupMember from "src/client/component_group/group/groupMember";
// import GroupGroupManagement from "src/client/component_group/group/groupManagement";
// import ChannelChannelList from "src/client/containers/channel/channelList";
// import ChannelChannelMain from "src/client/containers/channel/channelMain";
// import ChannelChannelMember from "src/client/component_channel/channel/channelMember";
// import ChannelChannelManagement from "src/client/component_channel/channel/channelManagement";
// import NotificationIndex from "src/client/containers/notification/index";
// import CcIndex from "src/client/containers/message/cc/index";
// import BcIndex from "src/client/containers/message/bc/index";
// import TestIndex from "src/client/containers/test/index";
// import TestJob from "src/client/containers/test/job";
// import TestOrganization from "src/client/containers/test/organization";
// import TestIndustry from "src/client/containers/test/industry";
// import TopicIndex from "src/client/containers/topic/index";
// import TopicArticleList from "src/client/containers/topic/articleList";
// import TopicStaffList from "src/client/containers/topic/staffList";
// import ErrorIndex from "src/client/containers/error/index";
// import IndexDone from "src/client/containers/index/done";

// export default function createRouter(history) {
// 	return (
// 		<Router history={history}>
// 			<Route path="/" component={components.AppRoot}>
// 				<IndexRoute component={IndexIndex} />
// 				<Route path="/initial" component={InitialIndex} />
// 				<Route path="/privacy" component={PrivacyIndex} />
// 				<Route path="/newsletter" component={NewsletterIndex} />
// 				<Route path="/activity/:aid" component={ActivitySinglePage} />
// 				<Route path="/notification" component={NotificationIndex} />
// 				<Route path="/message/cc" component={CcIndex} />
// 				<Route path="/message/bc" component={BcIndex} />
// 				<Route path="/topic" component={TopicIndex} />
// 				<Route path="/topic/:topic/articleList" component={TopicArticleList} />
// 				<Route path="/topic/:topic/staffList" component={TopicStaffList} />
// 				<Route path="/topic/:topic/staffList/:subTopic" component={TopicStaffList} />
// 				<Route path="/topic/:topic" component={TopicIndex} />
// 				<Route path="/error/:error_code" component={ErrorIndex} />
// 				<Route path="/error/:error_code/:error_status" component={ErrorIndex} />
// 				<Route path="/mts/disConnect/:targetPid/:ts/:config" component={IndexDone} />

// 				<Route path="/search" component={SearchIndex} >
// 					<Route path="/search/person/:keyword" component={SearchPersonListIndex} />
// 					<Route path="/search/group/:keyword" component={SearchGroupListIndex} />
// 					<Route path="/search/channel/:keyword" component={SearchChannelListIndex} />
// 					<Route path="/search/:mode/:keyword" component={SearchActivityListIndex} />
// 					<Route path="/search/:keyword" component={SearchIndex} />
// 				</Route>

// 				<Route path="/profile" component={ProfileIndex} >
// 					<Route path="/profile/:pid" component={ProfileMain} />
// 					<Route path="/profile/:pid/activity" component={Component_activitiesPersonalList} />
// 					<Route path="/profile/:pid/connection" component={Component_connectionIndex} />
// 				</Route>

// 				<Route path="/group" component={GroupGroupList} />
// 				<Route path="/group/applyform" component={GroupGroupApplyform} />

// 				<Route path="/group/:gid" component={GroupGroupMain} >
// 					<Route path="/group/:gid/member" component={GroupGroupMember} />
// 					<Route path="/group/:gid/member/admin" component={GroupGroupMember} />
// 					<Route path="/group/:gid/management" component={GroupGroupManagement} />
// 				</Route>

// 				<Route path="/channel" component={ChannelChannelList} />

// 				<Route path="/channel/:cid" component={ChannelChannelMain} >
// 					<Route path="/channel/:cid/member" component={ChannelChannelMember} />
// 					<Route path="/channel/:cid/member/admin" component={ChannelChannelMember} />
// 					<Route path="/channel/:cid/management" component={ChannelChannelManagement} />
// 				</Route>

// 				<Route path="/test" component={TestIndex} >
// 					<Route path="/test/job" component={TestJob} />
// 					<Route path="/test/org" component={TestOrganization} />
// 					<Route path="/test/industry" component={TestIndustry} />
// 				</Route>
// 			</Route>
// 		</Router>
// 	);
// };

export const rootRoute = {
	path: '/',
	indexRoute: {
		getComponent(nextState, cb) {
			require.ensure([], (require) => {
	    	cb(null, require('src/client/containers/index/index').default );
	  	}, "index");
	  },
	},
	childRoutes: [
		require('./initial').default,
		require('./privacy').default,
		require('./newsletter').default,
		require('./activity').default,
		require('./notification').default,
		require('./message').cc,
		require('./message').bc,
		require('./topic').default,
		require('./topic').articleList,
		require('./topic').staffList,
		require('./topic').staffListSubTopic,
		require('./topic').content,
		require('./error').errorCode,
		require('./error').errorStatus,
		require('./mts').disConnect,
		require('./search').default,
		require('./profile').default,
		require('./group').main,
		require('./group').applyform,
		require('./group').content,
		require('./channel').main,
		require('./channel').content,
		require('./test').default,
		require('./beagiver').default,
		require('./mail').mailConnection,
		require('./prelogin').default,
		require('./sso').sso,
	],
	getComponent(nextState, cb) {
    cb(null, components.AppRoot )
  }
};

export default function createRouter(history) {
	return typeof window === 'undefined' ? rootRoute : (<Router history={history} routes={rootRoute} />);
};
