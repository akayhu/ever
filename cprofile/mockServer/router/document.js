const express = require('express');
const { resTemplate, warnTemplate, errorTemplate } = require('./util');
const document = express.Router();

/**
 * 取得檔案位置
 * https://c1.plus.104-dev.com.tw/swagger-ui.html#/rest-document-controller/getFileUrlUsingGET
 */
document.get('/file-url/:fileArr', (req, res) => {
	res.status(501).json(errorTemplate('這個 Mock URI 尚未實作'));
});

/**
 * 建立並取得檔案上傳簽章
 * https://c1.plus.104-dev.com.tw/swagger-ui.html#/rest-document-controller/signatureUsingPOST
 */
document.post('signature', (req, res) => {
	res.status(501).json(errorTemplate('這個 Mock URI 尚未實作'));
});

module.exports = document;
