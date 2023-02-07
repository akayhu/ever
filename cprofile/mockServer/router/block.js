const express = require('express');
const { fromJS } = require('immutable');
const uuid = require('uuid/v4');
const { resTemplate, warnTemplate, errorTemplate } = require('./util');
const block = express.Router();

let state = fromJS([
	{
		blockId: 'b487bf37-5b79-4f5b-a9e6-87bc889d2aef',
		type: 'basic',
		template: 'new',
		visibility: true,
	},
	{
		blockId: 'e230da09-1a3c-4a12-ac91-9c87e1e0d271',
		type: 'honor',
		template: 'new',
		visibility: false,
	},
	{
		blockId: '2c37735b-4600-4aed-a7b9-57ad66025767',
		type: 'experience',
		template: 'def',
		visibility: false,
	},
	{
		blockId: 'c764478b-8be9-4817-a715-f7bebdd5f914',
		type: 'talent',
		template: 'def',
		visibility: false,
	},
	{
		blockId: '299d21dc-ae43-4c65-9780-340b06872611',
		type: 'gallery',
		template: 'def',
		visibility: false,
	},
	// {
	//   blockId: '67f49a93-755d-43e0-a51e-6e94dfa00d95',
	//   type: 'custom',
	//   template: 'new',
	//   visibility: true,
	// },
	// {
	//   blockId: 'cc67b3ea-df61-4415-ae72-4cd4c38d7966',
	//   type: 'custom',
	//   template: 'def',
	//   visibility: false,
	// },
]);

block
	.route('/')
	/**
	 * 取得全部區塊
	 * https://c1.plus.104-dev.com.tw/swagger-ui.html#/rest-block-controller/listUsingGET
	 */
	.get((req, res) => {
		res.json(resTemplate(state.toJS()));
	})

	/**
	 * 建立區塊
	 * https://c1.plus.104-dev.com.tw/swagger-ui.html#/rest-block-controller/createUsingPOST
	 */
	.post((req, res) => {
		const blockInfo = req.body;
		state = state.push(fromJS(blockInfo));
		res.json(resTemplate(blockInfo.blockId));
	});

block
	.route('/:blockId')
	/**
	 * 取得區塊資料
	 * https://c1.plus.104-dev.com.tw/swagger-ui.html#/rest-block-controller/getBlockUsingGET
	 */
	.get((req, res) => {
		const { blockId } = req.params;
		const targetList = state.filter(elm => elm.get('blockId') === blockId);
		if (targetList.size === 1) {
			return res.json(resTemplate(targetList.get(0).toJS()));
		}
		if (targetList.size === 0) {
			return res.status(404).json(warnTemplate('找不到特定 blockId 區塊資料'));
		}
		return res.status(500).json(errorTemplate('取得特定 blockId 區塊資料失敗'));
	})

	/**
	 * 修改區塊資料
	 * https://c1.plus.104-dev.com.tw/swagger-ui.html#/rest-block-controller/updateUsingPUT
	 */
	.put((req, res) => {
		const { blockId } = req.params;
		const blockInfo = req.body;
		const targetList = state.filter(elm => elm.get('blockId') === blockId);
		if (targetList.size === 1) {
			state = state.map(elm =>
				elm.get('blockId') === blockInfo.blockId ? fromJS(blockInfo) : elm
			);
			return res.json(resTemplate(blockInfo));
		}
		if (targetList.size === 0) {
			return res.status(404).json(warnTemplate('找不到特定 blockId 區塊資料'));
		}
		return res.status(400).json(errorTemplate('更新特定 blockId 區塊資料失敗'));
	})

	/**
	 * 刪除區塊
	 * https://c1.plus.104-dev.com.tw/swagger-ui.html#/rest-block-controller/deleteUsingDELETE
	 */
	.delete((req, res) => {
		const { blockId } = req.params;
		state = state.filter(elm => elm.get('blockId') !== blockId);
		return res.status(204).send();
	});

module.exports = block;
