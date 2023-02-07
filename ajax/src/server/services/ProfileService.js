import AsyncFetchHelper from 'async-fetch-helper';
import config from 'src/configs/config';

class ProfileService {

	static getInstance() {
		if(!this.profileService){
			this.profileService = new this;
		}

		return this.profileService;
	}

	constructor() {
		this.asyncFetchHelper = new AsyncFetchHelper({
			apiUrl : config.params.apiUrl.esb
		});
		this.profileService = null;
	}

	getLoginUser(pid, targetPid, callback) {
		//TODO remove
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/ProfileNameCardService.0.0', (client) => {
					client.getNameCard({'pid': pid , 'targetPid': targetPid});
				})
			];
		}).end(function(results){
			//TODO remove
			let res = results[0];

			if (typeof res.response === 'undefined' || typeof res.response === null) {
				res.response = {};
			}

			if(callback){
				callback(res);
			}
		});
	}

	getProfile(pid, targetPid, callback) {
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/ProfilePersonalService.0.0', (client) => {
					client.getUserInfo({'pid': pid , 'targetPid': targetPid});
				}),
				soap('/ProfileEndorseService.0.0', (client) => {
					client.getEndorseList({'targetPid': targetPid , 'pid': pid, 'limit': 10, 'offset': 0});
				}),
				soap('/ProfileChronologyService.0.0', (client) => {
					client.getExpEventList({'pid': pid , 'targetPid': targetPid});
				}),
				soap('/ProfileChronologyService.0.0', (client) => {
					client.getEduEventList({'pid': pid , 'targetPid': targetPid});
				}),
				soap('/ProfileChronologyService.0.0', (client) => {
					client.getHonorEventList({'pid': pid , 'targetPid': targetPid});
				}),
				soap('/AccessRecordService.0.0', (client) => {
					client.queryViewer({'productKey': config.params.apnum , 'targetPid': targetPid});
				})
			];
		}).end(function(results){
			let res = results[0];
			if (typeof res.response === 'undefined' || res.response === null) {
				// res.response = false;
			} else {
				res.response.endorseCount = results[1].response ? results[1].response.total : 0;
				res.response.expCount = results[2].response ? results[2].response.length : 0;
				res.response.eduCount = results[3].response ? results[3].response.length : 0;
				res.response.honorCount = results[4].response? results[4].response.length : 0;
				res.response.viewerCount = results[5].response? results[5].response.totalPv: 0;
			}
			if(callback){
				callback(res);
			}
		});
	}

	getWrapProfileInfo(pid, targetPid, callback) {
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			let services = [];
			let json = '[';
			json += '{"service":"ProfilePersonalService", "method":"getUserInfo", "param":{"targetPid":' + targetPid + '}},';
			json += '{"service":"ProfileEndorseService", "method":"getEndorseList", "param":{"targetPid":' + targetPid + ', "limit":10, "offset":0}},';
			json += '{"service":"ProfileChronologyService", "method":"getExpEventList", "param":{"targetPid":' + targetPid + '}},';
			json += '{"service":"ProfileChronologyService", "method":"getEduEventList", "param":{"targetPid":' + targetPid + '}},';
			json += '{"service":"ProfileChronologyService", "method":"getHonorEventList", "param":{"targetPid":' + targetPid + '}},';
			json += '{"service":"AccessRecordService", "method":"queryViewer", "param":{"targetPid":' + targetPid + '}},';
			json += '{"service":"ConnectionService", "method":"getConnectionStatus", "param":{"targetPid":' + targetPid + '}}';

			if(pid !== -3 && pid !== targetPid){
				// console.log("viewer");
				json += ',{"service":"AccessRecordService", "method":"viewProfile", "param":{"targetPid":' + targetPid + '}}';
			}

			json += ']';

			let jsonArray = JSON.parse(json);
			let count = jsonArray.length;

			jsonArray.map(function(item){
				services.push(
					soap('/' + item.service + '.0.0', (client) => {
						if(item.service !== 'ConnectionService')item.param["productKey"] = config.params.apnum; // ConnectionService 多此key 會噴錯
						item.param["pid"] = pid;
						if (typeof client[item.method] !== 'undefined') {
							client[item.method](item.param);
						}
					})
				);
			});

			return services;
		}).end(function(results){
			let res = results[0];
			if (typeof res.response === 'undefined' || res.response === null) {
				 res.response = {};
			} else {
				res.response.introductionBlock = results[0].response.exposureStatus ? results[0].response.exposureStatus.introduction: 0;
				res.response.educationBlock = results[0].response.exposureStatus ? results[0].response.exposureStatus.education: 0;
				res.response.experienceBlock = results[0].response.exposureStatus ? results[0].response.exposureStatus.experience: 0;
				res.response.endorseBlock = results[0].response.exposureStatus ? results[0].response.exposureStatus.endorse: 0;
				res.response.endorseCount = results[1].response ? results[1].response.total : 0;
				res.response.expCount = results[2].response ? results[2].response.length : 0;
				res.response.eduCount = results[3].response ? results[3].response.length : 0;
				res.response.honorCount = results[4].response ? results[4].response.length : 0;
				res.response.viewerCount = results[5].response ? results[5].response.totalPv: 0;
				res.response.connectionStatus = results[6].response ? results[6].response[targetPid].connectionStatus: 0;
				res.response.subscribeStatus = results[6].response ? results[6].response[targetPid].subscribeStatus: false;
				res.response.notificationStatus = results[6].response ? results[6].response[targetPid].notificationStatus: false;
			}
			if(callback){
				callback(res);
			}
		});
	}

	updateAvatar(pid, params, callback) {
		params.pid = pid;
		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			return [
				soap('/ProfilePersonalService.0.0', (client) => {
					client.updateAvatar(params);
				})
			];

		}).end(function(results) {
			if(callback){
				callback(results[0].response);
			}
		});
	}

	adjustAvatar(pid, params, callback) {
		params.pid = pid;
		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			return [
				soap('/ProfilePersonalService.0.0', (client) => {
					client.adjustAvatar(params);
				})
			];

		}).end(function(results) {
			if(callback){
				callback(results[0].response);
			}
		});
	}

	deleteAvatar(pid, params, callback) {
		params.pid = pid;
		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			return [
				soap('/ProfilePersonalService.0.0', (client) => {
					client.deleteAvatar(params);
				})
			];
		}).end(function(results) {
			if(callback){
				callback(results[0].response);
			}
		});
	}

	updateCover(pid, params, callback) {
		params.pid = pid;
		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			return [
				soap('/ProfilePersonalService.0.0', (client) => {
					client.updateCover(params);
				})
			];

		}).end(function(results) {
			//console.log(params);
			//console.log(results);
			if(callback){
				callback(results[0].response);
			}
		});
	}

	adjustCover(pid, params, callback) {
		params.pid = pid;
		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			return [
				soap('/ProfilePersonalService.0.0', (client) => {
					client.adjustCover(params);
				})
			];

		}).end(function(results) {
			if(callback){
				callback(results[0].response);
			}
		});
	}

	deleteCover(pid, params, callback) {
		params.pid = pid;
		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			return [
				soap('/ProfilePersonalService.0.0', (client) => {
					client.deleteCover(params);
				})
			];
		}).end(function(results) {
			if(callback){
				callback(results[0].response);
			}
		});
	}

	routes(keyword,  callback) {
		this.asyncFetchHelper.need(['rest']).then(function(rest) {
			var params = {};
			params.returnAll = true;
			return [
				rest('get','/profile/pid/'+encodeURIComponent(keyword), params, (client) => {})
			];

		}).end(function(results) {
			if(callback){
				callback(results);
			}
		});
	}
};

export default ProfileService;
