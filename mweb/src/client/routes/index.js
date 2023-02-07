"use strict";

import React from "react";
import { Router, Route, IndexRoute } from "react-router";
import ContainersApp from "src/client/containers/App";
/*import MprofileIndex from "src/client/containers/mProfile/index";
import MActivityIndex from "src/client/containers/mActivity/index";
import MSubscribeIndex from "src/client/containers/mSubscribe/index";
import MMyGroupsIndex from "src/client/containers/mMyGroups/index";
import MMyCollectIndex from "src/client/containers/mMyCollect/index";
import MGroupIndex from "src/client/containers/mGroup/index";
import MsearchIndex from "src/client/containers/mSearch/index";
import MTopicIndex from "src/client/containers/mTopic/index";
import MNotificationIndex from "src/client/containers/mNotification/index";
import MerrorIndex from "src/client/containers/mError/index";

export default function createRouter(history) {
	return (
		<Router history={history}>
			<Route path="/m" component={ContainersApp}>
				<Route path="/m/profile/:pid" component={MprofileIndex} method="GET" login={false} />
				<Route path="/m/activity/:aid" component={MActivityIndex} method="GET" login={false} />
				<Route path="/m/subscribe" component={MSubscribeIndex} method="GET" login={false} />
				<Route path="/m/myGroups" component={MMyGroupsIndex} method="GET" login={false} />
				<Route path="/m/myCollect" component={MMyCollectIndex} method="GET" login={false} />
				<Route path="/m/group" component={MGroupIndex} method="GET" login={false} />
				<Route path="/m/group/:gid" component={MGroupIndex} method="GET" login={false} />
				<Route path="/m/search" component={MsearchIndex} method="GET" login={false} />
				<Route path="/m/search/:mode" component={MsearchIndex} method="GET" login={false} />
				<Route path="/m/search/:mode/:keyword" component={MsearchIndex} method="GET" login={false} />
				<Route path="/m/topic" component={MTopicIndex} method="GET" login={false} />
				<Route path="/m/topic/:keyword" component={MTopicIndex} method="GET" login={false} />
				<Route path="/m/notification" component={MNotificationIndex} method="GET" login={false} />
				<Route path="/m/error/:error_code" component={MerrorIndex} method="GET,POST" login={false} />
				<Route path="/m/error/:error_code/:error_status" component={MerrorIndex} method="GET,POST" login={false} />
			</Route>
		</Router>
	);
};*/

export const rootRoute = {
	path: '/m',
	indexRoute: {
		getComponent(nextState, cb) {
			require.ensure([], (require) => {
	    	cb(null, require('src/client/containers/mIndex/index').default );
	  	}, "index");
	  },
	},
	childRoutes: [
		require('./beagiver').default,
		// require('./beagiver').default,
		// require('./beagiver').default,
		// require('./beagiver').default,
		require('./profile').main,
		require('./profile').myCollect,
		require('./group').list,
		require('./group').main,
		require('./group').myGroup,
		require('./channel').main,
		require('./search').main,
		require('./search').activity,
		require('./search').profile,
		require('./notification').main,
		require('./topic').main,
		require('./activity').main,
		require('./activity').comment,
		require('./error').mainDetail,
		require('./error').main

		// require('./initial').default,
		// require('./privacy').default,
		// require('./newsletter').default,
		// require('./activity').default,

		// require('./message').cc,
		// require('./message').bc,
		// require('./topic').default,
		// require('./topic').articleList,
		// require('./topic').staffList,
		// require('./topic').staffListSubTopic,

		// require('./error').errorCode,
		// require('./error').errorStatus,
		// require('./mts').disConnect,

		// require('./profile').default,

		// require('./group').applyform,
		// require('./group').content,
		// require('./channel').main,
		// require('./channel').content,
		// require('./test').default,
	],
	getComponent(nextState, cb) {
    cb(null, ContainersApp )
  }
};

export default function createRouter(history) {
	return typeof window === 'undefined' ? rootRoute : (<Router history={history} routes={rootRoute} />);
};
