import AsyncFetchHelper from 'async-fetch-helper';
import config from 'src/configs/config';

class PrivacyService {

	static getInstance() {
		if(!this.privacyService){
			this.privacyService = new this;
		}

		return this.privacyService;
	}

	constructor() {
		this.asyncFetchHelper = new AsyncFetchHelper({
			apiUrl : config.params.apiUrl.esb
		});
		this.privacyService = null;
	}

	queryPrivacyByPids(params, callback) {
		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			return [
				soap('/AccountPrivacyService.0.0', (client) => {
					client.queryPrivacyByPids(params);
				})
			];

		}).end(function(results) {
			if(callback){
				callback(results[0]);
			}
		});
	}

	queryPrivacyInfo(paramMap, callback) {
		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			return [
				soap('/AccountPrivacyService.0.0', (client) => {
					client.queryPrivacyInfo({ 'pid': paramMap.pid });
				})
			];

		}).end(function(results) {
			
			if(callback){
				callback(results[0]);
			}
		});
	}

	querySinglePrivacy(params, callback) {
		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			return [
				soap('/AccountPrivacyService.0.0', (client) => {
					client.querySinglePrivacy(params);
				})
			];

		}).end(function(results) {
			if(callback){
				callback(results[0]);
			}
		});
	}

	updatePrivacy(params, callback) {
		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			return [
				soap('/AccountPrivacyService.0.0', (client) => {
					client.updatePrivacy(params);
				})
			];

		}).end(function(results) {
			if(callback){
				callback(results[0]);
			}
		});
	}

	updateSinglePrivacy(params, callback) {
		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			return [
				soap('/AccountPrivacyService.0.0', (client) => {
					client.updateSinglePrivacy(params);
				})
			];
		}).end(function(results) {
			if(callback){
				callback(results[0]);
			}
		});
	}
};

export default PrivacyService;
