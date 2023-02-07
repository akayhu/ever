var request = require('superagent');
var clientConfig = require('src/configs/client');


const s3Domain = 'http://docapi-1217519329.ap-northeast-1.elb.amazonaws.com/';
const s3Bucket = 'docapi-dev-origin';

export function getSignature(callback) {
	let sigURL = s3Domain + 'docapi/rest/services/signature';
	request.post(sigURL)
	.send({
		"contentDisposition":"Penguins.jpg",
		"apnum":"10400",
		"contenttype":"image/jpeg",
		"description":"測試",
		"extra":{"convert":"false", "extraNo": "ab866ga6-7edf-1134-9e3f46bb7d9e03t68"},
		"isP":1,
		"pid":"100080",
		"title":"測試"})
	.set('Accept', 'application/json')
	.end(function(err, res){
		if (err) {
			return err;
		}
		if(callback) callback(res.body);
	});
}

export function docApiUpload( fileInputId, option, callback) {
	var bucket = new AWS.S3({params: {Bucket: s3Bucket}});
	var fileInput = document.getElementById(fileInputId);
	var file = fileInput.files[0];
	if (file) {
		var params = {Key: file.name, ContentType: file.type, Body: file};
		bucket.upload(params, function (err, data) {
			if (err) {

			} else {
				console.log(data);
			}
		});
	} else {
	}
}