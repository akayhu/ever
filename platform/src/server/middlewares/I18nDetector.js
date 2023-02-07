"use strict";

import i18next from "i18next";
import path from "path";

export const EN = "en";
export const ZHTW = "zhTW";

const localesPath = path.resolve(__dirname, path.relative(__dirname, ''));
const I18nDetector = (_defaultDevice, requirePath) => (req, res, next) => {
	const defaultDevice = _defaultDevice || ZHTW;
	const cookie = req.cookies.locale;
	const settings = {
		"lng" : cookie,
		"fallbackLng" : 'en',
		"resources" : {}
	};
	
	if (!cookie){
		settings.lng = defaultDevice;
	}
	
	requirePath = requirePath || (process.env.NODE_ENV !== 'dev'?"lib/client/locales":"src/client/locales");
	var pattern;
	try{
		pattern = require(path.join(localesPath, requirePath, settings.lng, settings.lng+".js"));
	}catch(e) {
		pattern = require(path.join(localesPath, requirePath, defaultDevice, defaultDevice+".js"));
	}
	
	settings.resources[settings.lng] = pattern.default || pattern;
	
	req.nowLanguage = settings.lng;
	req.i18next = i18next.init(settings);
	
	next();
};

export default I18nDetector;