const express = require('express');
const { Set, is, fromJS } = require('immutable');
const Ajv = require('ajv');
const uuid = require('uuid/v4');
const honor = express.Router();
const ajv = new Ajv();
const { resTemplate, warnTemplate, errorTemplate } = require('./util');

const schema = {
	type: 'object',
	required: ['honorId', 'title'],
	properties: {
		title: {
			type: 'string',
			maxLength: 200,
			minLength: 1,
		},
		honorId: {
			type: 'string',
		},
	},
};

let state = fromJS([
	{
		pid: 239876,
		honorId: '17ac9989-85a8-4e6a-ae8d-046ecdc9dae3',
		title: '第一筆專案成就',
		description: '克拉克拉',
		startTimestamp: 1525936670060,
		endTimestamp: 1525936670060,
		talentList: null,
		fileId: null,
		createTimestamp: 1530702577476,
		fileUrlMap: null,
	},
	{
		pid: 239876,
		honorId: '2827ef06-aef3-410a-84ce-11014468d15b',
		title: '案案案案',
		description: '迷糊迷糊',
		startTimestamp: 1525936670060,
		endTimestamp: 1525936670060,
		talentList: null,
		fileId: null,
		createTimestamp: 1530702633324,
		fileUrlMap: null,
	},
	{
		pid: 239876,
		honorId: '5120b22f-7d0d-49f2-994a-8128e5abde9d',
		title: '測試專案',
		description: '執行測試專案每年為公司省下一千萬的營業費用',
		startTimestamp: 1525936670060,
		endTimestamp: 1525936670060,
		talentList: ['photoshop', 'java'],
		fileId: '75b9231b9d7a417d8fda69052d42e9fe11',
		createTimestamp: 1531105720252,
		fileUrlMap: {
			w600:
				'//file.doc.104-dev.com.tw/3ab/7cc/388/75b9231b9d7a417d8fda69052d42e9fe11_w600.jpg?AWSAccessKeyId=AKIAJ4TWABFJGTLWFXGA&Expires=2147483647&Signature=7NCHCK7V2N%2Bj63AV7Pl%2FAtFKLy0%3D',
			w960:
				'//file.doc.104-dev.com.tw/3ab/7cc/388/75b9231b9d7a417d8fda69052d42e9fe11_w960.jpg?AWSAccessKeyId=AKIAJ4TWABFJGTLWFXGA&Expires=2147483647&Signature=pXVXuuM0l4TZH09WosL%2BSyl5s2Y%3D',
		},
	},
]);

honor
	.route('/')
	/**
	 * 取得全部專案成就資料
	 * https://c1.plus.104-dev.com.tw/swagger-ui.html#/rest-honor-controller/getHonorUsingGET_1
	 */
	.get((req, res) => {
		res.json(resTemplate(state.toJS()));
	})

	/**
	 * 建立單筆專案成就
	 * https://c1.plus.104-dev.com.tw/swagger-ui.html#/rest-honor-controller/createHonorUsingPOST
	 */
	.post((req, res) => {
		const honorInfo = req.body;
		const honorId = uuid();
		state = state.push(fromJS(Object.assign({}, honorInfo, { honorId })));
		res.json(resTemplate(honorId));
	});

honor
	.route('/:honorId')
	/**
	 * 取得單筆成就資料
	 * https://c1.plus.104-dev.com.tw/swagger-ui.html#/rest-honor-controller/getHonorUsingGET
	 */
	.get((req, res) => {
		const { honorId } = req.params;
		const targetList = state.filter(elm => elm.honorId === honorId);
		if (targetList.size === 1) {
			return res.json(resTemplate(targetList.get(0).toJS()));
		}
		return res.status(500).json(errorTemplate('取得特定 honorId 成就資料失敗'));
	})

	/**
	 * 修改單筆專案成就
	 * https://c1.plus.104-dev.com.tw/swagger-ui.html#/rest-honor-controller/updateHonorUsingPUT
	 */
	.put((req, res) => {
		const { honorId } = req.params;
		const honorInfo = req.body;
		if (!ajv.validateSchema(schema) || !ajv.validate(schema, honorInfo)) {
			return res.status(400).json(warnTemplate(ajv.errorsText()));
		}

		const prvTagIdx = state.findIndex(elm => elm.get('honorId') === honorId);
		if (prvTagIdx === -1) {
			return res.status(404).json(warnTemplate('找不到對應的 tag'));
		}
		state = state.setIn([prvTagIdx], fromJS(honorInfo));
		return res.status(200).json(resTemplate(honorInfo));
	})

	/**
	 * 刪除單筆專案成就
	 * https://c1.plus.104-dev.com.tw/swagger-ui.html#/rest-honor-controller/deleteHonorUsingDELETE
	 */
	.delete((req, res) => {
		const { honorId } = req.params;
		state = state.filter(elm => elm.get('honorId') !== honorId);
		return res.status(204).send();
	});

module.exports = honor;
