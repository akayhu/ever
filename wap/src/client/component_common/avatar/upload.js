import $ from 'jquery';
import clientConfig from 'src/configs/client';

export function uploadAvatar(refInput, record, isCover) {
	const file = document.getElementById(refInput).files[0] || {};

	return new Promise((resolve, reject) => {
		getSignatureUpload(file, record, isCover).done((jsonDataForUpload) => {
			uploadToS3(jsonDataForUpload, file).done(() => {
				resolve(jsonDataForUpload);
			}).fail((errorMsg) => {
				reject(errorMsg);
			});
		});
	});
}

export function adjustAvatar(fileId, record, isCover) {
	return new Promise((resolve, reject) => {
		reConvert(fileId, record, isCover).done((jsonDataForUpload) => {
			resolve(jsonDataForUpload);
		}).fail((errorMsg) => {
			reject(errorMsg);
		});
	});
}

export function getAvatarEdit(fileId, isCover) {
	return new Promise((resolve) => {
		const params = {
			getFileArr: [{
				fileId,
				protocol: 'https',
				fileTag: isCover ? 'coverEdit' : 'avatarEdit'
			}]
		};
		$.ajax({
			method: 'POST',
			url: '/ajax/getFileUrl',
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			data: JSON.stringify(params),
			success: (getFileUrlResult) => {
				let result = '';
				try {
					result = getFileUrlResult[0].url[0];
				} catch (e) {
					console.log(e);
				}

				resolve(result);
			}
		});
	});
}

export function uploadCover(refInput, record) {
	return uploadAvatar(refInput, record, true);
}

export function adjustCover(fileId, record) {
	return adjustAvatar(fileId, record, true);
}

export function getCoverEdit(fileId) {
	return getAvatarEdit(fileId, true);
}

function getSignatureUpload(file, record, isCover) {
	const jsonDataForSig = {};
	let ratio = 1;
	let url = '';

	if (isCover === true) {
		jsonDataForSig.filename = file.name;
		jsonDataForSig.contentType = file.type;
		jsonDataForSig.startPointX = record.coordination.ltx;
		jsonDataForSig.startPointY = record.coordination.lty;
		jsonDataForSig.endPointX = record.coordination.rbx;
		jsonDataForSig.endPointY = record.coordination.rby;

		url = '/ajax/getSignature/profileCover';
	} else {
		if (record.resizedWidth > record.editWidth) {
			ratio = record.resizedWidth / record.editWidth;
		} else {
			ratio = record.editWidth / record.resizedWidth;
		}

		jsonDataForSig.filename = file.name;
		jsonDataForSig.contentType = file.type;
		jsonDataForSig.startPointX = Math.round(record.ltx * ratio);
		jsonDataForSig.startPointY = Math.round(record.lty * ratio);
		jsonDataForSig.endPointX = Math.round(record.rbx * ratio);
		jsonDataForSig.endPointY = Math.round(record.rby * ratio);

		url = '/ajax/getSignature/profileAvatar';
	}

	return $.ajax({
		method: 'POST',
		url,
		contentType: 'application/json; charset=utf-8',
		dataType: 'json',
		data: JSON.stringify(jsonDataForSig)
	});
}

function uploadToS3(jsonDataForUpload, file) {
	const formData = new FormData();
	formData.append('key', jsonDataForUpload.objectKey);
	formData.append('content-type', file.type);
	formData.append('acl', 'authenticated-read');
	formData.append('AWSAccessKeyId', jsonDataForUpload.AWSAccessKeyId);
	formData.append('policy', jsonDataForUpload.policyDocument);
	formData.append('signature', jsonDataForUpload.signature);
	formData.append('file', file);
	formData.append('Content-Disposition', file.name);
	return $.ajax({
		method: 'POST',
		url: clientConfig.params.s3amazonaws,
		processData: false,
		contentType: false,
		data: formData
	});
}

function reConvert(fileId, record, isCover) {
	const jsonData = {};
	let ratio = 1;
	let url = '';

	if (isCover === true) {
		jsonData.fileId = fileId;
		jsonData.startPointX = record.coordination.ltx;
		jsonData.startPointY = record.coordination.lty;
		jsonData.endPointX = record.coordination.rbx;
		jsonData.endPointY = record.coordination.rby;

		url = '/ajax/reConvert/profileCover';
	} else {
		if (record.resizedWidth > record.editWidth) {
			ratio = record.resizedWidth / record.editWidth;
		} else {
			ratio = record.editWidth / record.resizedWidth;
		}

		jsonData.fileId = fileId;
		jsonData.startPointX = Math.round(record.ltx * ratio);
		jsonData.startPointY = Math.round(record.lty * ratio);
		jsonData.endPointX = Math.round(record.rbx * ratio);
		jsonData.endPointY = Math.round(record.rby * ratio);

		url = '/ajax/reConvert/profileAvatar';
	}


	return $.ajax({
		method: 'POST',
		url,
		contentType: 'application/json; charset=utf-8',
		dataType: 'json',
		data: JSON.stringify(jsonData)
	});
}

function getFileUrl(jsonDataForUpload) {
	const postdata = {
		getFileArr: [
			{
				fileId: jsonDataForUpload.fileId,
				protocol: 'https',
				fileTag: ''
			},
			{
				fileId: jsonDataForUpload.fileId,
				protocol: 'https',
				fileTag: 'avatarEdit'
			},
			{
				fileId: jsonDataForUpload.fileId,
				protocol: 'https',
				fileTag: 'avatarProcess'
			},
			{
				fileId: jsonDataForUpload.fileId,
				protocol: 'https',
				fileTag: 'avatarWeb'
			}
		]
	};

	$.ajax({
		method: 'POST',
		url: '/ajax/getFileUrl',
		contentType: 'application/json; charset=utf-8',
		dataType: 'json',
		data: JSON.stringify(postdata)
	});
}
