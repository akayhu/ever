import AsyncFetchHelper from 'async-fetch-helper';
import config from 'src/configs/config';

class SearchService {

	static getInstance() {
		if(!this.searchService){
			this.searchService = new this;
		}

		return this.searchService;
	}

	constructor() {
		this.asyncFetchHelper = new AsyncFetchHelper({
			apiUrl : config.params.apiUrl.esb
		});
		this.searchService = null;
	}

	searchPersonalDataList(pid, paramMap, callback) {
		var params = paramMap || {};
		params.pid = pid;
		// params.productKey = config.params.apnum;
		// params.condition = JSON.stringify({
		// 	keyword: paramMap.keyword
		// });
		// params.offset = paramMap.offset||0;
		// params.limit = paramMap.limit||10;
		
		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			return [
				soap('/ProfileSearchService.0.0', (client) => {
					client.searchPersonalDataList(params);
				})
			];

		}).end(function(results) {
			if(callback){
				callback(results[0]);
			}
		});
	}

	searchByTag(pid, paramMap,  callback) {
		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			var params = {};
			params.productKey = config.params.apnum;
			params.pid = pid;
			params.tag = paramMap.tag;
			params.limit = paramMap.limit||10;
			params.stickey = paramMap.stickey||"";
			params.oriQuery = paramMap.oriQuery||"";
			return [
				soap('/ActivitySearchService.0.0', (client) => {
					client.searchByTag(params);
				})
			];

		}).end(function(results) {
			if(callback){
				callback(results[0]);
			}
		});
	}

	searchByKeyword(pid, paramMap,  callback) {
		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			var params = {};
			params.productKey = config.params.apnum;
			params.pid = pid;
			params.keyword = paramMap.keyword;
			params.limit = paramMap.limit||10;
			params.stickey = paramMap.stickey||"";
			params.oriQuery = paramMap.oriQuery||"";
			return [
				soap('/ActivitySearchService.0.0', (client) => {
					client.searchByKeyword(params);
				})
			];

		}).end(function(results) {
			if(callback){
				callback(results[0]);
			}
		});
	}

	searchByKeywordAtPublicChannel(pid, paramMap,  callback) {
		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			var params = {};
			params.productKey = config.params.apnum;
			params.pid = pid;
			params.keyword = paramMap.keyword;
			params.channelId = paramMap.channelId;
			params.limit = paramMap.limit||10;
			params.stickey = paramMap.stickey||"";
			params.oriQuery = paramMap.oriQuery||"";
			return [
				soap('/ActivitySearchService.0.0', (client) => {
					client.searchByKeywordAtPublicChannel(params);
				})
			];

		}).end(function(results) {
			if(callback){
				callback(results[0]);
			}
		});
	}

	searchByKeywordAtPrivateChannel(pid, paramMap,  callback) {
		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			var params = {};
			params.productKey = config.params.apnum;
			params.pid = pid;
			params.keyword = paramMap.keyword;
			params.channelId = paramMap.channelId;
			params.limit = paramMap.limit||10;
			params.stickey = paramMap.stickey||"";
			params.oriQuery = paramMap.oriQuery||"";
			return [
				soap('/ActivitySearchService.0.0', (client) => {
					client.searchByKeywordAtPrivateChannel(params);
				})
			];

		}).end(function(results) {
			if(callback){
				callback(results[0]);
			}
		});
	}

	searchByKeywordAtAuthor(pid, paramMap,  callback) {
		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			var params = {};
			params.productKey = config.params.apnum;
			params.pid = pid;
			params.targetPid = paramMap.targetPid;
			params.keyword = paramMap.keyword;
			params.limit = paramMap.limit||10;
			params.stickey = paramMap.stickey||"";
			params.oriQuery = paramMap.oriQuery||"";
			return [
				soap('/ActivitySearchService.0.0', (client) => {
					client.searchByKeywordAtAuthor(params);
				})
			];

		}).end(function(results) {
			if(callback){
				callback(results[0]);
			}
		});
	}
	activityKeywordSuggest(keyword,  callback) {
		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			var params = {};
			params.returnAll = true;
			params.q = JSON.stringify({"keyword":keyword});
			return [
				soap('/SearchPlus.0.0', (client) => {
					client.activityKeywordSuggest(params);
				})
			];
			// 上線後(staging product) 名稱記得改回SearchPlus
		}).end(function(results) {
			// 仿照 asyncFetchHelper 回傳格式
			if(callback){
				if( results[0].Exception ) callback({
					errorCode: 500,
					errorMsg: results[0].Exception.message
				})
				else callback({response: results[0].Result});
			}
		});
	}

	searchMediaByKeyword(pid, paramMap,  callback) {
		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			var params = {};
			params.productKey = config.params.apnum;
			params.pid = pid;
			params.keyword = paramMap.keyword;
			params.limit = paramMap.limit||10;
			params.offset = paramMap.offset||0;
			return [
				soap('/ChannelSearchService.0.0', (client) => {
					client.searchMediaByKeyword(params);
				})
			];

		}).end(function(results) {
			if(callback){
				callback(results[0]);
			}
		});
	}

	searchGroupByKeyword(pid, paramMap,  callback) {
		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			var params = {};
			params.productKey = config.params.apnum;
			params.pid = pid;
			params.keyword = paramMap.keyword;
			params.limit = paramMap.limit||10;
			params.offset = paramMap.offset||0;
			return [
				soap('/ChannelSearchService.0.0', (client) => {
					client.searchGroupByKeyword(params);
				})
			];

		}).end(function(results) {
			if(callback){
				callback(results[0]);
			}
		});
	}
};
export default SearchService;
