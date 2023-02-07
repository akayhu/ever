import AsyncFetchHelper from 'async-fetch-helper';
import config from 'src/configs/config';

class ProfileNameCardService {

	static getInstance() {
		if(!this.profileNameCardService){
			this.profileNameCardService = new this;
		}

		return this.profileNameCardService;
	}

	constructor() {
		this.asyncFetchHelper = new AsyncFetchHelper({
			apiUrl : config.params.apiUrl.esb
		});
		this.profileNameCardService = null;
	}

	getNameCard(params, callback){
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/ProfileNameCardService.0.0', function (client){
					client.getNameCard(params);
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}
	
	getNameCardList(params, callback){
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/ProfileNameCardService.0.0', function (client){
					client.getNameCardList(params);
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}
}

export default ProfileNameCardService;
