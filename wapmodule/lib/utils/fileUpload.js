'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.MIMEMap = undefined;
exports.getAtomicType = getAtomicType;
exports.getSignature = getSignature;
exports.uploadToS3 = uploadToS3;
exports.getFileUrl = getFileUrl;
exports.waitUrlSuccess = waitUrlSuccess;
exports.getURLData = getURLData;

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);
var ENV = canUseDOM && window.env || process.env.NODE_ENV;
var S3url = void 0;
if (ENV === 'staging') {
	S3url = '//ori.doc.104-staging.com.tw';
} else if (ENV === 'production') {
	S3url = '//ori.doc.104.com.tw';
} else {
	S3url = '//ori.doc.104-dev.com.tw';
}

var MIMEMap = {
	'image/jpeg': 'IMAGE',
	'image/png': 'IMAGE',
	'image/gif': 'IMAGE',
	'image/bmp': 'IMAGE',
	'image/vnd.wap.wbmp': 'IMAGE',
	'application/pdf': 'DOCUMENT',
	'application/msword': 'DOCUMENT',
	'application/rtf': 'DOCUMENT',
	'application/vnd.ms-powerpoint': 'DOCUMENT',
	'application/vnd.ms-powerpoint.slideshow.macroenabled.12': 'DOCUMENT',
	'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'DOCUMENT',
	'application/vnd.openxmlformats-officedocument.presentationml.slideshow': 'DOCUMENT',
	'application/vnd.openxmlformats-officedocument.presentationml.template': 'DOCUMENT',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCUMENT',
	'application/vnd.ms-powerpoint.template.macroenabled.12': 'DOCUMENT',
	'audio/x-wav': 'AUDIO',
	'audio/x-ms-wma': 'AUDIO',
	'audio/mp3': 'AUDIO',
	'audio/mpeg': 'AUDIO',
	'audio/x-m4a': 'AUDIO',
	'audio/mp4': 'AUDIO',
	'audio/m4a': 'AUDIO',
	'video/3gpp': 'VIDEO',
	'video/mpeg': 'VIDEO',
	'video/x-msvideo': 'VIDEO',
	'video/x-ms-wmv': 'VIDEO',
	'video/vnd.uvvu.mp4': 'VIDEO',
	'video/mp4': 'VIDEO',
	'video/x-flv': 'VIDEO',
	'video/webm': 'VIDEO',
	'video/mov': 'VIDEO'
};
exports.MIMEMap = MIMEMap;
function getAtomicType(MIMEType) {
	if (MIMEMap[MIMEType]) {
		return MIMEMap[MIMEType];
	} else {
		alert('不支援的檔案格式');
		return false;
	}
}

function getSignature(file, dataInfo) {

	var ajaxConfig = {
		"IMAGE": '/getSignature/activityImage',
		"VIDEO": '/getSignature/activityVideo',
		"AUDIO": '/getSignature/activityAudio',
		"DOCUMENT": '/getSignature/activityDocument',
		"HYPERLINK": '/htmlConvert'
	};

	var jsonDataForSig = {
		contentType: file.type,
		filename: file.name
	};

	return new Promise(function (resolve, reject) {
		_jquery2.default.ajax({
			method: 'POST',
			url: '/ajax' + ajaxConfig[MIMEMap[file.type]],
			contentType: "application/json; charset=utf-8",
			dataType: 'json',
			data: JSON.stringify(jsonDataForSig)
		}).done(function (result) {
			resolve(result);
		});
	});
}
function uploadToS3(file, jsonDataForUpload) {
	var formData = new FormData();
	formData.append('key', jsonDataForUpload.objectKey);
	formData.append('content-type', file.type);
	formData.append('acl', 'authenticated-read');
	formData.append('AWSAccessKeyId', jsonDataForUpload.AWSAccessKeyId);
	formData.append('policy', jsonDataForUpload.policyDocument);
	formData.append('signature', jsonDataForUpload.signature);
	formData.append('file', file);
	formData.append('Content-Disposition', file.name);
	return new Promise(function (resolve, reject) {
		_jquery2.default.ajax({
			method: 'POST',
			url: location.protocol + S3url,
			processData: false,
			contentType: false,
			data: formData
		}).done(function () {
			return resolve();
		});
	});
}
function getFileUrl(fileId, type, tagArr) {
	var params = {};
	params.timestamp = Math.floor(Date.now() / 1000) + 1800;
	params.getFileArr = [];
	//console.log(type);
	if (!tagArr || tagArr.length === 0) {
		params.getFileArr.push({
			fileId: fileId,
			protocol: "common"
		});
	}
	for (var i in tagArr) {
		if (tagArr[i]) {
			if (type === 'DOCUMENT' && tagArr[i] === 'activityPlay') {
				params.getFileArr.push({
					fileId: fileId,
					protocol: "common",
					fileTag: tagArr[i],
					page: '-1'
				});
			} else {
				params.getFileArr.push({
					fileId: fileId,
					protocol: "common",
					fileTag: tagArr[i]
				});
			}
		} else {
			params.getFileArr.push({
				fileId: fileId,
				protocol: "common"
			});
		}
	}
	if (params.getFileArr.length === 0 && type === 'HYPERLINK') {
		params.getFileArr.push({
			fileId: fileId,
			protocol: "common",
			fileTag: "hyperlink"
		});
	}
	//console.log(params.getFileArr);
	return _jquery2.default.ajax({
		method: 'POST',
		url: '/ajax/getFileUrl',
		contentType: "application/json; charset=utf-8",
		dataType: 'json',
		data: JSON.stringify(params)
	});
}

function waitUrlSuccess(id, type, tagArr) {
	return new Promise(function (resolve, reject) {
		var time = 0;
		var loop = function loop() {
			return getFileUrl(id, type, tagArr).done(function (res) {
				if (res[0].convertStatus === 'success') {
					resolve(res);
				} else if (res[0].convertStatus === 'noResponse') {
					reject();
				} else {
					setTimeout(function () {
						time = time + 500;
						loop();
					}, 500);
				}
			});
		};
		loop();
	});
}

function getURLData(apnum, pid, url, tag) {
	var jsonData = {
		apnum: apnum,
		pid: pid,
		isP: 0,
		urlList: [{
			url: url,
			tag: tag
		}]
	};
	return _jquery2.default.ajax({
		method: 'POST',
		url: '/ajax/htmlConvert',
		contentType: 'application/json; charset=utf-8',
		dataType: 'json',
		data: JSON.stringify(jsonData)
	});
}

/*
export function fileUpload (pid, file){
	getSignature(file).done(function(jsonDataForUpload){
		callback.signatureDone(jsonDataForUpload);
		uploadToS3(jsonDataForUpload, file).done(function(){
			callback.uploadDone();
		})
	})

	let callback = new Object;
	let signatureDone = function(f){
		f();
		return callback;
	}
}

fileUpload(pid,file).signatureDone(function(res){

}).uploadDone(function(res){

})*/