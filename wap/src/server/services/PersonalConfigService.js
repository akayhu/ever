import AsyncFetchHelper from 'async-fetch-helper';
import config from 'src/configs/config';

class PersonalConfigService {

	static getInstance() {
		if(!this.personalConfigService){
			this.personalConfigService = new this;
		}

		return this.personalConfigService;
	}

	constructor() {
		this.asyncFetchHelper = new AsyncFetchHelper({
			apiUrl : config.params.apiUrl.esb
		});
		this.personalConfigService = null;
	}

	syncPersonalConfig(params, callback){
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/PersonalConfigService.0.0', function handlePersonalConfigSoap(client){
					client.syncPersonalConfig(params);
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	queryPersonalConfigByPid(params, callback){
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/PersonalConfigService.0.0', function handlePersonalConfigSoap(client){
					client.queryPersonalConfigByPid(params);
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	queryPersonalConfigByPidAndType(params, callback){
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/PersonalConfigService.0.0', function handlePersonalConfigSoap(client){
					client.queryPersonalConfigByPidAndType(params);
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}
	
	updatePersonalConfig(params, callback){
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/PersonalConfigService.0.0', function handlePersonalConfigSoap(client){
					client.updatePersonalConfig(params);
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}
}

export default PersonalConfigService;
