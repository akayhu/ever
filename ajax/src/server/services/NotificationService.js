import AsyncFetchHelper from 'async-fetch-helper';
import config from 'src/configs/config';

class NotificationService {

	static getInstance() {
		if(!this.notificationService){
			this.notificationService = new this;
		}

		return this.notificationService;
	}

	constructor() {
		this.asyncFetchHelper = new AsyncFetchHelper({
			apiUrl : config.params.apiUrl.esb
		});

		this.asyncFetchHelperFP = new AsyncFetchHelper();
		this.notificationService = null;
	}

	getNotifictionByPid(pid, jsonData, callback) {
		jsonData.returnAll = true;
		this.asyncFetchHelperFP.need(['rest']).then(function(rest){
			return [
				rest(
					'get',
					`https:${config.params.apim}/notify/1.0/users/${pid}/notifications`,
					jsonData,
					{
						"104-API-Key": (config.env === 'dev') ? "d3431054931f48b090e77e0d4543402c" : process.env['104APIM_KEY'],
					}
				)
			]
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	getUnreadNotiffy(pid, callback) {
		this.asyncFetchHelperFP.need(['rest']).then(function(rest){
			return [
				rest(
					'get',
					`https:${config.params.apim}/notify/1.0/users/${pid}/notifications/unseen/count`,
					{
						returnAll: true
					},
					{
						"104-API-Key": (config.env === 'dev') ? "d3431054931f48b090e77e0d4543402c" : process.env['104APIM_KEY'],
					}
				)
			]
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	/* old api */
	getMixListByAction(pid, type, action, count, dateTime, callback){
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/NotificationService.0.0', function handleNotificationSoap(client){
					client.getMixListByAction({'productKey': config.params.apnum, 'pid': pid, 'type': type, 'action': action, 'count': count, 'dateTime': dateTime});
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	getBubbleCountByAction(pid, action, callback){
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/NotificationService.0.0', function handleNotificationSoap(client){
					client.getBubbleCountByAction({'productKey': config.params.apnum, 'pid': pid, 'action': action});
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}
	getBubbleCount(pid, callback){
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/NotificationService.0.0', function handleNotificationSoap(client){
					client.getBubbleCount({'productKey': config.params.apnum, 'pid': pid, "returnAll": true });
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	setBubbleTimeByType(pid, type, callback){
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/NotificationService.0.0', function handleNotificationSoap(client){
					client.setBubbleTimeByType({'productKey': config.params.apnum, 'pid': pid, 'type': type});
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}
	
	updateAllStatusById(params, callback) {
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/NotificationService.0.0', function handleNotificationSoap(client){
					client.updateAllStatusById(params);
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	updateMixListAllReadByType(pid, type, callback){
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/NotificationService.0.0', function handleNotificationSoap(client){
					client.updateMixListAllReadByType({'productKey': config.params.apnum, 'pid': pid, 'type': type});
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	getMixList(pid, type, count, dateTime, callback) {
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/NotificationService.0.0', function handleNotificationSoap(client){
					client.getMixList({'productKey': config.params.apnum, pid, type, count, dateTime});
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}
	
	send2User(params, callback) {
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/NotificationService.0.0', function handleNotificationSoap(client){
					client.send2User(params);
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}
}

export default NotificationService;
