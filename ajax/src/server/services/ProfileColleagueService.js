import AsyncFetchHelper from 'async-fetch-helper';
import config from 'src/configs/config';

const productKey = config.params.apnum;

class ProfileColleagueService {

	static getInstance() {
		if(!this.profileColleagueService){
			this.profileColleagueService = new this;
		}

		return this.profileColleagueService;
	}

	constructor() {
		this.asyncFetchHelper = new AsyncFetchHelper({
			apiUrl : config.params.apiUrl.esb
		});
		this.profileColleagueService = null;
	}

	queryColleagueList(pid, params, callback){
		const {targetPid, timeInMillis, limit, sortByPid = 1} = params;
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/ColleagueService.0.0', function (client){
					client.queryColleagueList({productKey, pid, targetPid, timeInMillis, limit, sortByPid});
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	colleagueWishStatus(pid, targetPid, callback){
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/ColleagueService.0.0', function (client){
					client.queryColleagueInfo({productKey, pid, targetPid});
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	addColleague(pid, params, callback){
		const { targetPid, isPublic } = params;
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/ColleagueService.0.0', function (client){
					client.addColleageWish({productKey, pid, targetPid, isPublic});
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	removeColleague(pid, targetPid, callback){
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/ColleagueService.0.0', function (client){
					client.deleteColleageWish({productKey, pid, targetPid});
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

}

export default ProfileColleagueService;
