import AsyncFetchHelper from 'async-fetch-helper';
import config from 'src/configs/config';

class ProfileChronicleService {
	
	static getInstance() {
		if(!this.profileChronicleService){
			this.profileChronicleService = new this;
		}
		
		return this.profileChronicleService;
	}
	
	constructor() {
		this.asyncFetchHelper = new AsyncFetchHelper({
			apiUrl : config.params.apiUrl.esb
		});
		this.profileChronicleService = null;
	}
	
	getEduExpMixedList(params, callback) {
		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			return [
				soap('/ProfileChronologyService.0.0', (client) => {
					client.getEduExpMixedList(params);
				})
			];
		}).end(function(results) {
			if(callback){
				callback(results[0]);
			}
		});
	}
	
	getFullEventForAnalysis(params, callback) {
		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			return [
				soap('/ProfileChronologyService.0.0', (client) => {
					client.getFullEventForAnalysis(params);
				})
			];
		}).end(function(results) {
			if(callback){
				callback(results[0]);
			}
		});
	}
	
	getRecentEventList(params, callback) {
		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			return [
				soap('/ProfileChronologyService.0.0', (client) => {
					client.getRecentEventList(params);
				})
			];
		}).end(function(results) {
			if(callback){
				callback(results[0]);
			}
		});
	}
	
	createExpEvent(params, callback) {
		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			return [
				soap('/ProfileChronologyService.0.0', (client) => {
					client.createExpEvent(params);
				})
			];
		}).end(function(results) {
			if(callback){
				callback(results[0]);
			}
		});
	}
	
	createEduEvent(params, callback) {
		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			return [
				soap('/ProfileChronologyService.0.0', (client) => {
					client.createEduEvent(params);
				})
			];
		}).end(function(results) {
			if(callback){
				callback(results[0]);
			}
		});
	}
	
	createHonorEvent(params, callback) {
		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			return [
				soap('/ProfileChronologyService.0.0', (client) => {
					client.createHonorEvent(params);
				})
			];
		}).end(function(results) {
			if(callback){
				callback(results[0]);
			}
		});
	}
	
	deleteExpEvent(params, callback) {
		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			return [
				soap('/ProfileChronologyService.0.0', (client) => {
					client.deleteExpEvent(params);
				})
			];
		}).end(function(results) {
			if(callback){
				callback(results[0]);
			}
		});
	}
	
	deleteEduEvent(params, callback) {
		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			return [
				soap('/ProfileChronologyService.0.0', (client) => {
					client.deleteEduEvent(params);
				})
			];
		}).end(function(results) {
			if(callback){
				callback(results[0]);
			}
		});
	}
	
	deleteHonorEvent(params, callback) {
		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			return [
				soap('/ProfileChronologyService.0.0', (client) => {
					client.deleteHonorEvent(params);
				})
			];
		}).end(function(results) {
			if(callback){
				callback(results[0]);
			}
		});
	}
	
	deleteEventByPid(params, callback) {
		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			return [
				soap('/ProfileChronologyService.0.0', (client) => {
					client.deleteEventByPid(params);
				})
			];
		}).end(function(results) {
			if(callback){
				callback(results[0]);
			}
		});
	}
	
	updateExpEvent(params, callback) {
		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			return [
				soap('/ProfileChronologyService.0.0', (client) => {
					client.updateExpEvent(params);
				})
			];
		}).end(function(results) {
			if(callback){
				callback(results[0]);
			}
		});
	}
	
	updateEduEvent(params, callback) {
		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			return [
				soap('/ProfileChronologyService.0.0', (client) => {
					client.updateEduEvent(params);
				})
			];
		}).end(function(results) {
			if(callback){
				callback(results[0]);
			}
		});
	}
	
	updateHonorEvent(params, callback) {
		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			return [
				soap('/ProfileChronologyService.0.0', (client) => {
					client.updateHonorEvent(params);
				})
			];
		}).end(function(results) {
			if(callback){
				callback(results[0]);
			}
		});
	}
	
	updateEventPrivacySetting(params, callback) {
		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			return [
				soap('/ProfileChronologyService.0.0', (client) => {
					client.updateEventPrivacySetting(params);
				})
			];
		}).end(function(results) {
			if(callback){
				callback(results[0]);
			}
		});
	}

	getChronicleExp( pid, params, callback ) {
		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			return [
				soap('/ProfileChronologyService.0.0', (client) => {
					client.getExpEventList({'pid': pid , 'targetPid': params.targetPid});
				})
			];
		}).end(function(results) {
			if(callback){
				callback(results[0].response);
			}
		});
	}

	getChronicleEdu( pid, params, callback ) {
		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			return [
				soap('/ProfileChronologyService.0.0', (client) => {
					client.getEduEventList({'pid': pid , 'targetPid': params.targetPid});
				})
			];
		}).end(function(results) {
			if(callback){
				callback(results[0].response);
			}
		});
	}

	getChronicleHonor( pid, params, callback ) {
		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			return [
				soap('/ProfileChronologyService.0.0', (client) => {
					client.getHonorEventList({'pid': pid , 'targetPid': params.targetPid});
				})
			];
		}).end(function(results) {
			if(callback){
				callback(results[0].response);
			}
		});
	}

	getChronicleAll(pid, params, callback) {
		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			return [
				soap('/ProfileChronologyService.0.0', (client) => {
					client.getExpEventList({'pid': pid , 'targetPid': params.targetPid});
				}),
				soap('/ProfileChronologyService.0.0', (client) => {
					client.getEduEventList({'pid': pid , 'targetPid': params.targetPid});
				}),
				soap('/ProfileChronologyService.0.0', (client) => {
					client.getHonorEventList({'pid': pid , 'targetPid': params.targetPid});
				})
			];
		}).end(function(results) {
			var chronilce = {
				exp: results[0].response,
				edu: results[1].response,
				honor: results[2].response
			}
			if(callback){
				callback(chronilce);
			}
		});
	}
};

export default ProfileChronicleService;