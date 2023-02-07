"use strict";

import MobileDetect from "mobile-detect";

export const DESKTOP = "desktop";
export const MOBILE = "mobile";
export const TABLET = "tablet";

const DeviceDetector = (_defaultDevice) => (req, res, next) => {
	const originalUrl = req.originalUrl;
	const cookie = req.cookies.majorPc;	
	const defaultDevice = _defaultDevice || DESKTOP;
	const mobileDetect = new MobileDetect(req.headers['user-agent']);
	
	try {
		if(mobileDetect.mobile() === null && mobileDetect.tablet() === null){
			req.nowDevice = 'desktop';
		}else if(mobileDetect.mobile() !== null && mobileDetect.tablet() === null){
			req.nowDevice = 'mobile';
		}else{
			req.nowDevice = 'tablet';
		}
	}catch(e){
		req.nowDevice = defaultDevice;	
	}

	if((req.nowDevice === 'desktop' || req.nowDevice === 'tablet')) {
		return next();
	}else if(req.nowDevice === 'mobile') {
		if(cookie === "true"){
			return next();
		}else{
			if( /\/m(\/.+|\/|$)/g.test(originalUrl) || /\/(ajax|sso|monitor)\//g.test(originalUrl) || /.+\.\w+$/g.test(originalUrl) ){
				return next();
			}else{
				return res.redirect("/m"+originalUrl);
			}
		}
	}else{
		return next();
	}
};

export default DeviceDetector;