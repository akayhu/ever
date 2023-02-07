"use strict";

import AccuseService from 'src/server/services/AccuseService';
import IpUtil from 'src/server/utils/IpUtil';
import config from 'src/configs/config';

const accuseService = AccuseService.getInstance();

function checkAccuseItem(accuseItem){
	let stringConstructor = "".constructor;
  if (accuseItem.constructor === stringConstructor) {
      let tempNewArray = [];
      let tempAccuseArray = accuseItem.split(",");
      
      tempAccuseArray.map(function(item){
      	tempNewArray.push(item);
      });
      return tempNewArray;
  }else{
  	return accuseItem;
  }
}

function ipCheck(ip) {
	ip = ip.replace(/.+\:/,"");
	return ip;
}

export const actionGetAccuseItem = (req, res, next) => {
	const paramMap = req.paramMap;
	
	accuseService.getAccuseItem(paramMap.type, (result) => {
		res.json(result);
	});
};

export const actionAccuseTerribleActivity = (req, res, next) => {
	const paramMap = req.paramMap;
	const headerMap = req.headers;
	const cookieMap = req.cookies;
	const userModel = req.userModel;
	const pid = userModel.pid;
	const ip = headerMap['x-forwarded-for'] || headerMap['x-real-ip'] || IpUtil() || ipCheck(req.connection.remoteAddress);
	const language = headerMap['accept-language'] ? headerMap['accept-language'].replace(/,.+/g, '') : 'zh-TW';
	const browser = headerMap['user-agent'] || 'Uncaught browser';
	const https = headerMap['origin'] && /https\:.+/.test(headerMap['origin']) ? 1 : 0;

	// 支援前端傳入 array 或是 string 格式的檢舉項目
	paramMap['productKey'] = config.params.apnum;
	paramMap['accuseItem'] = checkAccuseItem(paramMap.accuseItem);
	paramMap['pid'] = pid;
	paramMap['ip'] = ip;
	paramMap['language'] = language;
	paramMap['browser'] = browser;
	paramMap['https'] = https;
	paramMap['cookie'] = cookieMap.CS ? 1 : 0;
	// console.log(paramMap)
	accuseService.accuseTerribleActivity(paramMap, (result) => {
		res.json(result);
	});
};

export const actionAccuseTerriblePerson = (req, res, next) => {
	const paramMap = req.paramMap;
	const headerMap = req.headers;
	const cookieMap = req.cookies;
	const userModel = req.userModel;
	const pid = userModel.pid;
	const ip = headerMap['x-forwarded-for'] || headerMap['x-real-ip'] || IpUtil() || ipCheck(req.connection.remoteAddress);
	const language = headerMap['accept-language'] ? headerMap['accept-language'].replace(/,.+/g, '') : 'zh-TW';
	const browser = headerMap['user-agent'] || 'Uncaught browser';
	const https = headerMap['origin'] && /https\:.+/.test(headerMap['origin']) ? 1 : 0;

	// 支援前端傳入 array 或是 string 格式的檢舉項目
	paramMap['productKey'] = config.params.apnum;
	paramMap['accuseItem'] = checkAccuseItem(paramMap.accuseItem);
	paramMap['pid'] = pid;
	paramMap['ip'] = ip;
	paramMap['language'] = language;
	paramMap['browser'] = browser;
	paramMap['https'] = https;
	paramMap['cookie'] = cookieMap.CS ? 1 : 0;
	// console.log(paramMap)
	accuseService.accuseTerriblePerson(paramMap, (result) => {
		res.json(result);
	});
};