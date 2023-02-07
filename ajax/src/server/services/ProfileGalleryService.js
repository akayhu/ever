import AsyncFetchHelper from 'async-fetch-helper';
import config from 'src/configs/config';

class ProfileGalleryService {

	static getInstance() {
		if(!this.profileService){
			this.profileService = new this;
		}

		return this.profileService;
	}

	constructor() {
		this.asyncFetchHelper = new AsyncFetchHelper({
			apiUrl : config.params.apiUrl.esb
		});
		this.profileService = null;
	}

	getGalleryList(pid, params, callback) {
		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			var limit = params.limit || 10;
			var offset = params.offset || 0;
			var targetPid = params.targetPid;

			return [
				soap('/ProfileGalleryService.0.0', (client) => {
					//TODO limit offset handle
					client.getGalleryList({'pid': pid, 'targetPid': targetPid, 'limit':limit, 'offset':offset});
				})
			];

		}).end(function(results) {
			if(callback){
				callback(results[0]);
			}
		});
	}

	getGallerySortList(pid, callback) {
		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			return [
				soap('/ProfileGalleryService.0.0', (client) => {
					client.getGallerySortList({'pid': pid});
				})
			];

		}).end(function(results) {
			if(callback){
				callback(results[0]);
			}
		});
	}

	deleteGallery(pid, params, callback) {
		params.pid = pid;
		
		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			return [
				soap('/ProfileGalleryService.0.0', (client) => {
					client.deleteGallery(params);
				})
			];

		}).end(function(results) {
			if(callback){
				callback(results[0]);
			}
		});
	}

	createGallery(pid, params, callback) {
		params.pid = pid;
		params.productKey = config.params.apnum;
		
		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			return [
				soap('/ProfileGalleryService.0.0', (client) => {
					client.createGallery(params);
				})
			];

		}).end(function(results) {
			if(callback){
				callback(results[0]);
			}
		});
	}

	updateGallery(params, callback) {
		
		params.productKey = config.params.apnum;

		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			return [
				soap('/ProfileGalleryService.0.0', (client) => {
					client.updateGallery(params);
				})
			];

		}).end(function(results) {
			if(callback){
				callback(results[0]);
			}
		});
	}

	updateGallerySort(params, callback) {
		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			return [
				soap('/ProfileGalleryService.0.0', (client) => {
					client.updateGallerySort(params);
				})
			];

		}).end(function(results) {
			if(callback){
				callback(results[0]);
			}
		});
	}
};

export default ProfileGalleryService;
