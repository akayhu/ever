import AsyncFetchHelper from 'async-fetch-helper';
import config from 'src/configs/config';

class ProfilePersonalService {

	static getInstance() {
		if(!this.profilePersonalService){
			this.profilePersonalService = new this;
		}

		return this.profilePersonalService;
	}

	constructor() {
		this.asyncFetchHelper = new AsyncFetchHelper({
			apiUrl : config.params.apiUrl.esb
		});
		this.profilePersonalService = null;
	}

	updateUserIntroduction(params, callback) {
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/ProfilePersonalService.0.0', function handleAccountSoap(client){
					client.updateUserIntroduction(params);
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	deleteCover(params, callback) {
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/ProfilePersonalService.0.0', function handleAccountSoap(client){
					client.deleteCover(params);
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	getUserInfo(params, callback) {
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/ProfilePersonalService.0.0', function handleAccountSoap(client){
					client.getUserInfo(params);
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	initialUser(params, callback) {
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/ProfilePersonalService.0.0', function handleAccountSoap(client){
					client.initialUser(params);
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	updateUserNameDisplay(pid, params, callback) {
		const { userName } = params;
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/ProfilePersonalService.0.0', function handleAccountSoap(client){
					client.updateUserNameDisplay({ pid, userName });
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	updateCover(params, callback) {
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/ProfilePersonalService.0.0', function handleAccountSoap(client){
					client.updateCover(params);
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	deleteAvatar(params, callback) {
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/ProfilePersonalService.0.0', function handleAccountSoap(client){
					client.deleteAvatar(params);
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}
}

export default ProfilePersonalService;
