import AsyncFetchHelper from 'async-fetch-helper';
import config from 'src/configs/config';

class ProfileEndorseService {

	static getInstance() {
		if(!this.profileEndorseService){
			this.profileEndorseService = new this;
		}

		return this.profileEndorseService;
	}

	constructor() {
		this.asyncFetchHelper = new AsyncFetchHelper({
			apiUrl : config.params.apiUrl.esb
		});
		this.profileEndorseService = null;
	}

	getEndorseList(pid, params, callback) {
		params.pid = pid;
		
		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			return [
				soap('/ProfileEndorseService.0.0', (client) => {
					client.getEndorseList({'targetPid':params.targetPid, 'pid':pid, 'limit':params.limit, 'offset':params.offset, 'avatarLimit':params.avatarLimit});
				})
			];
		}).end(function(results) {
			if(callback){
				callback(results[0]);
			}
		});
	}

	getEndorseUserList(pid, params, callback) {
		params.pid = pid;
		
		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			return [
				soap('/ProfileEndorseService.0.0', (client) => {
					client.getEndorseUserList({'targetPid':params.targetPid, 'pid':pid, 'item':params.item, 'limit':params.limit, 'offset':params.offset});
				})
			];
		}).end(function(results) {
			if(callback){
				callback(results[0]);
			}
		});
	}

	updateEndorseSort(params, callback) {
		//params.pid = pid;
		
		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			return [
				soap('/ProfileEndorseService.0.0', (client) => {
					client.updateEndorseSort(params);
				})
			];
		}).end(function(results) {
			if(callback){
				callback(results[0]);
			}
		});
	}

	updateEndorseDesc(params, callback) {
		//params.pid = pid;
		
		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			return [
				soap('/ProfileEndorseService.0.0', (client) => {
					client.updateEndorseDesc(params);
				})
			];
		}).end(function(results) {
			if(callback){
				callback(results[0]);
			}
		});
	}

	getEndorseTopList(params, callback) {
		//params.pid = pid;
		
		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			return [
				soap('/ProfileEndorseService.0.0', (client) => {
					client.getEndorseTopList(params);
				})
			];
		}).end(function(results) {
			if(callback){
				callback(results[0]);
			}
		});
	}

	getEndorseSortList(pid, params, callback) {
		params.pid = pid;
		
		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			return [
				soap('/ProfileEndorseService.0.0', (client) => {
					client.getEndorseSortList(params);
				})
			];
		}).end(function(results) {
			if(callback){
				callback(results[0]);
			}
		});
	}

	getEndorseListExcludeTop(params, callback) {
		//params.pid = pid;
		
		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			return [
				soap('/ProfileEndorseService.0.0', (client) => {
					client.getEndorseListExcludeTop(params);
				})
			];
		}).end(function(results) {
			if(callback){
				callback(results[0]);
			}
		});
	}

	deleteEndorse(params, callback) {
		//params.pid = pid;
		
		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			return [
				soap('/ProfileEndorseService.0.0', (client) => {
					client.deleteEndorse(params);
				})
			];
		}).end(function(results) {
			if(callback){
				callback(results[0]);
			}
		});
	}

	addEndorseForUser(params, callback) {
		//params.pid = pid;
		
		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			return [
				soap('/ProfileEndorseService.0.0', (client) => {
					client.addEndorseForUser(params);
				})
			];
		}).end(function(results) {
			if(callback){
				callback(results[0]);
			}
		});
	}

	createEndorse(params, callback) {
		//params.pid = pid;
		
		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			return [
				soap('/ProfileEndorseService.0.0', (client) => {
					client.createEndorse(params);
				})
			];
		}).end(function(results) {
			if(callback){
				callback(results[0]);
			}
		});
	}

	removeEndorseForUser(params, callback) {
		//params.pid = pid;
		
		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			return [
				soap('/ProfileEndorseService.0.0', (client) => {
					client.removeEndorseForUser(params);
				})
			];
		}).end(function(results) {
			if(callback){
				callback(results[0]);
			}
		});
	}

};

export default ProfileEndorseService;
