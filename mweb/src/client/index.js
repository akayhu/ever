'use strict';

import 'rxjs';

const React = require('react');
const ReactDOM = require('react-dom');
const c_platform = require('c_platform');
const ga = require('react-ga');

const config = require('src/configs/client').default;
const reactRoutes = require('src/client/routes').default;
const reducers = require('src/client/reducers').default;
const configureStore = require('src/client/store/ConfigureStore').default;
const warning = require('src/client/middlewares/warning').default;
const createEpicMiddleware = require('redux-observable').createEpicMiddleware;

const pusherEpic = c_platform.epics.pusher.pusherEpic;
__webpack_public_path__ = `${config.params.staticMWapUrl}/build/`;

const options = { debug: false };
ga.initialize(config.params.GAID, options);

const Root = () => c_platform.render.clientRender(
	reactRoutes,
	configureStore,
	reducers,
	[createEpicMiddleware(pusherEpic), warning()],
	{remoteDataUrl: config.params.remoteDataUrl},
);

ReactDOM.render(
	<Root />,
	document.getElementById('root'),
);
