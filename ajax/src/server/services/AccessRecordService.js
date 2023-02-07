import AsyncFetchHelper from 'async-fetch-helper';
import config from 'src/configs/config';

const productKey = config.params.apnum;

class AccessRecordService {

	static getInstance() {
		if(!this.accessRecord){
			this.accessRecord = new this;
		}

		return this.accessRecord;
	}

	constructor() {
		this.asyncFetchHelper = new AsyncFetchHelper({
			apiUrl : config.params.apiUrl.esb
		});
		this.accessRecord = null;
	}

	viewActivity(params, callback) {
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/AccessRecordService.0.0', function handleAccessRecordSoap(client){
					client.viewActivity(params);
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	queryActivityTotalPvByAuthor(params, callback) {
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/AccessRecordService.0.0', function handleAccessRecordSoap(client){
					client.queryActivityTotalPvByAuthor(params);
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	queryViewer(pid, params, callback) {
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/AccessRecordService.0.0', function handleAccessRecordSoap(client){
					client.queryViewer({ productKey: productKey, targetPid: pid }, (res) => {
						if (!res.response || res.response.warning || res.response.error || res.response.viewerInfo.length === 0) return [];
						return [
							soap('/ProfileNameCardService.0.0', (client) => {
								client.getNameCardList({
									'pid': pid,
									'targetPids': res.response.viewer
								});
							})
						]
					});
				})
			];
		}).end(function(results){
			let final = results[0];
			let nameCardInfo = final.childResult ? final.childResult[0] : null;

			if (nameCardInfo && nameCardInfo.response) {
				final.response.viewerInfo = Object.keys(nameCardInfo.response).map(pid => nameCardInfo.response[pid])
			}

			delete final.childResult;

			if(callback){
				callback(final);
			}
		});
	}

	queryViewerFromPro(pid, params, callback){
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/AccessRecordService.0.0', function handleAccessRecordSoap(client){
					client.queryViewerFromPro({ productKey, targetPids: pid });
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	queryViewerCount(params, callback){
		delete params.pid;
		const forComp = {
			targetPids: params.targetPid,
			productKey,
		}
		const forUser = {
			productKey,
			targetPid: params.targetPid
		}
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/AccessRecordService.0.0', function handleAccessRecordSoap(client){
					client.queryViewer(forUser);
				}),
				soap('/AccessRecordService.0.0', function handleAccessRecordSoap(client){
					client.queryViewerFromPro(forComp);
				})
			];
		}).end(function(results){
			const userViewCount = results[0].response ? results[0].response.viewerInfo.length : 0;
			const compViewCount = results[1].response ? results[1].response[0].comViewerInfo.length : 0;
			if(callback){
				callback({response: {
					userViewCount,
					compViewCount
				}});
				// callback(results);
			}
		});
	}

	viewProfile(params, callback) {
		params.productKey = config.params.apnum;
		
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/AccessRecordService.0.0', function handleAccessRecordSoap(client){
					client.viewProfile(params);
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	queryActivityTotalPv(params, callback) {
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/AccessRecordService.0.0', function handleAccessRecordSoap(client){
					client.queryActivityTotalPv(params);
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	viewProfileFromPro(params, callback) {
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/AccessRecordService.0.0', function handleAccessRecordSoap(client){
					client.viewProfileFromPro(params);
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	queryViewCountFromPro(params, callback) {
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/AccessRecordService.0.0', function handleAccessRecordSoap(client){
					client.queryViewCountFromPro(params);
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}
}

export default AccessRecordService;
