import $ from 'jquery';
import clientConfig from 'src/configs/client';

export default function upload_cover(record) {
	const file = record.file;
	return new Promise((resolve, reject) => {
		getSignature(file, record).done(function(jsonDataForUpload){
			uploadToS3(jsonDataForUpload, file).done(() => {
				resolve(jsonDataForUpload);
				// getFileUrl(jsonDataForUpload);
			});
		});
	});
}

function getSignature (file, record){
	let jsonDataForSig = {
		apnum: "10400",
		pid: "10400",
		contentType: "image/jpeg",
		contentDisposition: file.name,
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
						"startPointX": record.coordination.ltx,
						"startPointY": record.coordination.lty,
						"endPointX": record.coordination.rbx,
						"endPointY": record.coordination.rby
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
	};
	return $.ajax({
		method: 'POST',
		url: clientConfig.params.documentApiUrl + 'signature',
		contentType: "application/json; charset=utf-8",
		dataType: 'json',
		data: JSON.stringify(jsonDataForSig)
	});
}

function uploadToS3(jsonDataForUpload, file){
	let formData = new FormData();
	formData.append('key', jsonDataForUpload.objectKey);
	formData.append('content-type', 'image/jpeg');
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

function getFileUrl(jsonDataForUpload) {
	let params = {
		"timestamp": "1669527003",
		"getFileArr": [
			{
			"fileId": jsonDataForUpload.fileId,
			"protocol": "http",
			"fileTag": "coverEdit"
			},
			{
				"fileId": jsonDataForUpload.fileId,
			"protocol": "http",
			"fileTag": "coverWeb"
			}
		]
	};
	$.ajax({
		method: 'POST',
		url: clientConfig.params.documentApiUrl + 'getFileUrl',
		contentType: "application/json; charset=utf-8",
		dataType: 'json',
		data: JSON.stringify(params),
		success: function(getFileUrlResult){
			getFileUrlResult.map((object, index) => {
			})
		},
		error: function(getFileUrlFail){
		}
	});
}
