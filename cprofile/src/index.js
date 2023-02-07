// polyfill
import '@babel/polyfill';
import 'react-app-polyfill/ie11';
import 'unfetch/polyfill';
import 'abortcontroller-polyfill/dist/polyfill-patch-fetch';

import React from 'react';
import ReactDOM from 'react-dom';
import { compose } from 'recompose';
import DefaultLayout from './layouts/defaultLayout';
import featureFlags from './config/featureFlags';
import { client } from './config/graphql';
import store from './store';
import initialize from './initial';
import {
	withReduxProvider,
	withApolloProvider,
	withFlagsProvider,
	withReactRouterProvider,
	withMuiThemeProvider,
} from './provider';
import * as serviceWorker from './serviceWorker';

// global style
import 'antd/dist/antd.css';
import 'antd-mobile/dist/antd-mobile.css';

initialize();

const App = () =>
	compose(
		withReduxProvider(store),
		withApolloProvider(client),
		withFlagsProvider(featureFlags),
		withReactRouterProvider,
		withMuiThemeProvider
	)(<DefaultLayout />);

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
