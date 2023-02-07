"use strict";

import React from "react";
import log4js from "log4js";
import ReactDOMServer from "react-dom/server";
import { match, RouterContext, useRouterHistory } from "react-router";
import { Provider } from "react-redux";
import { I18nextProvider }  from "react-i18next";
import { createMemoryHistory, useQueries } from 'history';
import clientRender from '../../client/render/common';
import asyncBeApi from "../middlewares/asyncBeApi";
import ErrorMessageUtil from "../../util/ErrorMessageUtil";

const normalLog = log4js.getLogger("normal");

const render = (remoteDataUrl, reactRoutes, configureStore, reducers, middlewares) => {
	const initAsyncBeApi = asyncBeApi(remoteDataUrl);

	return (req, res, next) => {
		
		req.isAlreadyFetchData = false;
		
		const history = useRouterHistory(useQueries(createMemoryHistory))();
		const location = history.createLocation(req.originalUrl);
		const routes = reactRoutes(history);
		const layoutName = req.layout || "IndexLayout";
		const passToLayoutState = req.passToLayoutState || {};
		const i18n = req.i18next;
		const reduxState = req.reduxState || {};
		const preState = { ...reduxState };

		const newMiddlewares = [initAsyncBeApi(req)].concat(middlewares || []);

		preState.user = req.userModel;
		preState.language = req.nowLanguage;
		preState.history = {
			prevUrl: (req.query.r || req.headers['referer'] || '/'),
			currentUrl: req.originalUrl
		};

		if (/logout/g.test(preState.history.prevUrl)) {
			preState.history.prevUrl = "/";
		}

		match({ routes, location }, (error, redirectLocation, renderProps) => {
			try {
				if (redirectLocation) {
					res.redirect(302, redirectLocation.pathname + redirectLocation.search);
				} else if (error) {
					next({
						code: 500,
						message: error.message,
						stack: error.stack || ""
					})
				} else if (!renderProps) {
					next({
						code: 404,
						message: "Render Error : Route match error : Cannot find route '" + req.originalUrl + "'",
						stack: ""
					});
				} else {
					const routerContext = <RouterContext { ...renderProps } />;
					let store = configureStore(reducers, newMiddlewares, preState);	
					var clientResult = null;
					var timerOver = null;
					var timerCheck = null;
					var container = "";
					var sourceState = {};
					var metadata = {};
					var locker = false;
					var isAlreadyRun = false;
					var subscribeTimer = null;
					var subscribeTimerRun = null;

					function renderLayout() {
						try {
							const layoutPath = /\//g.test(layoutName) ? layoutName : (process.env.NODE_ENV !== 'dev' ? 'lib/server/layouts/' + layoutName: 'src/server/layouts/' + layoutName);
							const layoutSource = require(layoutPath).default;
							
							passToLayoutState.reduxState = sourceState;
							passToLayoutState.metadata = metadata;
							
							const layout = React.createElement(layoutSource, passToLayoutState, container);
							const i18nextProvider = React.createElement(I18nextProvider, { i18n : i18n }, layout);
							const provider = React.createElement(Provider, { store : store }, i18nextProvider);
							const markup = '<!DOCTYPE html>' + ReactDOMServer.renderToStaticMarkup(provider);

							res.cookie('locale', req.nowLanguage, { maxAge: 900000, httpOnly: false });

							var ssrStatus = passToLayoutState.errorCode || 200;
							res.status(ssrStatus).send(markup);
							
							store = null;

						} catch (layerError) {
							next({
								code: 500,
								message: layerError.message,
								stack: layerError.stack
							});
						}
					}
					
					function afterProcess(isOver) {
						if (isOver) {
							normalLog.warn({
								url: req.originalUrl,
								message: "timerOver-run",
							});
						} else {
							normalLog.info({
								url : req.originalUrl,
								message : "",
							});
						}
						
						req.isAlreadyFetchData = true;
						
						try {
							clientResult = clientRender(store, i18n, routerContext);
							container = ReactDOMServer.renderToString(clientResult);
							sourceState = store.getState() || {};
							metadata = sourceState.metadata || {};
						} catch (containerError) {
							containerError.code = 500;
							ErrorMessageUtil(containerError, req);
							
							container = "";
							sourceState = { ...preState };
							metadata = {};
						}
						
						renderLayout();
					}
					
					// 有 connect 無論有沒有 action 都會走這裡 
					store.subscribe(function handleChange() {
						if (store) {
							const status = store.getState().ssrStatusCode.status;
							if(status !== null) passToLayoutState.errorCode = status;
						}

						if (locker || !req.dataCheckPointMap) {
							return;
						}
						
						var goNext = true;
						for (var checkPoint in req.dataCheckPointMap) {
							if (!req.dataCheckPointMap[checkPoint]) {
								goNext = false
							}
						}
						
						if (goNext === true) {
							subscribeTimer = new Date().getTime();
							subscribeTimerRun = setTimeout(() => {
								var now = new Date().getTime();
								
								if (subscribeTimer + 10 <= now) {
									locker = true;
									
									if (!isAlreadyRun) {
										clearTimeout(timerOver);
										clearTimeout(timerCheck);
										isAlreadyRun = true;
										// console.log("subscribe-run");
										afterProcess();
									}
								}
							}, 10);
						}
					});
					
					try {
						clientResult = clientRender(store, i18n, routerContext);
						ReactDOMServer.renderToStaticMarkup(clientResult);
						
						// 如果10微秒後發現沒有dataCheckPointMap出現
						// 就直接走render
						timerCheck = setTimeout(function() {
							if (!req.dataCheckPointMap) {
								clearTimeout(timerOver);
								
								if (!isAlreadyRun) {
									isAlreadyRun = true;
									// console.log("timerCheck-run");
									afterProcess();
								}
							}
						}, 100);
												
						// 超時5000微秒後會走這裡 
						timerOver = setTimeout(function() {
							if (!isAlreadyRun) {
								isAlreadyRun = true;
								// console.log("timerOver-run");
								afterProcess(true);
							}
						}, 7000);
					} catch (getDataError) {
						
						getDataError.code = 500;
						ErrorMessageUtil(getDataError, req);
						
						container = "";
						sourceState = { ...preState };
						metadata = {};
						
						clearTimeout(timerOver);
						clearTimeout(timerCheck);
						renderLayout();
					}
				}
			} catch (jsxError) {
				next({
					code: 500,
					message: jsxError.message,
					stack: jsxError.stack
				});
			}
		});
	};
};

export default render;
