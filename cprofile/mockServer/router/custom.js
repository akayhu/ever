const express = require('express');
const { fromJS } = require('immutable');
const uuid = require('uuid/v4');
const custom = express.Router();
const { resTemplate, warnTemplate, errorTemplate } = require('./util');

let state = fromJS([
	{
		description: '測試區塊 1 內文',
		fid: null,
		title: '測試區塊 1 標題',
		customId: 'ABC9478',
		pid: 239876,
	},
	{
		description: '測試區塊 2 內文',
		fid: null,
		title: '測試區塊 2 標題',
		customId: 'DEF9499',
		pid: 239876,
	},
]);

custom
	.route('/')
	/**
	 * 取得客製化內容列表
	 * https://c1.plus.104-dev.com.tw/swagger-ui.html#/rest-custom-controller/getCustomListUsingGET
	 */
	.get((req, res) => {
		res.json(resTemplate(state.toJS()));
	})

	/**
	 * 建立單筆客製化內容
	 * https://c1.plus.104-dev.com.tw/swagger-ui.html#/rest-custom-controller/createCustomUsingPOST
	 */
	.post((req, res) => {
		const customInfo = req.body;
		state = state.push(fromJS(customInfo));

		// 成功回應
		res.status(201).json(resTemplate(customInfo.customId));

		// 失敗回應
		// res.status(500).json(errorTemplate('新增客製化區塊失敗'));
	});

custom
	.route('/:customId')
	/**
	 * 取得單筆客製化內容
	 * https://c1.plus.104-dev.com.tw/swagger-ui.html#/rest-custom-controller/getCustomUsingGET
	 */
	.get((req, res) => {
		const { customId } = req.params;
		const prvCustomIdx = state.findIndex(
			elm => elm.get('customId') === customId
		);
		if (prvCustomIdx === -1) {
			return res.status(404).json(warnTemplate('找不到對應的 customId'));
		}
		res.json(resTemplate(state.get(prvCustomIdx).toJS()));
	})

	/**
	 * 修改單筆客製化內容
	 * https://c1.plus.104-dev.com.tw/swagger-ui.html#/rest-custom-controller/updateCustomUsingPUT
	 */
	.put((req, res) => {
		const { customId } = req.params;
		const customInfo = req.body;
		const prvIdx = state.findIndex(elm => elm.get('customId') === customId);
		if (prvIdx === -1) {
			return res.status(404).json(warnTemplate('找不到對應的 customId'));
		}
		state = state.setIn([prvIdx], fromJS(customInfo));
		return res.json(resTemplate(customInfo));
	})

	/**
	 * 刪除單筆客製化內容
	 * https://c1.plus.104-dev.com.tw/swagger-ui.html#/rest-custom-controller/deleteCustomUsingDELETE
	 */
	.delete((req, res) => {
		const { customId } = req.params;
		state = state.filter(block => block.customId !== customId);
		res.status(204);
	});

module.exports = custom;
