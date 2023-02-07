const express = require('express');
const gallery = express.Router();
const { resTemplate, warnTemplate, errorTemplate } = require('./util');
const { fromJS, toJS } = require('immutable');
const uuid = require('uuid/v4');
const Ajv = require('ajv');
const ajv = new Ajv();

const schema = {
	type: 'object',
	required: ['coordinate', 'description', 'fileId', 'title'],
	properties: {
		coordinate: {
			type: 'object',
			required: ['ltx', 'lty', 'rbx', 'rby'],
			properties: {
				ltx: {
					type: 'number',
					minimum: 0,
				},
				lty: {
					type: 'number',
					minimum: 0,
				},
				rbx: {
					type: 'number',
					minimum: 0,
				},
				rby: {
					type: 'number',
					minimum: 0,
				},
			},
		},
		description: {
			type: 'string',
			maxLength: 2000,
		},
		fileId: {
			type: 'string',
			pattern: '[0-9a-f]{34}',
		},
		title: {
			type: 'string',
			minLength: 1,
		},
		galleryId: {
			oneOf: [
				{
					type: 'string',
				},
				{
					type: 'null',
				},
			],
		},
	},
};

let state = fromJS([
	{
		pid: 241676,
		galleryId: '2589eeca-84f8-4e78-a7f2-c044024fec2d',
		title: '測試作品標題',
		description: '測試作品內容',
		fileId: 'd17ee00f5eb44ac5bd65aec6c872372711',
		createTimestamp: 1531822925980,
		coordinate: {
			ltx: 0,
			lty: 0,
			rbx: 0,
			rby: 0,
		},
		fileUrlMap: {
			w600:
				'//file.doc.104-dev.com.tw/e41/03d/44a/d17ee00f5eb44ac5bd65aec6c872372711_w600.png?AWSAccessKeyId=AKIAJ4TWABFJGTLWFXGA&Expires=2147483647&Signature=38LhtEYgIxxqRwQ%2FWo8xYnhdYh0%3D',
			w960:
				'//file.doc.104-dev.com.tw/e41/03d/44a/d17ee00f5eb44ac5bd65aec6c872372711_w960.png?AWSAccessKeyId=AKIAJ4TWABFJGTLWFXGA&Expires=2147483647&Signature=kWYCMSXZAQ3Vac9qhx6zWzbpaVI%3D',
		},
	},
	{
		pid: 241676,
		galleryId: '8eb0456f-301f-4af4-8b09-9866c503934f',
		title: '比稿作品',
		description: '廣告公司比稿作品從一千家廠商中脫穎而出',
		fileId: '75b9231b9d7a417d8fda69052d42e9fe11',
		createTimestamp: 1531822317900,
		coordinate: {
			ltx: 0,
			lty: 0,
			rbx: 0,
			rby: 0,
		},
		fileUrlMap: {
			w600:
				'//file.doc.104-dev.com.tw/3ab/7cc/388/75b9231b9d7a417d8fda69052d42e9fe11_w600.jpg?AWSAccessKeyId=AKIAJ4TWABFJGTLWFXGA&Expires=2147483647&Signature=7NCHCK7V2N%2Bj63AV7Pl%2FAtFKLy0%3D',
			w960:
				'//file.doc.104-dev.com.tw/3ab/7cc/388/75b9231b9d7a417d8fda69052d42e9fe11_w960.jpg?AWSAccessKeyId=AKIAJ4TWABFJGTLWFXGA&Expires=2147483647&Signature=pXVXuuM0l4TZH09WosL%2BSyl5s2Y%3D',
		},
	},
]);

gallery
	.route('/')
	/**
	 * 取得全部作品資料
	 * https://c1.plus.104-dev.com.tw/swagger-ui.html#/rest-gallery-controller/getGalleryUsingGET_1
	 */
	.get((req, res) => {
		res.status(200).json(resTemplate(state.toJS()));
	})

	/**
	 * 建立作品
	 * https://c1.plus.104-dev.com.tw/swagger-ui.html#/rest-gallery-controller/createGalleryUsingPOST
	 */
	.post((req, res) => {
		const galleryInfo = req.body;
		if (!ajv.validateSchema(schema) || !ajv.validate(schema, galleryInfo)) {
			return res.status(400).json(warnTemplate(ajv.errorsText()));
		}
		// 不論內容是否重複，都新建一筆
		const galleryId = uuid();
		state = state.push(fromJS(Object.assign({}, galleryInfo, { galleryId })));
		return res.status(201).json(resTemplate(galleryId));
	});

gallery
	.route('/:galleryId')
	/**
	 * 取得單筆作品資料
	 * https://c1.plus.104-dev.com.tw/swagger-ui.html#/rest-gallery-controller/getGalleryUsingGET
	 */
	.get((req, res) => {
		const { galleryId } = req.params;
		const prvIdx = state.findIndex(elm => elm.get('galleryId') === galleryId);
		if (prvIdx === -1) {
			return res.status(404).json(warnTemplate('找不到對應的 galleryId'));
		}
		res.json(resTemplate(state.get(prvIdx).toJS()));
	})

	/**
	 * 修改作品
	 * https://c1.plus.104-dev.com.tw/swagger-ui.html#/rest-gallery-controller/updateGalleryUsingPUT
	 */
	.put((req, res) => {
		const { galleryId } = req.params;
		const galleryInfo = req.body;
		if (!ajv.validateSchema(schema) || !ajv.validate(schema, galleryInfo)) {
			return res.status(400).json(warnTemplate(ajv.errorsText()));
		}

		const prvIdx = state.findIndex(elm => elm.get('galleryId') === galleryId);
		if (prvIdx === -1) {
			return res.status(404).json(warnTemplate('找不到對應的 galleryId'));
		}
		state = state.setIn([prvIdx], fromJS(galleryInfo));
		return res.status(200).json(resTemplate(galleryInfo));
	})

	/**
	 * 刪除一筆作品
	 * https://c1.plus.104-dev.com.tw/swagger-ui.html#/rest-gallery-controller/deleteGalleryUsingDELETE
	 */
	.delete((req, res) => {
		const { galleryId } = req.params;
		state = state.filter(elm => elm.get('galleryId') !== galleryId);
		res.status(204).json();
	});

module.exports = gallery;
