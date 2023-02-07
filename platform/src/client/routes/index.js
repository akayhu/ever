"use strict";

import App from "src/client/containers/App";
import React from "react";
import { Router, Route, IndexRoute } from "react-router";

// import IndexIndex from "src/client/containers/index/index";
// import ErrorIndex from "src/client/containers/error/index";

// export default function createRouter(history) {
// 	return (
// 		<Router history={history}>
// 			<Route path="/" component={App}>
// 				<IndexRoute component={IndexIndex} />
// 				<Route path="/error/:error_code" component={ErrorIndex} />
// 				<Route path="/error/:error_code/:error_status" component={ErrorIndex} />
// 			</Route>
// 		</Router>
// 	);
// };

const rootRoute = {
	path: '/',
	indexRoute: {
		getComponent(nextState, cb) {
			require.ensure([], (require) => {
	    	cb(null, require('src/client/containers/index/index').default );
	    }, "index");
	  }
	},
	childRoutes: [
		require('./error').errorCode,
		require('./error').errorStatus
	],
	getComponent(nextState, cb) {
    cb(null, App )
  }
};

// function onUpdate() {
// 	// console.log("onUpdate");
// 	var reduxState = JSON.parse(document.getElementById('reduxState').innerHTML);
	
//   if (reduxState) {
//     document.getElementById('reduxState').innerHTML = "";
//     return;
//   }
// }

export default function createRouter(history) {
	return typeof window === 'undefined' ? rootRoute : (<Router history={history} routes={rootRoute} />); //onUpdate={onUpdate}
};