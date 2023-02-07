import AsyncFetchHelper from 'async-fetch-helper';
import config from 'src/configs/config';

class AccuseService {

	static getInstance() {
		if(!this.accuseService){
			this.accuseService = new this;
		}

		return this.accuseService;
	}

	constructor() {
		this.asyncFetchHelper = new AsyncFetchHelper({
			apiUrl : config.params.apiUrl.esb
		});
		this.accuseService = null;
	}

	getAccuseItem(type, callback){
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/AccuseService.0.0', function handleConnectionSoap(client){
					client.getAccuseItem({'productKey': config.params.apnum, 'type': type});
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	accuseTerribleActivity(params, callback){
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/AccuseService.0.0', function handleConnectionSoap(client){
					client.accuseTerribleActivity(
						{
							productKey: config.params.apnum,
							pid: params.pid,
							targetPid: params.targetPid,
							aid: params.aid,
							commentId: params.commentId,
							accuseItem: params.accuseItem,
							otherComment: params.otherComment,
							description: params.description,
							ip: params.ip,
							language: params.language,
							browser: params.browser,
							https: params.https,
							cookie: params.cookie
						}
					);
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	accuseTerriblePerson(params, callback){
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/AccuseService.0.0', function handleConnectionSoap(client){
					client.accuseTerriblePerson(
						{
							productKey: config.params.apnum,
							pid: params.pid,
							targetPid: params.targetPid,
							accuseItem: params.accuseItem,
							otherComment: params.otherComment,
							description: params.description,
							ip: params.ip,
							language: params.language,
							browser: params.browser,
							https: params.https,
							cookie: params.cookie
						}
					);
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}
}

export default AccuseService;
