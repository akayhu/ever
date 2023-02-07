"use strict";

import SearchService from 'src/server/services/SearchService';

const searchService = SearchService.getInstance();

export const actionSearchPerson = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	searchService.searchPersonalDataList(pid, paramMap, (result) => {
		res.json(result);
	});
};

export const actionSearchByTag = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;
	
	searchService.searchByTag(pid, paramMap, (result) => {
		res.json(result);
	});
};

export const actionSearchByKeyword = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;
	
	searchService.searchByKeyword(pid, paramMap, (result) => {
		res.json(result);
	});
};

export const actionSearchByKeywordAtPublicChannel = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;
	
	searchService.searchByKeywordAtPublicChannel(pid, paramMap, (result) => {
		res.json(result);
	});
};

export const actionSearchByKeywordAtPrivateChannel = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;
	
	searchService.searchByKeywordAtPrivateChannel(pid, paramMap, (result) => {
		res.json(result);
	});
};

export const actionSearchByKeywordAtAuthor = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;
	
	searchService.searchByKeywordAtAuthor(pid, paramMap, (result) => {
		res.json(result);
	});
};

export const actionActivityKeywordSuggest = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;
	
	searchService.activityKeywordSuggest(paramMap.keyword, (result) => {
		res.json(result);
	});
};

export const actionSearchGroupByKeyword = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;
	
	searchService.searchGroupByKeyword(pid, paramMap, (result) => {
		res.json(result);
	});
};

export const actionSearchMediaByKeyword = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;
	
	searchService.searchMediaByKeyword(pid, paramMap, (result) => {
		res.json(result);
	});
};

export const actionSearchPersonalDataList = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	paramMap.pid = userModel.pid;
	
	searchService.searchPersonalDataList(paramMap, (result) => {
		res.json(result);
	});
};