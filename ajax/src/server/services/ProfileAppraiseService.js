import AsyncFetchHelper from 'async-fetch-helper';
import config from 'src/configs/config';

class ProfileAppraiseService {

	static getInstance() {
		if(!this.appraiseService){
			this.appraiseService = new this;
		}

		return this.appraiseService;
	}

	constructor() {
		this.asyncFetchHelper = new AsyncFetchHelper({
			apiUrl : config.params.apiUrl.esb
		});
		this.appraiseService = null;
	}

	queryAppraiseList(pid, count, targetPid, timeInMillis, limit, sortByPid, callback){
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/AppraiseService.0.0', function handleConnectionSoap(client){
					client.queryAppraiseList({'productKey': config.params.apnum, pid, count, targetPid, timeInMillis, limit, sortByPid});
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}
	queryAppraiseListOfOwner(pid, targetPid, timeInMillis, limit, callback){
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/AppraiseService.0.0', function handleConnectionSoap(client){
					client.queryAppraiseListOfOwner({'productKey': config.params.apnum, targetPid, timeInMillis, limit});
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	addAppraiseText(pid, params, callback){
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/AppraiseService.0.0', function handleConnectionSoap(client){
					client.addAppraiseText({'productKey': config.params.apnum, pid, targetPid: params.targetPid, comment: params.comment });
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	queryAppraiseePendingList(pid, targetPid, timeInMillis, limit, callback){
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/AppraiseService.0.0', function handleConnectionSoap(client){
					client.queryAppraiseePendingList({'productKey': config.params.apnum, targetPid, timeInMillis, limit});
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}
	deleteAppraiseText(pid, targetPid, callback){
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/AppraiseService.0.0', function handleConnectionSoap(client){
					client.deleteAppraiseText({'productKey': config.params.apnum, pid, targetPid});
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}
	publishAppraiseText(pid, targetPid, privacySetting, callback){
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/AppraiseService.0.0', function handleConnectionSoap(client){
					client.publishAppraiseText({'productKey': config.params.apnum, pid, targetPid, privacySetting});
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}
}

export default ProfileAppraiseService;
