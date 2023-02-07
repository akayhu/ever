'use strict';
import { match, Router, browserHistory } from 'react-router';
import { rootRoute } from 'src/client/routes';
import 'rxjs';

var React = require('react');
var ReactDOM = require('react-dom');
var c_platform = require('c_platform');

var config = require('src/configs/client').default;
var reactRoutes = require('src/client/routes').default;
var reducers = require('src/client/reducers').default;
var configureStore = require('src/client/store/ConfigureStore').default;
var createEpicMiddleware = require('redux-observable').createEpicMiddleware;
var loadFriendAll = require('src/client/actions/connection').loadFriendAll;
var getAccuseItem = require('src/client/actions/accuse').getAccuseItem;
var elog = require('src/client/middlewares/elog').default;
var pusherEpic = c_platform.epics.pusher.pusherEpic;


__webpack_public_path__ = config.params.staticWapUrl+"/build/";

window.reduxLoggerConfig = {
	predicate: function predicate(getState, action) {
		var ignoreType = ['LONG_POLLING', '[PF]GET_BUBBLE_COUNT', 'GETACCUSEITEM', 'CLEAR_ALERT', 'LOCK_CLEAR'];
		if (ignoreType.indexOf(action.type) === -1) return true;
		else return false
	}
};
window.sendErrorToSlackConfig = {
	'url': 'https://hooks.slack.com/services/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',
	'channel': '#error_catcher',
	'username': 'webhookbot',
	'icon_emoji': ':ghost:'
};

class Root extends React.Component {
	render() {
		return c_platform.render.clientRender(reactRoutes, configureStore, reducers, [createEpicMiddleware(pusherEpic), elog()], {remoteDataUrl: config.params.remoteDataUrl}, function(store) {
			store.dispatch(loadFriendAll());
			store.dispatch(getAccuseItem({
				type: 1
			}));
			store.dispatch(getAccuseItem({
				type: 2
			}))
		});
	}
}

match({ routes: rootRoute, history: browserHistory }, () => {
	ReactDOM.render(
		<Root />,
		document.getElementById('root')
	);
});
