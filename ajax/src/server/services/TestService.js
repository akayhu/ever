import AsyncFetchHelper from 'async-fetch-helper';
import config from 'src/configs/config';


class TestService {

	static getInstance() {
		if(!this.testService){
			this.testService = new this;
		}

		return this.testService;
	}

	constructor() {
		this.asyncFetchHelper = new AsyncFetchHelper({
			apiUrl : config.params.apiUrl.test_bank
		});
		this.esbAsyncFetchHelper = new AsyncFetchHelper({
			apiUrl : config.params.apiUrl.esb
		});
		this.testService = null;
	}
	
	checkPjAPI(pid, callback) {
		var params = {};
		params.pid=pid;
		params.source="C";
		params.returnAll = true;
		
		this.asyncFetchHelper.need(['rest']).then(function(rest) {
			return [
				rest('get','/pj/checkPjAPI.jsp', params, {})
			];
		}).end(function(results) {
			// 後端那邊isSuccess & status型態三個測評api並沒有統一型態
			// pj 那邊都是為字串 po & pi 都是正常形態
			if(callback){
				try {
					var resultJson = JSON.parse(results[0]);
					callback(resultJson);
				} catch(err) {
					// var resultJson = {};
					// resultJson.isSuccess = "false";
					// resultJson.message = "";
					// resultJson.status = "1";
					callback(err);
				}
			}
		});
	}
	
	answerPjAPI(pid, params, callback) {
		this.asyncFetchHelper.need(['rest']).then(function(rest) {
			params.returnAll = true;
			return [
				rest('get','/pj/answerPjAPI.jsp', params, {})
			];

		}).end(function(results) {
			if(callback){
				try {
					var resultJson = JSON.parse(results[0]);
					callback(resultJson);
				} catch(err) {
					var resultJson = {};
					resultJson.isSuccess = "false";
					resultJson.message = "";
					resultJson.status = "1";
					callback(resultJson);
				}

			}
		});
	}

	reportBrandPjAPI(pid, params, callback) {
		this.asyncFetchHelper.need(['rest']).then(function(rest) {
			params.pid = pid;
			params.returnAll = true;
			return [
				rest('get','/pj/reportBrandPjAPI.jsp', params, {})
			];

		}).end(function(results) {
			if(callback){
				try {
					var resultJson = JSON.parse(results[0]);
					callback(resultJson);
				} catch(err) {
					var resultJson = {};
					resultJson.isSuccess = "false";
					resultJson.message = "";
					resultJson.status = "1";
					callback(resultJson);
				}

			}
		});
	}
	
	checkPoAPI(pid, callback) {
		this.asyncFetchHelper.need(['rest']).then(function(rest) {
			var params = {};
			params.pid=pid;
			params.source="C";
			params.returnAll = true;
			return [
				rest('get','/po/checkPoAPI.jsp', params, {})
			];

		}).end(function(results) {
			if(callback){
				try {
					var resultJson = JSON.parse(results[0]);
					callback(resultJson);
				} catch(err) {
					// 後端那邊isSuccess & status型態三個測評api並沒有統一型態
					// pj 那邊都是為字串 po & pi 都是正常形態
					// var resultJson = {};
					// resultJson.isSuccess = false;
					// resultJson.message = "";
					// resultJson.status = 1;
					callback(err);
				}

			}
		});
	}
	
	answerPoAPI(pid, params, callback) {
		this.asyncFetchHelper.need(['rest']).then(function(rest) {
			params.returnAll = true;
			return [
				rest('get','/po/answerPoAPI.jsp', params, {})
			];

		}).end(function(results) {
			if(callback){
				try {
					var resultJson = JSON.parse(results[0]);
					callback(resultJson);
				} catch(err) {
					var resultJson = {};
					resultJson.isSuccess = "false";
					resultJson.message = "";
					resultJson.status = "1";
					callback(resultJson);
				}

			}
		});
	}

	reportBrandPoAPI(pid, params, callback) {
		this.asyncFetchHelper.need(['rest']).then(function(rest) {
			params.pid = pid;
			params.returnAll = true;
			return [
				rest('get','/po/reportBrandPoAPI.jsp', params, {})
			];

		}).end(function(results) {
			if(callback){
				try {
					var resultJson = JSON.parse(results[0]);
					callback(resultJson);
				} catch(err) {
					var resultJson = {};
					resultJson.isSuccess = "false";
					resultJson.message = "";
					resultJson.status = "1";
					callback(resultJson);
				}

			}
		});
	}
	
	checkPiAPI(pid, callback) {
		this.asyncFetchHelper.need(['rest']).then(function(rest) {
			var params = {};
			params.pid=pid;
			params.source="C";
			params.returnAll = true;
			return [
				rest('get','/pi/checkPiAPI.jsp', params, {})
			];

		}).end(function(results) {
			if(callback){
				try {
					var resultJson = JSON.parse(results[0]);
					callback(resultJson);
				} catch(err) {
					// 後端那邊isSuccess & status型態三個測評api並沒有統一型態
					// pj 那邊都是為字串 po & pi 都是正常形態
					// var resultJson = {};
					// resultJson.isSuccess = false;
					// resultJson.message = "";
					// resultJson.status = 1;
					callback(err);
				}

			}
		});
	}

	answerPiAPI(pid, params, callback) {
		this.asyncFetchHelper.need(['rest']).then(function(rest) {
			params.pid = pid;
			params.returnAll = true;
			return [
				rest('get','/pi/answerPiAPI.jsp', params, {})
			];

		}).end(function(results) {
			if(callback){
				try {
					var resultJson = JSON.parse(results[0]);
					callback(resultJson);
				} catch(err) {
					var resultJson = {};
					resultJson.isSuccess = "false";
					resultJson.message = "";
					resultJson.status = "1";
					callback(resultJson);
				}

			}
		});
	}
	
	reportBrandPiAPI(pid, params, callback) {
		this.asyncFetchHelper.need(['rest']).then(function(rest) {
			params.pid = pid;
			params.returnAll = true;
			return [
				rest('get','/pi/reportBrandPiAPI.jsp', params, {})
			];

		}).end(function(results) {
			if(callback){
				try {
					var resultJson = JSON.parse(results[0]);
					callback(resultJson);
				} catch(err) {
					var resultJson = {};
					resultJson.isSuccess = "false";
					resultJson.message = "";
					resultJson.status = "1";
					callback(resultJson);
				}

			}
		});
	}
	
	getFuture(jobcat, callback) {
		this.esbAsyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/JobWikiService.0.0', (client) => {
					client.getFuture({'productKey': config.params.apnum , 'jobcat': jobcat});
				})
			];
		}).end(function(results){
			let res = results[0];

			if (typeof res.response === 'undefined' || typeof res.response === null) {
				res.response = {};
			}

			if(callback){
				callback(res);
			}
		});
	}
};

export default TestService;
