import AsyncFetchHelper from 'async-fetch-helper';
import config from 'src/configs/config';
import AESService from './AESService';

class AccountService {

	static getInstance() {
		if(!this.accountService){
			this.accountService = new this;
		}

		return this.accountService;
	}

	constructor() {
		this.asyncFetchHelper = new AsyncFetchHelper({
			apiUrl : config.params.apiUrl.esb
		});
		this.accountService = null;
		this.aesService = new AESService();
	}

	initial(pid, callback){
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/PlatformAccountService.0.0', function handleAccountSoap(client){
					client.initial({pid: pid});
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	upInsertLoginTime(pid, callback) {
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/MembershipService.0.0', (client) => {
					client.upInsertLoginTime({ pid: pid });
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	name(pid, callback){
		this.asyncFetchHelper.need(['rest']).then(function handleAccountRest(rest){
			return [
				rest('get', '/ac/getFullNameByPid/'+pid, {'returnAll':true}, {})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	getEmailInfoByPid(pid, callback) {
		this.asyncFetchHelper.need(['rest']).then(function handleAccountRest(rest){
			return [
				rest('get', '/ac/getEmailInfoByPid/'+pid, {'returnAll':true}, {})
			];
		}).end(function(results){
			if(results[0] && results[0].success === 'true'){
				results[0].data.map((item) => {
					var emailStr = item.email;
					
					this.aesService.decrypt(item.email, (aesServiceRes) => {
						item.email = aesServiceRes.response.decrypted;
					});
				});
			}
			
			if(callback){
				callback(results[0]);
			}else{
				return results[0];
			}
		}.bind(this));
	}
	
	confirmProcess(targetPid, callback) {
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/PlatformAccountService.0.0', function handleAccountSoap(client){
					client.confirmProcess({pid: targetPid});
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	getMembershipInfo(targetPid, callback) {
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/MembershipTimerService.0.0', function handleAccountSoap(client){
					client.queryMembershipInfo({pid: targetPid});
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}
}

export default AccountService;
