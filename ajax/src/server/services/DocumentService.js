import AsyncFetchHelper from 'async-fetch-helper';
import config from 'src/configs/config';

class DocumentService {

	static getInstance() {
		if(!this.documentService){
			this.documentService = new this;
		}

		return this.documentService;
	}

	constructor() {
		const setting = {
			apiUrl : config.params.apiUrl.esb,
			proxy: null
		};

		// switch(config.env){
		// 	case 'lab':
		// 		setting.proxy = "http://172.19.1.249:3128";
		// 		break;
		// 	case 'staging':
		// 		setting.proxy = "http://sproxy.104.com.tw:3128";
		// 		break;
		// 	case 'production':
		// 		setting.proxy = "http://sproxy.104.com.tw:3128";
		// 		break;
		// }

		this.asyncFetchHelper = new AsyncFetchHelper(setting);
		this.documentService = null;
	}

	getEncryParam(params, callback) {
		try {
			this.asyncFetchHelper.need(['soap']).then(function(soap) {
				return [
					soap('/FileManage.0.0', (client) => {
						client.encryptParam({'param':"{'apnum': "+config.params.apnum+", 'pid': "+params.pid+"}"});
					})
				];
			}).end(function(results) {
				if(callback){
					callback(results);
				}
			});
		} catch (err) {
			console.err(err.message);
			return [];
		}
	}

	getSignature( pid, params, callback ){
		var jsonDataForSig = {
			returnAll: true,
			apnum: config.params.apnum,
			pid: pid,
			contentType: params.contentType,
			contentDisposition: params.contentDisposition,
			isP: params.isP,
			extra: params.extra,
			title: params.title,
			description: params.description
		},
		url = config.params.documentApiUrl + "signature";

		this.asyncFetchHelper.need(['rest']).then(function(rest){
			return [
				rest(
					'post',
					url,
					jsonDataForSig,
					{'Content-Type':'application/json;charset=UTF-8'}
				)
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
	});
}

	getSignatureAvatar( pid, params, callback ){
		if( params.hasOwnProperty('startPointX') && params.hasOwnProperty('startPointY') && params.hasOwnProperty('endPointX') && params.hasOwnProperty('endPointY') ){
			var jsonDataForSig = {
				returnAll: true,
				apnum: config.params.apnum,
				pid: pid,
				contentType: params.contentType || "image/jpeg",
				contentDisposition: params.filename || "Avatar.jpg",
				isP: 1,
				extra: {
					multiAction:[
						{
							"param": {
								"basis": "3",
								"width" : "534",
								"height" : "300"
							},
							"isSave": "1",
							"method": "resize",
							"tag": "avatarEdit"
						},
						{
							"param": {
								"startPointX": params.startPointX,
								"startPointY": params.startPointY,
								"endPointX": params.endPointX,
								"endPointY": params.endPointY
							},
							"isSave": "1",
							"method": "crop",
							"refTag": "avatarEdit",
							"tag": "avatarProcess"
						},
						{
							"param": {
								"basis": "3",
								"width" : "300",
								"height" : "300"
							},
							"isSave": "1",
							"method": "resize",
							"refTag": "avatarProcess",
							"tag": "avatarWeb"
						}
					]
				},
				title: "Avatar",
				description: "Avatar大頭照"
			},
			url = config.params.documentApiUrl + "signature";

			this.asyncFetchHelper.need(['rest']).then(function(rest){
				return [
					rest(
						'post',
						url,
						jsonDataForSig,
						{'Content-Type':'application/json;charset=UTF-8'}
					)
				];
			}).end(function(results){
				if(callback){
					callback(results[0]);
				}
			});
		}else{
			callback({errorMsg: "startPointX || startPointY || endPointX || endPointY must be defined."});
		}
	}

	getSignatureCover( pid, params, callback ){
		if( params.hasOwnProperty('startPointX') && params.hasOwnProperty('startPointY') && params.hasOwnProperty('endPointX') && params.hasOwnProperty('endPointY') ){
			var jsonDataForSig = {
				returnAll: true,
				apnum: config.params.apnum,
				pid: pid,
				contentType: params.contentType || "image/jpeg",
				contentDisposition: params.filename || "Cover.jpg",
				isP: 1,
				extra: {
					multiAction:[
						{
							"param": {
								"basis": "3",
								"width" : "960",
								"height" : "350"
							},
							"isSave": "1",
							"method": "resize",
							"tag": "coverEdit"
						},
						{
							"param": {
								"startPointX": params.startPointX,
								"startPointY": params.startPointY,
								"endPointX": params.endPointX,
								"endPointY": params.endPointY
							},
							"isSave": "1",
							"method": "crop",
							"refTag": "coverEdit",
							"tag": "coverWeb"
						},
						{
							"param": {
								"basis": "3",
								"width" : "460",
								"height" : "168"
							},
							"isSave": "1",
							"method": "resize",
							"refTag": "coverWeb",
							"tag": "coverCard"
						},
						{
							"param": {
								"startPointX": 0,
								"startPointY": 0,
								"endPointX": 300,
								"endPointY": 350
							},
							"isSave": "1",
							"method": "crop",
							"refTag": "coverWeb",
							"tag": "coverIndex"
						}
					]
				},
				title: "Cover",
				description: "Cover"
			},
			url = config.params.documentApiUrl + "signature";

			this.asyncFetchHelper.need(['rest']).then(function(rest){
				return [
					rest(
						'post',
						url,
						jsonDataForSig,
						{'Content-Type':'application/json;charset=UTF-8'}
					)
				];
			}).end(function(results){
				if(callback){
					callback(results[0]);
				}
			});
		}else{
			callback({errorMsg: "startPointX || startPointY || endPointX || endPointY must be defined."});
		}
	}

	getSignatureImage( pid, params, callback ){

		var jsonDataForSig = {
			returnAll: true,
			apnum: config.params.apnum,
			pid: pid,
			contentType: params.contentType,
			contentDisposition: params.filename,
			isP: 1,
			extra: {
				multiAction:[
					{
						"param": {
							"basis": "9",
							"width" : "200",
							"reduceOnly" : "1"
						},
						"isSave": "1",
						"method": "resize",
						"tag": "activityList"
					},
					{
						"param": {
							"basis": "9",
							"width" : "800",
							"reduceOnly" : "1"
						},
						"isSave": "1",
						"method": "resize",
						"tag": "activityGrid"
					},
					{
						"param": {
							"basis": "9",
							"width" : "1600",
							"reduceOnly" : "1"
						},
						"isSave": "1",
						"method": "resize",
						"tag": "activityPlay"
					}
				]
			},
			title: "ActivityImage",
			description: "ActivityImage"
		},
		url = config.params.documentApiUrl + "signature";

		this.asyncFetchHelper.need(['rest']).then(function(rest){
			return [
				rest(
					'post',
					url,
					jsonDataForSig,
					{'Content-Type':'application/json;charset=UTF-8'}
				)
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	getSignatureVideo( pid, params, callback ){

		var jsonDataForSig = {
			returnAll: true,
			apnum: config.params.apnum,
			pid: pid,
			contentType: params.contentType,
			contentDisposition: params.filename,
			isP: 1,
			extra: {
				multiAction:[
					{
						"param": {
							"sec": "1"
						},
						"isSave": "1",
						"method": "videoSnap",
						"tag": "activityProcess"
					},
					{
						"param": {
							"basis": "9",
							"width": "200",
							"reduceOnly" : "1"
						},
						"isSave": "1",
						"method": "resize",
						"refTag": "activityProcess",
						"tag": "activityList"
					},
					{
						"param": {
							"basis": "9",
							"width": "800",
							"reduceOnly" : "1"
						},
						"isSave": "1",
						"method": "resize",
						"refTag": "activityProcess",
						"tag": "activityGrid",
					},
					{
						"param":{
							"videoQuality":["720p"]
						},
						"isSave": "1",
						"method": "videoConvert"
					}
				],
				convert: "true"
			},
			title: "ActivityVideo",
			description: "ActivityVideo"
		},
		url = config.params.documentApiUrl + "signature";

		this.asyncFetchHelper.need(['rest']).then(function(rest){
			return [
				rest(
					'post',
					url,
					jsonDataForSig,
					{'Content-Type':'application/json;charset=UTF-8'}
				)
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	getSignatureAudio( pid, params, callback ){
		var jsonDataForSig = {
			returnAll: true,
			apnum: config.params.apnum,
			pid: pid,
			contentType: params.contentType,
			contentDisposition: params.filename,
			isP: 1,
			extra: {
				multiAction:[
					{
						"isSave": "1",
						"method": "audioConvert"
					}
				],
				convert: "true"
			},
			title: "ActivityAudio",
			description: "ActivityAudio"
		},
		url = config.params.documentApiUrl + "signature";

		this.asyncFetchHelper.need(['rest']).then(function(rest){
			return [
				rest(
					'post',
					url,
					jsonDataForSig,
					{'Content-Type':'application/json;charset=UTF-8'}
				)
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	reconvert( pid, params, callback){
		var jsonData = {
			returnAll: true,
			apnum: config.params.apnum,
			pid: pid,
			contentType: params.contentType,
			contentDisposition: params.filename,
			isP: 1,
			extra: {
				fileId: params.fileId,
				multiAction: params.multiAction
			},
			title: params.title,
			description: params.description
		},
		url = config.params.documentApiUrl + "reConvert";

		this.asyncFetchHelper.need(['rest']).then(function(rest){
			return [
				rest(
					'post',
					url,
					jsonData,
					{'Content-Type':'application/json;charset=UTF-8'}
				)
			];
		}).end(function(results){
			if(callback){
				// console.log(jsonData);
				callback(results[0]);
			}
		});
	}

	reConvertAvatar( pid, params, callback ){
		if( params.hasOwnProperty('startPointX') && params.hasOwnProperty('startPointY') && params.hasOwnProperty('endPointX') && params.hasOwnProperty('endPointY') ){
			var jsonDataForSig = {
				returnAll: true,
				apnum: config.params.apnum,
				pid: pid,
				contentType: params.contentType || "image/jpeg",
				contentDisposition: params.filename || "Avatar.jpg",
				isP: 1,
				extra: {
					fileId: params.fileId,
					multiAction:[
						{
							"param": {
								"basis": "3",
								"width" : "534",
								"height" : "300"
							},
							"isSave": "1",
							"method": "resize",
							"tag": "avatarEdit"
						},
						{
							"param": {
								"startPointX": params.startPointX,
								"startPointY": params.startPointY,
								"endPointX": params.endPointX,
								"endPointY": params.endPointY
							},
							"isSave": "1",
							"method": "crop",
							"refTag": "avatarEdit",
							"tag": "avatarProcess"
						},
						{
							"param": {
								"basis": "3",
								"width" : "300",
								"height" : "300"
							},
							"isSave": "1",
							"method": "resize",
							"refTag": "avatarProcess",
							"tag": "avatarWeb"
						}
					]
				},
				title: "Avatar",
				description: "Avatar大頭照"
			},
			url = config.params.documentApiUrl + "reConvert";

			this.asyncFetchHelper.need(['rest']).then(function(rest){
				return [
					rest(
						'post',
						url,
						jsonDataForSig,
						{'Content-Type':'application/json;charset=UTF-8'}
					)
				];
			}).end(function(results){
				if(callback){
					// console.log(params);
					callback(results[0]);
				}
			});
		}else{
			callback({errorMsg: "startPointX || startPointY || endPointX || endPointY must be defined."});
		}
	}

	reConvertCover( pid, params, callback ){
		if( params.hasOwnProperty('startPointX') && params.hasOwnProperty('startPointY') && params.hasOwnProperty('endPointX') && params.hasOwnProperty('endPointY') ){
			var jsonDataForSig = {
				returnAll: true,
				apnum: config.params.apnum,
				pid: pid,
				contentType: params.contentType || "image/jpeg",
				contentDisposition: params.filename || "Cover.jpg",
				isP: 1,
				extra: {
					fileId: params.fileId,
					multiAction:[
						{
							"param": {
								"basis": "3",
								"width" : "960",
								"height" : "350"
							},
							"isSave": "1",
							"method": "resize",
							"tag": "coverEdit"
						},
						{
							"param": {
								"startPointX": params.startPointX,
								"startPointY": params.startPointY,
								"endPointX": params.endPointX,
								"endPointY": params.endPointY
							},
							"isSave": "1",
							"method": "crop",
							"refTag": "coverEdit",
							"tag": "coverWeb"
						},
						{
							"param": {
								"basis": "3",
								"width" : "460",
								"height" : "168"
							},
							"isSave": "1",
							"method": "resize",
							"refTag": "coverWeb",
							"tag": "coverCard"
						},
						{
							"param": {
								"startPointX": 0,
								"startPointY": 0,
								"endPointX": 300,
								"endPointY": 350
							},
							"isSave": "1",
							"method": "crop",
							"refTag": "coverWeb",
							"tag": "coverIndex"
						}
					]
				},
				title: "Cover",
				description: "Cover"
			},
			url = config.params.documentApiUrl + "reConvert";

			this.asyncFetchHelper.need(['rest']).then(function(rest){
				return [
					rest(
						'post',
						url,
						jsonDataForSig,
						{'Content-Type':'application/json;charset=UTF-8'}
					)
				];
			}).end(function(results){
				if(callback){
					callback(results[0]);
				}
			});
		}else{
			callback({errorMsg: "startPointX || startPointY || endPointX || endPointY must be defined."});
		}
	}

	getFileDetail( pid, params, callback){
		var jsonData = {
			returnAll: true,
			fileId: params.fileId
		},
		url = config.params.documentApiUrl + "getFileDetail";

		this.asyncFetchHelper.need(['rest']).then(function(rest){
			return [
				rest(
					'get',
					url,
					jsonData,
					{'Content-Type':'application/json;charset=UTF-8'}
				)
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	getSignatureDocument( pid, params, callback ){

		var jsonDataForSig = {
			returnAll: true,
			apnum: config.params.apnum,
			pid: pid,
			contentType: params.contentType,
			contentDisposition: params.filename,
			isP: 1,
			extra: {
				multiAction:[
					{
						"param": {
							"width": "1600",
							"isBaseByWidth": "true"
						},
						"isSave": "1",
						"method": "docConvert",
						"tag": "activityPlay"
					},
					{
						"param": {
							"basis": "9",
							"width": "200",
							"page": "0"
						},
						"isSave": "1",
						"method": "docSnap",
						"tag": "activityList"
					},
					{
						"param": {
							"basis": "9",
							"width": "800",
							"page": "0"
						},
						"isSave": "1",
						"method": "docSnap",
						"tag": "activityGrid"
					}
				],
				convert: "true"
			},
			title: "ActivityDocument",
			description: "ActivityDocument"
		},
		url = config.params.documentApiUrl + "signature";

		this.asyncFetchHelper.need(['rest']).then(function(rest){
			return [
				rest(
					'post',
					url,
					jsonDataForSig,
					{'Content-Type':'application/json;charset=UTF-8'}
				)
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	htmlConvert( pid, params, callback ){
		var jsonData = {
			returnAll: true,
			apnum: config.params.apnum,
			pid: pid,
			isP: 0,
			urlList: params.urlList
		},
		url = config.params.documentApiUrl + "htmlConvert";

		this.asyncFetchHelper.need(['rest']).then(function(rest){
			return [
				rest(
					'post',
					url,
					jsonData,
					{'Content-Type':'application/json;charset=UTF-8'}
				)
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	getFileUrl( params, callback ){

		var dateTime = new Date(); // 13位數 毫秒
		var dateTimeStamp = Math.floor(dateTime.getTime() / 1000) + 1800; // 換成用秒 + (60*30)秒;
		var url = config.params.documentApiUrl + "getFileUrl";
		var getFileUrlConfig = {
			returnAll: true,
			timestamp: dateTimeStamp,
			getFileArr: (typeof(params.getFileArr) === 'object')? params.getFileArr : JSON.parse(params.getFileArr)
		}

		this.asyncFetchHelper.need(['rest']).then(function(rest){
			return [
				rest(
					'post',
					url,
					getFileUrlConfig,
					{'Content-Type':'application/json;charset=UTF-8'}
				)
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	discardFile( params, callback ){
		const { fileIds } = params;
		this.asyncFetchHelper.need(['rest']).then(function(rest){
			return fileIds.map((fileId) => rest('delete', `${config.params.documentApiUrl}discardFile/${fileId}`, {}, {}));
		}).end(function(results){
			if(callback){
				callback(results);
			}
		});
	}

};

export default DocumentService;
