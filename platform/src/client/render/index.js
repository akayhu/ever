"use strict";

import React from "react";
import i18next from "i18next";
import { browserHistory } from "react-router";
import clientRender from './common';
import { compareReduxState, asyncFeApi } from '../middlewares';

const render = (reactRoutes, configureStore, reducers, middlewares, settings, callback) => {
	
	settings = settings || {remoteDataUrl:""};
	var newMiddlewares = middlewares = [compareReduxState(), asyncFeApi(settings.remoteDataUrl)].concat(middlewares || []);
	var routerContext = reactRoutes(browserHistory);
	var reduxState = JSON.parse(document.getElementById('reduxState').innerHTML);
	var store = configureStore(reducers, newMiddlewares, reduxState);
	var language = store.getState().language;
	var c_platformLanguageTemplates = window["c_platform_"+language] || {};
	var c_wapLanguageTemplates = window["c_wap_"+language] || {};
	var languageTemplates = {common: {...c_platformLanguageTemplates.common, ...c_wapLanguageTemplates.common}}
	var languageSetting = {
		"lng": language,
		"fallbackLng" : 'en',
		"resources": {
			[language] : languageTemplates
		}
	};
	var i18n = i18next.init(languageSetting);

	store.subscribe(function reloadSelf(){
		var state = store.getState();
		if(language !== state.language){
			window.location.replace(window.location.href);
		}
	});
	
	if(callback){
		callback(store);
	}
	
	return clientRender(store, i18n, routerContext);
}

export default render;