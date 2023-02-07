
import { createStore, applyMiddleware/*, compose*/ } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

var _logger = function __logger() {
	return function (store) {
		return function (next) {
			return function (action) {
				return next(action);
			};
		};
	};
};
const canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);

function checkType(){
	return (store) => (next) => (action) => {
		action.type = action.type || action.CALL_API.type || null;
		return next(action);
	}
}

export default function ConfigureStore(rootReducer, middlewares, initialState) {
	// let composeEnhancers = compose;
	let composeEnhancers = null;
	let loggerConfig = {};
	
	if (canUseDOM){
		if(window.reduxLogger === true) {
			_logger = logger;
		}
		
		loggerConfig = window.reduxLoggerConfig || {};
		
		if (process.env.NODE_ENV !== 'production' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
			composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
		}
	} 
	
	let store = null;
	const defaultMiddlewares = [thunk, checkType(), _logger(loggerConfig)];
	const mergedMiddlewares = defaultMiddlewares.concat(middlewares);
	const applyMiddlewareWrap = applyMiddleware.apply(this, mergedMiddlewares);
	
	if(composeEnhancers){
		store = createStore(
			rootReducer,
			initialState,
			composeEnhancers(applyMiddlewareWrap)
		);
	}else{
		store = createStore(
			rootReducer,
			initialState,
			applyMiddlewareWrap
		);
	}
	
	if (module.hot) {
		module.hot.accept('src/client/reducers', () => {
			const nextReducer = require('src/client/reducers').default;
			store.replaceReducer(nextReducer)
		})
	}

	return store;
};