"use strict";

import log4js from "log4js";
import config from 'src/configs/config';
import RoutesService from 'src/server/services/RoutesService';
import GroupService from 'src/server/services/GroupService';
import IdentityService from 'src/server/services/identityService';
import fs from 'fs';
import xmlbuilder from 'xmlbuilder';

const errorLog = log4js.getLogger("error");
const warningLog = log4js.getLogger("warning");
const routesService = RoutesService.getInstance();
const groupService = GroupService.getInstance();
const identityService = IdentityService.getInstance();

export const actionSitemap = (req, res, next) => {
	var stream = fs.createReadStream('sitemap.xml', {
        flags: 'r'
    });
    stream.pipe(res);
}

export const actionSitemapCustom = (req, res, next) => {
	var stream = fs.createReadStream('sitemap_custom.xml', {
        flags: 'r'
    });
    stream.pipe(res);
}

export const actionOpenSearch = (req, res, next) => {
	var protocol = 'https:';
	if (config.env === 'dev') protocol = 'http:';
	var xmlMap = {
		'OpenSearchDescription': {
			'@xmlns': 'http://a9.com/-/spec/opensearch/1.1/',
			'ShortName': '104 職涯社群',
			'Description': '104 職涯社群文章搜尋',
			'Tags': 'Activity',
			'Image': {
				'@height': '16',
				'@width': '16',
				'@type': 'image/vnd.microsoft.icon',
				'#text': 'http://www.104.com.tw/favicon.ico'
			},
			'Contact': 'service@104.com.tw',
			'Url': [
				{
					'@type': 'text/html',
					'@method': 'get',
					'@template': protocol + config.params.wapUrl + '/search/activity/{searchTerms}?utm_source=opensearch',
				},
				{
					'@type': 'application/x-suggestions+json',
					'@template': protocol + config.params.wapUrl + '/ajax/search/activityKeywordSuggest/{searchTerms}',
				}
			],
			'Developer': '104 Corporation Development Team',
			'SyndicationRight': 'open',
			'AdultContent': 'false',
			'Language': 'zh-tw',
			'OutputEncoding': 'UTF-8',
			'InputEncoding': 'UTF-8'
		} 
	};

	var xml = xmlbuilder.create(xmlMap).end({ allowEmpty: true });
	res.set('Content-Type', 'text/xml');
	res.send(xml);
};

export const actionWelcome = (req, res, next) => {
	res.redirect('/');
}

export const actionProfile = (req, res, next) => {
	const paramMap = req.params;
	const name = paramMap.name || paramMap.pid;
	// 如果是/profile/:pid 進來的先驗證他是不是數字，是的話直接next
	if(paramMap.pid && /^\d+$/.test(paramMap.pid)) return next();

	if(/^\d+$/.test(name) && !paramMap.pid){
		// 如果是 /:name 近來的就一樣驗證是不是數字，是的話轉導到 /profile/:pid
		return res.redirect('/profile/'+name);
	}else {
		// 不是數字的話先檢查有沒有 '-' 有的話只取前面的字串
		// 之後統一轉到search person ，如果有特殊字元就轉到404
		const actualName = name.split('-');
		if( actualName[0] && /^[\u0391-\uFFE5A-Za-z0-9]+$/.test(actualName[0]) ) return res.redirect('/search/person/' + (actualName[0]));
		else res.redirect('/error/404');
	}
};

export const actionSearch = (req, res, next) => {
	const paramMap = req.params;
	return next({
		code: 404,
		message: "Route match error : Cannot find route '"+req.originalUrl+"' from routesService",
		stack: {}
	});
};

export const actionGroupId = (req, res, next) => {
	const paramMap = req.params;
	const gid = paramMap.gid;

	if (!/^\d+$/.test(gid)) return res.redirect('/error/404/group');
	next();
};

export const actionChannelId = (req, res, next) => {
	const paramMap = req.params;
	const cid = paramMap.cid;

	if (!/^\d+$/.test(cid)) return res.redirect('/error/404/channel');
	next();
};

export const actionGroup = (req, res, next) => {
	const paramMap = req.params;
	const gid = paramMap.gid;

	if (!/^\d+$/.test(gid)) res.redirect('/error/404');

	groupService.convertGroupId(gid, (result) => {

		if(result.response){
			return res.redirect('/group/' + result.response);
		}else{
			return res.redirect('/group');
		}
	});
}

export const actionContact = (req, res, next) => {
	res.redirect('/message/bc');
}
export const actionMedia= (req, res, next) => {
	res.redirect('/channel');
}

export const actionMediaKeyword = (req, res, next) => {
	const paramMap = req.params;
	const name = paramMap.cid;

	if(/^\d+$/.test(name)){
		return res.redirect('/channel/'+name);
	}
	
	routesService.getChannIdByNameUrl(name, (result) => {
		if(result.response){
			return res.redirect('/channel/' + result.response);
		}else{

			return res.redirect('/error/404');

		}
	});
};
export const actionPrivacy= (req, res, next) => {
	res.redirect('/newsletter');
}
export const actionMyCollect= (req, res, next) => {
	const cookie = req.cookies.CS;
	const params = {CS: cookie};
	const result = {
		pid: -3,
		userName: "",
		isLogin: false,
		loginTime: 0
	};
	
	req.userModel = result;
	if(cookie && /^[0-9a-zA-Z]+$/.test(cookie)){
		identityService.checkUser(params, (userModel) => {

			if(userModel.pid !== null && userModel.status === 'login'){
				result.pid = userModel.pid;
				result.isLogin = true;
				result.loginTime = userModel.loginTime;
			}

			req.userModel = result;
			
			res.redirect('/profile/'+result.pid+'/activity?mode=collect');
		});
	}else{
		next();
	}
}
