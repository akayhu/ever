"use strict";

import React from "react";
import log4js from "log4js";
import ReactDOMServer from "react-dom/server";
import { match, RouterContext, useRouterHistory } from "react-router";
import { createMemoryHistory, useQueries } from 'history';
import { Provider } from "react-redux";
import { I18nextProvider }  from "react-i18next";
import ErrorMessageUtil from "../../util/ErrorMessageUtil";

var errorTimer;
var errorCount = 0;

function renderError(error, req, res, next, settings){
	var clientRender = require('../../client/render/common').default;
	var reducers = require('src/client/reducers').default;
	var configureStore = require('src/client/store/ConfigureStore').default;
	var reactRoutes = require('src/client/routes').default;
	var config = require('src/configs/config').default;
	var asyncBeApi = require("./asyncBeApi").default;
	
	const initAsyncBeApi = asyncBeApi(config.params.remoteDataUrl);
	const history = useRouterHistory(useQueries(createMemoryHistory))();
	const routes = reactRoutes(history);
	const location = history.createLocation(settings.path);
	const layoutName = "ErrorLayout";
	const passToLayoutState = req.passToLayoutState || {};
	const i18n = req.i18next;
	const reduxState = req.reduxState||{};
	const preState = {...reduxState};
	const middlewares = [initAsyncBeApi(req)];
	
	preState.user = req.userModel;
	if (preState.user) preState.user.showErrorPage = settings.path; // sso 第2層網址防呆
	preState.language = req.nowLanguage;
	preState.history = {
		prevUrl: (req.query.r || req.headers['referer'] || '/'),
		currentUrl: req.originalUrl
	};
	
	match({ routes, location }, (errorIn, redirectLocation, renderProps) => {
		try{
			if (redirectLocation) {
				res.redirect(302, redirectLocation.pathname + redirectLocation.search);
			} else if (errorIn) {
				next(error);
			} else if (!renderProps) {
				next({
					code: 404,
					message: "Render Error : Route match error : Cannot find route '"+req.originalUrl+"'",
					stack: ""
				});
			} else {
				
				req.isAlreadyFetchData = true;
				
				let store = configureStore(reducers, middlewares, preState);
				const routerContext = <RouterContext {...renderProps} />;
				const clientResult = clientRender(store, i18n, routerContext);
				const container = ReactDOMServer.renderToString(clientResult);	
				const sourceState = store.getState() || {};
				const metadata = sourceState.metadata || {};
				const layoutPath = (process.env.NODE_ENV !== 'dev'?'lib/server/layouts/'+layoutName:'src/server/layouts/'+layoutName);
				const layoutSource = require(layoutPath).default;
				
				passToLayoutState.reduxState = sourceState;
				passToLayoutState.metadata = metadata;

				const layout = React.createElement(layoutSource, passToLayoutState, container);
				const i18nextProvider = React.createElement(I18nextProvider, { i18n : i18n }, layout);
				const provider = React.createElement(Provider, { store : store }, i18nextProvider);
				let markup = '<!DOCTYPE lang="en">' + ReactDOMServer.renderToStaticMarkup(provider);
				
				res.cookie('locale', req.nowLanguage, { maxAge: 900000, httpOnly: false });
				res.status(settings.code).send(markup);
				
				store = null;
			}
		}catch(layerError){
			layerError.code = 500;
			ErrorMessageUtil(layerError, req);
			next(error);
		}
	});
}

function recordError(){
	if (!errorTimer) {
		console.log('register error timer')
		errorTimer = setTimeout(() => {
			errorCount = 0;
			errorTimer = clearTimeout(errorTimer)
			console.log('reset error timer', { errorTimer, errorCount })
		}, 5000);
	}

	errorCount++;
	console.log('error count ++', { errorTimer, errorCount })
}

export const getErrorCount = () => {
	return errorCount;
};

const ErrorHandler = (prefix, pattern) => (error, req, res, next) => {
	
	prefix = prefix || "";
	
	ErrorMessageUtil(error, req);
	
	if(/error.+/gi.test(req.originalUrl)){
		return next(error);
	}
	
	if(error.code && error.code === 401) {
		if(pattern && pattern[401]){
			return pattern[401](error, req, res, next);
		}else{
			return res.redirect('/sso/saml-login?r='+req.originalUrl);
		}
	}
	else if(error.code && error.code === 404){
		if(pattern && pattern[404]){
			return pattern[404](error, req, res, next);
		}else{
			
			var pathname = prefix+'/error/404';
			
			if(/\/activity\//g.test(req.originalUrl)){
				pathname+='/activity';
			}else if(/\/profile\//g.test(req.originalUrl)){
				pathname+='/member';
			}else if(/\/group\//g.test(req.originalUrl)){
				pathname+='/group';
			}else if(/\/channel\//g.test(req.originalUrl)){
				pathname+='/channel';
			}
			
			return renderError(error, req, res, next, {
				path: pathname,
				code: 404
			});
			// return res.redirect('/error/404');
			// return res.status(404).send("Not Found");
		}
	}
	else if(error.code && error.code === 405){
		if(pattern && pattern[405]){
			return pattern[405](error, req, res, next);
		}else{
			return renderError(error, req, res, next, {
				path: prefix+'/error/404',
				code: 405
			});
			// return res.redirect('/error/405');
			// return res.status(405).send("Method Not Allowed");
		}
	}
	else if(error.code && error.code === 500) {
		
		recordError();
		
		if(pattern && pattern[500]){
			return pattern[500](error, req, res, next);
		}else{
			return renderError(error, req, res, next, {
				path: prefix+'/error/500',
				code: 500
			});
			// return res.redirect('/error/500');
			// return res.status(500).send("Internal Server Error");
		}
	}
	
	recordError();
	next(error);
};

export default ErrorHandler;