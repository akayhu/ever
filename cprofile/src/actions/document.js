import { RSAA } from 'redux-api-middleware';
import generalConfig from 'config/general';
import { logout } from 'actions/user';

// 建立並取得檔案上傳簽章
export const REQUEST_DOCUMENT_SIGNATURE = 'REQUEST_DOCUMENT_SIGNATURE';
export const RECIEVE_DOCUMENT_SIGNATURE = 'RECIEVE_DOCUMENT_SIGNATURE';
export const FAILURE_DOCUMENT_SIGNATURE = 'FAILURE_DOCUMENT_SIGNATURE';
export const requestDocumentSignature = param => ({
	[RSAA]: {
		endpoint: `${generalConfig.api}/document/signature`,
		types: [
			REQUEST_DOCUMENT_SIGNATURE,
			RECIEVE_DOCUMENT_SIGNATURE,
			FAILURE_DOCUMENT_SIGNATURE,
		],
		method: 'post',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(param),
		credentials: 'include',
		error: (response, json) =>
			[401, 403].includes(response.status) ? logout() : undefined,
	},
});

// 上傳當案到 S3 需要的參數
export const REQUEST_DOCUMENT_UPLOAD = 'REQUEST_DOCUMENT_UPLOAD';
export const RECIEVE_DOCUMENT_UPLOAD = 'RECIEVE_DOCUMENT_UPLOAD';
export const FAILURE_DOCUMENT_UPLOAD = 'FAILURE_DOCUMENT_UPLOAD';
export const uploadToS3 = (file, signature) => {
	let formData = new FormData();
	formData.append('key', signature.objectKey); // 第1步驟回傳參數 objectKey
	formData.append('content-type', file.type); // 檔案 content-type
	formData.append('acl', signature.acl); // 第1步驟回傳參數 acl
	formData.append('X-Amz-Credential', signature.xAmzCredential); // 第1步驟回傳參數 xAmzCredential
	formData.append('X-Amz-Algorithm', signature.xAmzAlgorithm); // 第1步驟回傳參數 xAmzAlgorithm
	formData.append('X-Amz-Date', signature.xAmzDate); // 第1步驟回傳參數 xAmzDate
	formData.append('policy', signature.policyDocument); // 第1步驟回傳參數 policyDocument
	formData.append('X-Amz-Signature', signature.signature); // 第1步驟回傳參數 signature
	formData.append('file', file);
	return {
		[RSAA]: {
			endpoint: `${generalConfig.s3}`,
			types: [
				REQUEST_DOCUMENT_UPLOAD,
				RECIEVE_DOCUMENT_UPLOAD,
				FAILURE_DOCUMENT_UPLOAD,
			],
			method: 'post',
			body: formData,
			error: (response, json) =>
				[401, 403].includes(response.status) ? logout() : undefined,
		},
	};
};

// 重轉檔案
export const REQUEST_DOCUMENT_RECONVERT = 'REQUEST_DOCUMENT_RECONVERT';
export const RECIEVE_DOCUMENT_RECONVERT = 'RECIEVE_DOCUMENT_RECONVERT';
export const FAILURE_DOCUMENT_RECONVERT = 'FAILURE_DOCUMENT_RECONVERT';
export const requestDocumentReConvert = param => ({
	[RSAA]: {
		endpoint: `${generalConfig.api}/document/${param.fileId}`,
		types: [
			REQUEST_DOCUMENT_RECONVERT,
			RECIEVE_DOCUMENT_RECONVERT,
			FAILURE_DOCUMENT_RECONVERT,
		],
		method: 'put',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(param),
		credentials: 'include',
		error: (response, json) =>
			[401, 403].includes(response.status) ? logout() : undefined,
	},
});

// 取得檔案位置
export const REQUEST_DOCUMENT_URL = 'REQUEST_DOCUMENT_URL';
export const RECIEVE_DOCUMENT_URL = 'RECIEVE_DOCUMENT_URL';
export const FAILURE_DOCUMENT_URL = 'FAILURE_DOCUMENT_URL';
export const requestDocumentUrl = (param, actionType) => {
	return {
		[RSAA]: {
			endpoint: `${generalConfig.api}/document/file-url/${encodeURIComponent(
				JSON.stringify(param.getFileArr)
			)}`,
			types: actionType || [
				REQUEST_DOCUMENT_URL,
				RECIEVE_DOCUMENT_URL,
				FAILURE_DOCUMENT_URL,
			],
			method: 'get',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include',
		},
	};
};

// 取得檔案位置(全部資料)
export const REQUEST_DOCUMENT_ARRAY_URL = 'REQUEST_DOCUMENT_ARRAY_URL';
export const RECIEVE_DOCUMENT_ARRAY_URL = 'RECIEVE_DOCUMENT_ARRAY_URL';
export const FAILURE_DOCUMENT_ARRAY_URL = 'FAILURE_DOCUMENT_ARRAY_URL';
export const requestDocumentArrayUrl = param => {
	return {
		[RSAA]: {
			endpoint: `${generalConfig.api}/document/file-url/${param.fileId}/${
				param.convertType
			}`,
			types: [
				REQUEST_DOCUMENT_ARRAY_URL,
				RECIEVE_DOCUMENT_ARRAY_URL,
				FAILURE_DOCUMENT_ARRAY_URL,
			],
			method: 'get',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include',
		},
	};
};

export const UPLOAD_CROPPED_IMAGE = 'UPLOAD_CROPPED_IMAGE';
export const uploadCroppedImage = (file, payload) => ({
	type: UPLOAD_CROPPED_IMAGE,
	file,
	payload,
});

export const FETCH_PREVIEW_FILE = 'FETCH_PREVIEW_FILE';
export const fetchPreviewFile = (fileId, payload) => ({
	type: FETCH_PREVIEW_FILE,
	fileId,
	payload,
});
