const canUseDOM = !!(
	typeof window !== 'undefined' &&
	window.document &&
	window.document.createElement
);

const ENV = (canUseDOM && window.env) || process.env.NODE_ENV;

let S3url;

if (ENV === 'staging') {
	S3url = '//ori.doc.104-staging.com.tw';
} else if (ENV === 'production') {
	S3url = '//ori.doc.104.com.tw';
} else {
	S3url = '//ori.doc.104-dev.com.tw';
}

const MIMEMap = {
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
	'application/vnd.openxmlformats-officedocument.presentationml.presentation':
		'DOCUMENT',
	'application/vnd.openxmlformats-officedocument.presentationml.slideshow':
		'DOCUMENT',
	'application/vnd.openxmlformats-officedocument.presentationml.template':
		'DOCUMENT',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
		'DOCUMENT',
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
	'video/mov': 'VIDEO',
};

export { MIMEMap };

export function getAtomicType(MIMEType) {
	if (MIMEMap[MIMEType]) {
		return MIMEMap[MIMEType];
	} else {
		alert('不支援的檔案格式');
		return false;
	}
}

const plusAPI = 'https://plus.104-dev.com.tw/ajax';

export function getSignature(file, dataInfo) {
	let ajaxConfig = {
		IMAGE: '/getSignature/activityImage',
		VIDEO: '/getSignature/activityVideo',
		AUDIO: '/getSignature/activityAudio',
		DOCUMENT: '/getSignature/activityDocument',
		HYPERLINK: '/htmlConvert',
	};

	let jsonDataForSig = {
		contentType: file.type,
		filename: file.name,
	};

	return new Promise(function(resolve, reject) {
		fetch(plusAPI + ajaxConfig[MIMEMap[file.type]], {
			method: 'POST',
			body: JSON.stringify(jsonDataForSig),
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then(res => {
				return res.json();
			})
			.then(json => {
				return resolve(json);
			});
	});
}

export function uploadToS3(file, jsonDataForUpload) {
	let formData = new FormData();
	formData.append('key', jsonDataForUpload.objectKey); // 第1步驟回傳參數objectKey
	formData.append('content-type', file.type); // 檔案content-type
	formData.append('acl', jsonDataForUpload.acl); // 第1步驟回傳參數acl
	formData.append('X-Amz-Credential', jsonDataForUpload.xAmzCredential); // 第1步驟回傳參數xAmzCredential
	formData.append('X-Amz-Algorithm', jsonDataForUpload.xAmzAlgorithm); // 第1步驟回傳參數xAmzAlgorithm
	formData.append('X-Amz-Date', jsonDataForUpload.xAmzDate); // 第1步驟回傳參數xAmzDate
	formData.append('policy', jsonDataForUpload.policyDocument); // 第1步驟回傳參數policyDocument
	formData.append('X-Amz-Signature', jsonDataForUpload.signature); // 第1步驟回傳參數signature
	formData.append('file', file);

	return new Promise(function(resolve, reject) {
		fetch(window.location.protocol + S3url, {
			method: 'POST',
			body: formData,
			processData: false,
			headers: {
				'Content-Type': 'application/json',
			},
			mode: 'no-cors',
		}).then(res => {
			return resolve();
		});
	});
}

export function getFileUrl(fileId, type, tagArr) {
	var params = {};
	params.timestamp = Math.floor(Date.now() / 1000) + 1800;
	params.getFileArr = [
		{
			fileId: fileId,
			protocol: 'common',
		},
	];

	if (!tagArr || tagArr.length === 0) {
		params.getFileArr.push({
			fileId: fileId,
			protocol: 'common',
		});
	}
	for (let i in tagArr) {
		if (tagArr[i]) {
			if (type === 'DOCUMENT' && tagArr[i] === 'activityPlay') {
				params.getFileArr.push({
					fileId: fileId,
					protocol: 'common',
					fileTag: tagArr[i],
					page: '-1',
				});
			} else {
				params.getFileArr.push({
					fileId: fileId,
					protocol: 'common',
					fileTag: tagArr[i],
				});
			}
		} else {
			params.getFileArr.push({
				fileId: fileId,
				protocol: 'common',
			});
		}
	}
	if (params.getFileArr.length === 0 && type === 'HYPERLINK') {
		params.getFileArr.push({
			fileId: fileId,
			protocol: 'common',
			fileTag: 'hyperlink',
		});
	}

	return fetch(plusAPI + '/getFileUrl', {
		method: 'POST',
		body: JSON.stringify(params),
		processData: false,
		headers: {
			'Content-Type': 'application/json',
		},
	}).then(res => {
		return res.json();
	});
}

export function waitUrlSuccess(id, type, tagArr) {
	return new Promise(function(resolve, reject) {
		let time = 0;
		let loop = () =>
			getFileUrl(id, type, tagArr).then(function(res) {
				if (res[0].convertStatus === 'success') {
					resolve(res);
				} else if (res[0].convertStatus === 'noResponse') {
					reject();
				} else {
					setTimeout(() => {
						time = time + 500;
						loop();
					}, 500);
				}
			});
		loop();
	});
}
