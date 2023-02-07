const express = require('express');
const { Set, is, fromJS } = require('immutable');
const yn = require('yn');
const Ajv = require('ajv');
const { resTemplate, warnTemplate, errorTemplate, uuid } = require('./util');

const {
	MOCK_AUTH_AND_INITIAL_API,
	MOCK_USER_BASIC_API,
	MOCK_USER_EDUCATION_API,
	MOCK_USER_EXPERIENCE_API,
	MOCK_ALL_API,
} = process.env;
const ajv = new Ajv();
const user = express.Router();

// const pagingModel = (list = [], limit = 10, offset = 0) => ({
//   dataList: list.slice(offset, (offset + limit - 1)),
//   hasNext: (offset + limit) < list.length,
//   offset,
//   total: list.length,
// });

let basicState = fromJS({
	avatarCoordinate: {
		ltx: 0,
		lty: 0,
		rbx: 0,
		rby: 0,
	},
	avatarFileId: 'bab45e2a0ce940488888a7504e39697e11',
	avatarWebUrl: '',
	coverCoordinate: {
		ltx: 0,
		lty: 0,
		rbx: 0,
		rby: 0,
	},
	coverFileId: '61a345df1a0547819192ce541762389211',
	organization: '一零四資訊科技公司',
	title: 'Web Designer',
	location: '新北市新店區',
	socialNetwork: {
		fb: '',
		ig: '',
	},
	introduction: `一零四資訊科技公司。主要業務為雲端服務之研發、營運與行銷。在這裡的工作職務為 UI  Designer，除負責公司網頁維護設計外，主要工作在於設計軟體與行動裝置（包括手機與平板電腦）的使用流程與介面設計。`,
	userName: '郝正梅',
	pid: 239678,
});
const uuidv4 = require('uuid/v4');

const expSchema = {
	type: 'object',
	required: [
		'companyName',
		'description',
		'endMonth',
		'endYear',
		'jobName',
		'location',
		'startMonth',
		'startYear',
		'status',
		'talentList',
	],
	properties: {
		companyName: {
			type: 'string',
			maxLength: 100,
			minLength: 1,
		},
		jobName: {
			type: 'string',
			maxLength: 100,
		},
		endMonth: {
			oneOf: [
				{
					type: 'integer',
					maximum: 12,
					minimum: 1,
				},
				{
					type: 'null',
				},
			],
		},
		endYear: {
			oneOf: [
				{
					type: 'integer',
					maximum: 9999,
					minimum: 1911,
				},
				{
					type: 'null',
				},
			],
		},
		startMonth: {
			type: 'integer',
			maximum: 12,
			minimum: 1,
		},
		startYear: {
			type: 'integer',
			maximum: 9999,
			minimum: 1911,
		},
		description: {
			type: 'string',
			maxLength: 2000,
		},
		location: {
			type: 'string',
			maxLength: 200,
		},
		status: {
			enum: [0, 1],
		},
		talentList: {
			oneOf: [
				{
					type: 'null',
				},
				{
					type: 'array',
					items: { type: 'string' },
				},
			],
		},
	},
};

let expState = fromJS([
	{
		companyName: '中華電信',
		createDate: Date.now(),
		description: '苦命的工程師',
		endMonth: 12,
		endYear: 2017,
		expId: 'asdasdasd-asdasdas-asdasd-asdasd',
		jobName: '資安管理師',
		location: '桃園楊梅',
		pid: 239876,
		startMonth: 1,
		startYear: 2016,
		status: 0,
		statusDesc: 'string',
		talentList: ['OWAPS TOP 10'],
		updateDate: Date.now(),
	},
]);

if (yn(MOCK_AUTH_AND_INITIAL_API) || yn(MOCK_ALL_API)) {
	/**
	 * profile 初始化
	 * https://c1.profile.104-dev.com.tw/swagger-ui.html#/rest-user-controller/initBasicUsingPOST
	 */
	user.post('/users/:pid/initial', (req, res) => {
		// 啟用成功
		global.initial = true;
		res.status(201).json(resTemplate(true));

		// 啟用失敗
		// res.status(500).json(errorTemplate('啟用失敗'));
	});

	/**
	 * 檢查匯入來源是否有資料
	 * https://c1.profile.104-dev.com.tw/swagger-ui.html#/rest-importer-controller/hasDataUsingGET
	 */
	user.get('/users/:pid/import', (req, res) => {
		setTimeout(() => {
			res.json(resTemplate({ my104: false, plus: false }));
		}, 3000);
	});

	/**
	 * 取得匯入區塊資訊
	 * https://c1.profile.104-dev.com.tw/swagger-ui.html#/rest-importer-controller/getBlockInfoUsingGET
	 */
	user
		.route('/users/:pid/import/:source')
		.all((req, res, next) => {
			const allowServices = fromJS(['my104', 'plus']);
			const serviceName = req.params.source;
			allowServices.includes(serviceName)
				? next()
				: res.status(404).json(warnTemplate('找不到特定服務資料'));
		})
		.get((req, res) => {
			const model = {
				basic: {
					hasData: true,
					exists: true,
				},
				experience: {
					hasData: true,
					exists: true,
				},
				education: {
					hasData: true,
					exists: false,
				},
				honor: {
					hasData: true,
					exists: true,
				},
				talent: {
					hasData: false,
					exists: true,
				},
				gallery: {
					hasData: true,
					exists: true,
				},
				github: {
					hasData: false,
					exists: false,
				},
				behance: {
					hasData: false,
					exists: false,
				},
			};
			setTimeout(() => {
				res.json(resTemplate(model));
			}, 3000);
		})

		/**
		 * 匯入資料
		 * https://c1.profile.104-dev.com.tw/swagger-ui.html#/rest-importer-controller/importDataUsingPOST
		 */
		.post((req, res) => {
			const blockModels = fromJS([
				{
					blockId: 'b487bf37-5b79-4f5b-a9e6-87bc889d2aef',
					type: 'basic',
					template: 'new',
					visibility: true,
					success: true,
				},
				{
					blockId: 'e230da09-1a3c-4a12-ac91-9c87e1e0d271',
					type: 'honor',
					template: 'new',
					visibility: false,
					success: true,
				},
				{
					blockId: '2c37735b-4600-4aed-a7b9-57ad66025767',
					type: 'experience',
					template: 'def',
					visibility: false,
					success: true,
				},
				{
					blockId: 'c764478b-8be9-4817-a715-f7bebdd5f914',
					type: 'talent',
					template: 'def',
					visibility: false,
					success: true,
				},
				{
					blockId: '299d21dc-ae43-4c65-9780-340b06872611',
					type: 'gallery',
					template: 'def',
					visibility: false,
					success: true,
				},
			]);
			const selectedBlocks = fromJS(req.body) || fromJS([]);
			const model = blockModels.filter(block =>
				selectedBlocks.includes(block.get('type'))
			);
			setTimeout(() => {
				res.json(resTemplate(model));
			}, 5000);
		});
}

if (yn(MOCK_USER_BASIC_API) || yn(MOCK_ALL_API)) {
	/**
	 * 取得使用者 AC 名稱
	 * https://c1.profile.104-dev.com.tw/swagger-ui.html#/rest-member-controller/getMemberUsingGET
	 */
	user.get('/member', (req, res, next) => {
		return !req.cookies.PI
			? res.status(401).json(warnTemplate('無效登入'))
			: res.json(resTemplate({ userName: basicState.get('userName') }));
	});

	user
		.route('/users/:pid/basic')
		/**
		 * 取得 basic 資料
		 * https://c1.profile.104-dev.com.tw/swagger-ui.html#/rest-user-controller/getBasicUsingGET
		 */
		.get((req, res) => {
			// 成功回應
			res.json(
				resTemplate(
					Object.assign({}, basicState.toJS(), { pid: req.cookies.PI })
				)
			);
		})

		/**
		 * 修改 basic
		 * https://c1.profile.104-dev.com.tw/swagger-ui.html#/rest-user-controller/updateBasicUsingPUT
		 */
		.put((req, res) => {
			const basicInfo = req.body;
			basicState = fromJS(basicInfo);
			// 修改成功 (data model 沒有缺)
			return res.json(resTemplate(basicState.toJS()));
		});
}

if (yn(MOCK_USER_EDUCATION_API) || yn(MOCK_ALL_API)) {
	user
		.route('/users/:pid/educations')
		/**
		 * 取得學歷資料
		 * https://c1.profile.104-dev.com.tw/swagger-ui.html#/rest-user-controller/getEducationListUsingGET
		 */
		.get((req, res) => {
			// 成功回應
			res.status(501).json(errorTemplate('這個 Mock URI 尚未實作'));
		})

		/**
		 * 建立 education
		 * https://c1.profile.104-dev.com.tw/swagger-ui.html#/rest-user-controller/createEduUsingPOST
		 */
		.post((req, res) => {
			res.status(501).json(errorTemplate('這個 Mock URI 尚未實作'));
		});

	user
		.route('/users/:pid/educations/:eduId')
		/**
		 * 修改 education
		 * https://c1.profile.104-dev.com.tw/swagger-ui.html#/rest-user-controller/updateEduUsingPUT
		 */
		.put((req, res) => {
			res.status(501).json(errorTemplate('這個 Mock URI 尚未實作'));
		})

		/**
		 * 刪除 education
		 * https://c1.profile.104-dev.com.tw/swagger-ui.html#/rest-user-controller/deleteEduUsingDELETE
		 */
		.delete((req, res) => {
			res.status(501).json(errorTemplate('這個 Mock URI 尚未實作'));
		});
}

if (yn(MOCK_USER_EXPERIENCE_API) || yn(MOCK_ALL_API)) {
	user
		.route('/users/:pid/experiences')
		/**
		 * 取得經歷資料
		 * https://c1.profile.104-dev.com.tw/swagger-ui.html#/rest-user-controller/getExperienceListUsingGET
		 */
		.get((req, res) => {
			// 成功回應
			res.json(resTemplate(expState.toJS()));
		})

		/**
		 * 建立 experience
		 * https://c1.profile.104-dev.com.tw/swagger-ui.html#/rest-user-controller/createExperienceUsingPOST
		 */
		.post((req, res) => {
			const expInfo = req.body;
			if (!ajv.validateSchema(expSchema) || !ajv.validate(expSchema, expInfo)) {
				return res.status(400).json(warnTemplate(ajv.errorsText()));
			}
			// 不論內容是否重複，都新建一筆
			const expId = uuid();
			expState = expState.push(fromJS(Object.assign({}, expInfo, { expId })));
			return res.status(201).json(resTemplate(expId));
		});

	user
		.route('/users/:pid/experiences/:expId')
		/**
		 * 修改 experience
		 * https://c1.profile.104-dev.com.tw/swagger-ui.html#/rest-user-controller/updateExperienceUsingPUT
		 */
		.put((req, res) => {
			const { expId } = req.params;
			const expInfo = req.body;
			if (!ajv.validateSchema(expSchema) || !ajv.validate(expSchema, expInfo)) {
				return res.status(400).json(warnTemplate(ajv.errorsText()));
			}
			const prvTagIdx = expState.findIndex(elm => elm.get('expId') === expId);
			if (prvTagIdx === -1) {
				return res.status(404).json(warnTemplate('找不到對應的 expId'));
			}
			expState = expState.setIn([prvTagIdx], fromJS(expInfo));
			return res.status(200).json(resTemplate(expInfo));
		})

		/**
		 * 刪除 experience
		 * https://c1.profile.104-dev.com.tw/swagger-ui.html#/rest-user-controller/deleteExperienceUsingDELETE
		 */
		.delete((req, res) => {
			const { expId } = req.params;
			expState = expState.filter(elm => elm.get('expId') !== expId);
			res.status(204).json();
		});
}

module.exports = user;
