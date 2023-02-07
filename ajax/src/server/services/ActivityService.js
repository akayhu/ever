import AsyncFetchHelper from 'async-fetch-helper';
import config from 'src/configs/config';

class ActivityService{

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

	getActivity(pid, params, callback) {
		params.pid = pid;
		params.productKey = config.params.apnum;

		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			return [
				soap('/ActivityService.0.0', (client) => {
					client.getActivity(params);
				})
			];
		}).end(function(results) {
			if(callback){
				callback(results[0]);
			}
		});
	}

	getActivityCountByPids(params, callback) {
		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			return [
				soap('/ActivityService.0.0', (client) => {
					client.getActivityCountByPids({ productKey: config.params.apnum, pids: params.pids });
				})
			];
		}).end(function(results) {
			if(callback){
				callback(results[0]);
			}
		});
	}

	getPersonalWall(pid, params, callback) {
		const { targetPid, ts, limit } = params;
		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			let requestArray = [
				soap('/ActivityService.0.0', (client) => {
					client.getPersonalWall({ productKey:config.params.apnum, pid, targetPid, ts, limit });
				})
			];
			if (ts == 0) {
				requestArray.push(
					soap('/ActivityService.0.0', (client) => {
						client.getActivityCountByPids({ productKey:config.params.apnum, pids: targetPid });
					})
				);
			}
			return requestArray;
		}).end(function(results) {
			if(callback){
				callback({
					response: {
						activityList: (results[0] && results[0].response) ? results[0].response.activityList : [],
						ts: (results[0] && results[0].response) ? results[0].response.ts : params.ts,
						totalCount: (results[1] && results[1].response) ? results[1].response[targetPid] : 0
					}
				});
			}
		});
	}

	getPersonalRiver(pid, params, callback) {
		const config = JSON.parse(params.getStreamConfig);
		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			return [
				soap('/ActivityService.0.0', (client) => {
					client.getPersonalRiverHot(config.HOT);
				}),
				soap('/ActivityService.0.0', (client) => {
					client.getPersonalRiverNew(config.NEW);
				}),
				soap('/ActivityService.0.0', (client) => {
					client.getPersonalRiverAll(config.ALL);
				})
			];
		}).end(function(results) {
			if(callback){
				const callbackResult = {
					HOT: results[0],
					NEW: results[1],
					ALL: results[2]
				}
				callback(callbackResult);
			}
		});
	}

	getPersonalRiverHot(pid, params, callback) {
		params.productKey = config.params.apnum;
		params.pid = pid;

		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			return [
				soap('/ActivityService.0.0', (client) => {
					client.getPersonalRiverHot(params);
				})
			];
		}).end(function(results) {
			if(callback){
				callback(results[0]);
			}
		});
	}

	getPersonalRiverNew(pid, params, callback) {
		params.productKey = config.params.apnum;
		params.pid = pid;

		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			return [
				soap('/ActivityService.0.0', (client) => {
					client.getPersonalRiverNew(params);
				})
			];
		}).end(function(results) {
			if(callback){
				callback(results[0]);
			}
		});
	}

	getPersonalRiverAll(pid, params, callback) {
		params.productKey = config.params.apnum;
		params.pid = pid;

		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			return [
				soap('/ActivityService.0.0', (client) => {
					client.getPersonalRiverAll(params);
				})
			];
		}).end(function(results) {
			if(callback){
				callback(results[0]);
			}
		});
	}

	getRelatedActivity(pid, params, callback) {
		params.pid = pid;
		params.productKey = config.params.apnum;

		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			return [
				soap('/ActivityService.0.0', (client) => {
					client.getRelatedActivity(params);
				})
			];
		}).end(function(results) {
			if(callback){
				callback(results[0]);
			}
		});
	}

	getCommentList(pid, params, callback) {
		params.pid = pid;
		params.productKey = config.params.apnum;

		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			return [
				soap('/ActivityService.0.0', (client) => {
					client.getCommentList(params);
				})
			];
		}).end(function(results) {
			if(callback){
				callback(results[0]);
			}
		});
	}


	getCollectList(pid, params, callback) {
		const { targetPid, ts, limit, activityTag } = params;
		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			let requestArray = [
				soap('/MyCollectionService.0.0', (client) => {
					client.getMyCollect({productKey: config.params.apnum, pid, targetPid, ts, limit, activityTag });
				})
			];
			if (ts == 0) {
				requestArray.push(
					soap('/MyCollectionService.0.0', (client) => {
						client.getMyCollectCount({ productKey: config.params.apnum, pid, targetPid });
					})
				)
			}
			return requestArray;
		}).end(function(results) {
			if(callback){
				callback({
					response: {
						activityList: (results[0] && results[0].response) ? results[0].response.activityList : [],
						ts: (results[0] && results[0].response) ? results[0].response.ts : params.ts,
						totalCount: (results[1] && results[1].response) ? results[1].response : 0
					}
				});
			}
		});
	}

	getMyCollectCount(pid, params, callback) {
		// params.pid = pid;
		// params.productKey = config.params.apnum;
		const { targetPid } = params;
		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			return [
				soap('/MyCollectionService.0.0', (client) => {
					client.getMyCollectCount({ productKey: config.params.apnum, pid, targetPid });
				})
			];
		}).end(function(results) {
			if(callback){
				callback(results[0]);
			}
		});
	}

	getActivityListByChannel(pid, params, callback) {
		params.pid = pid;

		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			return [
				soap('/ActivityService.0.0', (client) => {
					client.getActivityListByChannel(params);
				})
			];
		}).end(function(results) {
			if(callback){
				callback(results[0]);
			}
		});
	}

	///// Create /////

	createActivity(pid, params, callback) {
		params.pid = pid;
		params.productKey = config.params.apnum;

		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			return [
				soap('/ActivityService.0.0', (client) => {
					client.createActivity(params);
				})
			];
		}).end(function(results) {
			if(callback){
				callback(results[0]);
			}
		});
	}

	createComment(pid, params, callback) {
		params.pid = pid;
		params.productKey = config.params.apnum;

		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			return [
				soap('/ActivityService.0.0', (client) => {
					client.createComment(params);
				})
			];
		}).end(function(results) {
			if(callback){
				callback(results[0]);
			}
		});
	}

	///// Delete /////

	deleteActivity(pid, params, callback) {
		params.pid = pid;
		params.productKey = config.params.apnum;

		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			return [
				soap('/ActivityService.0.0', (client) => {
					client.delete(params);
				})
			];
		}).end(function(results) {
			if(callback){
				callback(results[0]);
			}
		});
	}

	///// Update /////

	updateActivity(pid, params, callback) {
		params.pid = pid;
		params.productKey = config.params.apnum;

		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			return [
				soap('/ActivityService.0.0', (client) => {
					client.update(params);
				})
			];
		}).end(function(results) {
			if(callback){
				callback(results[0]);
			}
		});
	}

};

export default ActivityService;
