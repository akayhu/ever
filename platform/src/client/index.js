"use strict";

var React = require('react');
var ReactDOM = require("react-dom");

var config = require('../configs/client').default;
var clientRender = require('src/client/render').default;
var reactRoutes = require('src/client/routes').default;
var reducers = require('src/client/reducers').default;
var configureStore = require('src/client/store/ConfigureStore').default;
var createEpicMiddleware = require('redux-observable').createEpicMiddleware;
var pusherEpic = require('src/client/epics/pusher').pusherEpic;

__webpack_require__.p = config.params.staticWapUrl+"/build/";

window.sendErrorToSlackConfig = {
	'url': 'https://hooks.slack.com/services/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',
	'channel': '#error_catcher',
	'username': 'webhookbot',
	'icon_emoji': ':ghost:'
};

class Root extends React.Component {
	render() {
		return clientRender(reactRoutes, configureStore, reducers, [createEpicMiddleware(pusherEpic)], {remoteDataUrl: config.params.remoteDataUrl});
	}
}

ReactDOM.render(
	<Root />, 
	document.getElementById('root')
);