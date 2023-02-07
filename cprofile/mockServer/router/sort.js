const express = require('express');
const { fromJS } = require('immutable');
const { resTemplate, warnTemplate, errorTemplate } = require('./util');
const sort = express.Router();

let state = fromJS({
	BLOCK: {
		pid: 239876,
		type: 'BLOCK',
		// TODO: 新版，只存 id 但 templateType 尚未決定要存哪裡
		sortList: [
			'b487bf37-5b79-4f5b-a9e6-87bc889d2aef',
			'67f49a93-755d-43e0-a51e-6e94dfa00d95' /*, "ABC9478"*/,
		],
	},
	HONOR: {
		pid: 239876,
		type: 'HONOR',
		sortList: ['fpfpfp121212'],
	},
	TALENT: {
		pid: 239876,
		type: 'TALENT',
		sortList: [
			'asdaqw12321-asfa-1231-00090sf0aufoajlsdnfg',
			'909090f-4444-0000-sdkgbsdlkfjbsldj',
			'9898dkbsdkl-asfa-bbbb-ppppopopopop',
			'0kkkkkkk-vvvv-gggg-sljgnlsdjqqqqqqif',
		],
	},
	GALLERY: {
		pid: 239876,
		type: 'GALLERY',
		sortList: ['ABC9478'],
	},
});

sort
	.route('/:type')
	/**
	 * 取得 sort API 列表
	 * https://c1.plus.104-dev.com.tw/swagger-ui.html#/rest-sort-controller/getBlockUsingGET
	 */
	.get((req, res) => {
		const { type } = req.params;
		res.json(resTemplate(state.get(type).toJS()));
	})
	/**
	 * 寫入 sort API
	 * https://c1.plus.104-dev.com.tw/swagger-ui.html#/rest-sort-controller/putBlockUsingPUT
	 */
	.put((req, res) => {
		const { type, pid, sortList } = req.body;
		state = state.setIn([type, 'sortList'], fromJS(sortList));
		res.json(resTemplate(state.get(type).toJS()));
	});

module.exports = sort;
