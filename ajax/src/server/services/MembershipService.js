import AsyncFetchHelper from 'async-fetch-helper';
import config from 'src/configs/config';

class MembershipService {

	static getInstance() {
		if(!this.membershipService){
			this.membershipService = new this;
		}

		return this.membershipService;
	}

	constructor() {
		this.asyncFetchHelper = new AsyncFetchHelper({
			apiUrl : config.params.apiUrl.esb
		});
		this.membershipService = null;
	}

	setMemberIdentity(params, callback){
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/MembershipService.0.0', (client) => {
					client.setMemberIdentity(params);
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}
	
	getMemberIdentityList(params, callback){
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/MembershipService.0.0', (client) => {
					client.getMemberIdentityList({pidList: params.pidList});
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}
	
	isAllowReadProfile(params, callback){
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/MembershipService.0.0', (client) => {
					client.isAllowReadProfile(params);
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	isWatchProfile(params, callback){
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/MembershipService.0.0', (client) => {
					client.isWatchProfile(params);
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}	
}

export default MembershipService;
