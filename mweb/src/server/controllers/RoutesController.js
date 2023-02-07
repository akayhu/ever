"use strict";

import log4js from "log4js";
import config from 'src/configs/config';
import RoutesService from 'src/server/services/RoutesService';
import GroupService from 'src/server/services/GroupService';

const errorLog = log4js.getLogger("error");
const warningLog = log4js.getLogger("warning");
const routesService = RoutesService.getInstance();
const groupService = GroupService.getInstance();

export const actionProfile = (req, res, next) => {
	const clientRouteCheckList = [
		'p','build','initial', 'privacy', 'newsletter', 'activity', 'notification', 'message', 'topic', 'error', 'mts', 'search', 'profile', 'group', 'channel', 'test', '104beagiver'
	];
	
	const paramMap = req.params;
	const name = paramMap.keyword;
	
	if(clientRouteCheckList.indexOf(name) >= 0 ) {
		return next();	
	}

	if(/^\d+$/.test(name)){
		return res.redirect('/m/profile/'+name);
	}else {
		const actualName = name.split('-');
		
		if( actualName[0] && /^[\u0391-\uFFE5A-Za-z0-9]+$/.test(actualName[0]) ){
			return res.redirect('/m/search/person/' + (actualName[0]));
		}else {
			return res.redirect('/m/error/404/member');
		}
	}
};

export const actionGroup = (req, res, next) => {
	const paramMap = req.params;
	const gid = paramMap.gid;

	groupService.convertGroupId(gid, (result) => {
		if(result.response){
			return res.redirect('/m/group/' + result.response);
		}else{
			return res.redirect('/m/group');
		}
	});
}

export const actionMediaKeyword = (req, res, next) => {
	// console.log("actionMediaKeyword");
	const paramMap = req.params;
	const name = paramMap.cid;

	if(/^\d+$/.test(name)){
		return res.redirect('/m/channel/'+name);
	}
	
	routesService.getChannIdByNameUrl(name, (result) => {
		// console.log(result);
		if(result.response){
			return res.redirect('/m/channel/' + result.response);
		}else{
			return res.redirect('/m/error/404');
		}
	});
};
