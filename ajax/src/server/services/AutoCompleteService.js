import AsyncFetchHelper from 'async-fetch-helper';
import config from 'src/configs/config';

class AutoCompleteService {

	static getInstance() {
		if(!this.autoCompleteService){
			this.autoCompleteService = new this;
		}

		return this.autoCompleteService;
	}

	constructor() {
		this.asyncFetchHelper = new AsyncFetchHelper({
			apiUrl : config.params.apiUrl.esb
		});
		this.autoCompleteService = null;
	}

	getDescript(params, callback) {
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/WSFunction01Tree.0.0', function handleConnectionSoap(client){
					client.getDescript(params);
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	getAutoCompleteCompany(params, callback) {
		this.asyncFetchHelper.need(['rest']).then(function(rest){
			return [
				rest(
					'post',
					config.params.apiUrl.esb+'/search/CompanyAcSearch.json',
					'Q={"keyword":"'+params.keyword+'","requestLength":10,"recFrom": 0,"executeFrom": "ac test"}',
					{'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'},
					'Result'
				)
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	getAutoCompleteJobtitle(params, callback) {
		this.asyncFetchHelper.need(['rest']).then(function(rest){
			return [
				rest(
					'post',
					config.params.apiUrl.esb+'/search/JobTitleAcSearch.json',
					'Q={"keyword":"'+params.keyword+'","requestLength":10,"recFrom": 0,"executeFrom": "ac test", "isSegWord": true}',
					{'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'},
					'Result'
				)
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	getAutoCompleteAbility(params, callback) {
		this.asyncFetchHelper.need(['rest']).then(function(rest){
			return [
				rest(
					'post',
					config.params.apiUrl.esb+'/search/AbilityAcSearch.json',
					'Q={"keyword":"'+params.keyword+'","requestLength":10,"recFrom": 0,"executeFrom": "ac test"}',
					{'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'},
					'Result'
				)
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	getAutoCompleteSchool(params, callback) {
		this.asyncFetchHelper.need(['rest']).then(function(rest){
			return [
				rest(
					'post',
					config.params.apiUrl.esb+'/search/SchoolAcSearch.json',
					'Q={"keyword":"'+params.keyword+'","requestLength":10,"recFrom": 0,"executeFrom": "ac test"}',
					{'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'},
					'Result'
				)
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	getAutoCompleteMajor(params, callback) {
		this.asyncFetchHelper.need(['rest']).then(function(rest){
			return [
				rest(
					'post',
					config.params.apiUrl.esb+'/search/MajorAcSearch.json',
					'Q={"keyword":"'+params.keyword+'","requestLength":10,"recFrom": 0,"executeFrom": "ac test"}',
					{'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'},
					'Result'
				)
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	getAutoCompleteArea(params, callback) {
		this.asyncFetchHelper.need(['rest']).then(function(rest){
			return [
				rest(
					'get',
					'http:'+config.params.e104Url+'/jb/104i/suggest/area',
					{"type":"1", "kw":decodeURIComponent(params.keyword),"source":"104plus", "returnAll": true},
					'Result'
				)
			];
		}).end(function(results){
			if(callback) callback(results[0]);
		});
	}
};

export default AutoCompleteService;
