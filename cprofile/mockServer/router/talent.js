const express = require('express');
const { fromJS } = require('immutable');
const uuid = require('uuid/v4');
const { resTemplate, warnTemplate, errorTemplate } = require('./util');
const Ajv = require('ajv');
const ajv = new Ajv();
const talent = express.Router();

const schema = {
	type: 'object',
	required: ['description', 'grade', 'tag', 'tagId'],
	properties: {
		tag: {
			type: 'string',
			maxLength: 100,
			minLength: 1,
		},
		description: {
			type: 'string',
			maxLength: 400,
		},
		grade: {
			enum: [null, 1, 2, 3, 4, 5],
		},
		tagId: {
			type: 'string',
		},
	},
};

let state = fromJS([
	{
		tag: 'photoshop',
		description: '一年的 PhotoShop 經驗',
		grade: 3,
		tagId: 'asdaqw12321-asfa-1231-00090sf0aufoajlsdnfg',
	},
	{
		tag: 'illustrator',
		description: '我會拉向量圖喔喔',
		grade: 2,
		tagId: '909090f-4444-0000-sdkgbsdlkfjbsldj',
	},
	{
		tag: 'maya',
		description: '近乎神技的 3 小時 3D 建模速度',
		grade: 5,
		tagId: '9898dkbsdkl-asfa-bbbb-ppppopopopop',
	},
	{
		tag: 'autocad',
		description: '偶爾畫畫建築物也不錯',
		grade: 0,
		tagId: '0kkkkkkk-vvvv-gggg-sljgnlsdjqqqqqqif',
	},
]);

talent
	.route('/')
	/**
	 * 取得專長技能列表
	 * https://c1.plus.104-dev.com.tw/swagger-ui.html#/rest-talent-controller/getTalentListUsingGET
	 */
	.get((req, res) => res.json(resTemplate(state.toJS())))

	/**
	 * 寫入專長技能資料
	 * https://c1.plus.104-dev.com.tw/swagger-ui.html#/rest-talent-controller/saveTalentUsingPOST
	 */
	.post((req, res) => {
		const talentInfo = req.body;
		if (!ajv.validateSchema(schema) || !ajv.validate(schema, talentInfo)) {
			return res.status(400).json(warnTemplate(ajv.errorsText()));
		}
		// 不論 tag 內容是否重複，都新建一筆
		const tagId = uuid();
		state = state.push(fromJS(Object.assign({}, talentInfo, { tagId })));
		return res.status(201).json(resTemplate(tagId));
	});

talent
	.route('/:tagId')
	/**
	 * 修改專長技能資料
	 * https://c1.plus.104-dev.com.tw/swagger-ui.html#/rest-talent-controller/updateTalentUsingPUT
	 */
	.put((req, res) => {
		const { tagId } = req.params;
		const talentInfo = req.body;
		if (!ajv.validateSchema(schema) || !ajv.validate(schema, talentInfo)) {
			return res.status(400).json(warnTemplate(ajv.errorsText()));
		}

		const prvTagIdx = state.findIndex(elm => elm.get('tagId') === tagId);
		if (prvTagIdx === -1) {
			return res.status(404).json(warnTemplate('找不到對應的 tag'));
		}
		state = state.setIn([prvTagIdx], fromJS(talentInfo));
		return res.status(200).json(resTemplate(talentInfo));
	})

	/**
	 * 刪除專長技能資料
	 * https://c1.plus.104-dev.com.tw/swagger-ui.html#/rest-talent-controller/deleteTalentUsingDELETE
	 */
	.delete((req, res) => {
		const { tagId } = req.params;
		state = state.filter(elm => elm.get('tagId') !== tagId);
		res.status(204).json();
	});

module.exports = talent;
