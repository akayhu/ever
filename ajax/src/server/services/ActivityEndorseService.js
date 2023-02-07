import AsyncFetchHelper from 'async-fetch-helper';
import config from 'src/configs/config';

class ActivityEndorseService{

	static getInstance() {
		if(!this.activityService){
			this.activityService = new this;
		}

		return this.activityService;
	}

	constructor() {
		this.asyncFetchHelper = new AsyncFetchHelper({
			apiUrl : config.params.apiUrl.esb
		});
		this.activityService = null;
	}

	delEndorseItems(pid, params, callback) {
		params.pid = pid;
		params.productKey = config.params.apnum;

		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			return [
				soap('/ActivityEndorseService.0.0', (client) => {
					client.delEndorseItems(params);
				})
			];
		}).end(function(results) {
			if(callback){
				callback(results[0]);
			}
		});
	}

	delEndorser(pid, params, callback) {
		params.pid = pid;
		params.productKey = config.params.apnum;

		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			return [
				soap('/ActivityEndorseService.0.0', (client) => {
					client.delEndorser(params);
				})
			];
		}).end(function(results) {
			if(callback){
				callback(results[0]);
			}
		});
	}

	suggestEndorseByContent(pid, params, callback) {
		const { content, limit } = params;
		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			return [
				soap('/ActivityEndorseService.0.0', (client) => {
					client.suggestEndorseByContent({ productKey: config.params.apnum, authorPid: pid, content, limit });
				})
			];
		}).end(function(results) {
			if(callback){
				callback(results[0]);
			}
		});
	}

	getAllEndorse(pid, params, callback) {
		params.pid = pid;

		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			return [
				soap('/ActivityEndorseService.0.0', (client) => {
					client.getAllEndorse(params);
				})
			];
		}).end(function(results) {
			if(callback){
				callback(results[0]);
			}
		});
	}

	addEndorse(pid, params, callback) {
		params.pid = pid;
		params.productKey = config.params.apnum;

		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			return [
				soap('/ActivityEndorseService.0.0', (client) => {
					client.addEndorse(params);
				})
			];
		}).end(function(results) {
			if(callback){
				callback(results[0]);
			}
		});
	}

	addEndorseList(pid, params, callback) {
		params.pid = pid;

		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			return [
				soap('/ActivityEndorseService.0.0', (client) => {
					client.addEndorseList(params);
				})
			];
		}).end(function(results) {
			if(callback){
				callback(results[0]);
			}
		});
	}
};

export default ActivityEndorseService;
