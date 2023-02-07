import $ from 'jquery';
import Promise from 'bluebird';

export default function docApi_upload(file, record) {
  return new Promise((resolve, reject) => {
    return getSignature(file, record)
            .done(jsonDataForUpload => uploadToS3(jsonDataForUpload, file))
            .done(resolve)
            .fail(reject)
  })
}

function getSignature (file, record){
  const {
    description = 'no description',
    title = 'no title',
    type = 'image/jpeg',
    extra = {}
  } = record;

	const jsonDataForSig = {
		apnum: "10400",
		pid: "10400",
		contenttype: type,
		contentDisposition: file.name,
		isP: 1,
		extra: extra,
		title: title,
		description: description
	};
	return $.ajax({
		method: 'POST',
		url: 'http://docapi-1217519329.ap-northeast-1.elb.amazonaws.com/docapi/v0/signature',
		contentType: "application/json; charset=utf-8",
		dataType: 'json',
		data: JSON.stringify(jsonDataForSig)
	});
}

function uploadToS3(jsonDataForUpload, file){
  const formData = setFormData(jsonDataForUpload, file);
	return $.ajax({
		method: 'POST',
		url: 'http://docapi-dev-origin.s3.amazonaws.com/',
		processData: false,
		contentType: false,
		data: formData
	});
}

function setFormData(jsonDataForUpload, file) {
  const { objectKey, AWSAccessKeyId, policyDocument, signature } = jsonDataForUpload;
	let formData = new FormData();
	formData.append('key', objectKey);
	formData.append('content-type', 'image/jpeg');
	formData.append('acl', 'authenticated-read');
	formData.append('AWSAccessKeyId', AWSAccessKeyId);
	formData.append('policy', policyDocument);
	formData.append('signature', signature);
	formData.append('file', file);
	formData.append('Content-Disposition', file.name);
  return formData;
}
