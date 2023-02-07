import AsyncFetchHelper from 'async-fetch-helper';
import config from 'src/configs/config';

const productKey = config.params.apnum;

class ActivityInteractiveService{

	static getInstance() {
		if(!this.activityInteractiveService){
			this.activityInteractiveService = new this;
		}

		return this.activityInteractiveService;
	}

	constructor() {
		this.asyncFetchHelper = new AsyncFetchHelper({
			apiUrl : config.params.apiUrl.esb
		});
		this.activityInteractiveService = null;
	}

	interactiveLike( pid, params, callback ) {
		params.pid = pid;
		params.productKey = productKey;
		
		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			return [
				soap('/ActivityService.0.0', (client) => {
					client.like(params);
				})
			];
		}).end(function(results) {
			if(callback){
				callback(results[0]);
			}
		});
	}

	interactiveUnlike( pid, params, callback ) {
		params.pid = pid;
		params.productKey = productKey;
		
		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			return [
				soap('/ActivityService.0.0', (client) => {
					client.unLike(params);
				})
			];
		}).end(function(results) {
			if(callback){
				callback(results[0]);
			}
		});
	}

	interactiveCollect( pid, params, callback ) {
		params.pid = pid;
		params.productKey = productKey;
		
		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			return [
				soap('/MyCollectionService.0.0', (client) => {
					client.addMyCollect(params);
				})
			];
		}).end(function(results) {
			if(callback){
				callback(results[0]);
			}
		});
	}

	interactiveRemoveCollect( pid, params, callback ) {
		params.productKey = productKey;
		params.pid = pid;
		
		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			return [
				soap('/MyCollectionService.0.0', (client) => {
					client.delMyCollect(params);
				})
			];
		}).end(function(results) {
			if(callback){
				callback(results[0]);
			}
		});
	}

	interactiveIgnore( pid, params, callback ) {
		params.productKey = productKey;
		params.pid = pid;
		
		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			return [
				soap('/ActivityService.0.0', (client) => {
					client.setActivityIgnore(params);
				})
			];
		}).end(function(results) {
			if(callback){
				callback(results[0]);
			}
		});
	}

	notInterested( pid, params, callback ){
		params.pid = pid;
		
		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			return [
				soap('/ConnectionService.0.0', (client) => {
					client.notInterested({ pid: pid, targetPid: params.targetPid, type: 'notinterested', status: true });
				})
			];
		}).end(function(results) {
			if(callback){
				callback(results[0]);
			}
		});
	}

	undoNotInterested( pid, params, callback ){
		params.pid = pid;
		
		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			return [
				soap('/ConnectionService.0.0', (client) => {
					client.notInterested({ pid: pid, targetPid: params.targetPid, type: 'notinterested', status: false });
				})
			];
		}).end(function(results) {
			if(callback){
				callback(results[0]);
			}
		});
	}

	subscribe( pid, params, callback ){
		params.pid = pid;
		
		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			return [
				soap('/ConnectionService.0.0', (client) => {
					client.subscribe(params);
				})
			];
		}).end(function(results) {
			if(callback){
				callback(results[0]);
			}
		});
	}

	unsubscribe( pid, params, callback ){
		params.pid = pid;
		
		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			return [
				soap('/ConnectionService.0.0', (client) => {
					client.unsubscribe(params);
				})
			];
		}).end(function(results) {
			if(callback){
				callback(results[0]);
			}
		});
	}

	viewActivity( pid, params, callback ){
		params.pid = pid;
		params.productKey = productKey;
		
		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			return [
				soap('/AccessRecordService.0.0', (client) => {
					client.viewActivity(params);
				})
			];
		}).end(function(results) {
			if(callback){
				callback(results[0]);
			}
		});
	}

};

export default ActivityInteractiveService;
