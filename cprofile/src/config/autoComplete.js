/**
 * 自動完成字詞設定檔
 */

// 公司名稱
const companyName = {
	endpoint: 'company',
	key: 'invoice',
	value: 'name',
	freeKeyItem: {
		enable: true,
		text: '新增「value」這間公司',
		title: '補充公司完整資訊',
	},
	freeKeySchema: {
		type: 'object',
		required: ['companyName'],
		properties: {
      // 公司名稱
      companyName: {
				type: 'string',
				minLength: 1,
      },
		},
	},
};

// 職稱
const jobTitle = {
	endpoint: 'job-title',
	key: 'id',
	value: 'job_title',
	freeKeyItem: {
		enable: false,
		text: '新增「value」這個職務',
		title: '新增職稱',
	},
	freeKeySchema: {},
};

// 技能
const ability = {
	endpoint: 'ability',
	key: 'fun_descript',
	value: 'fun_descript',
	freeKeyItem: {
		enable: false,
		text: '新增「value」這個技能',
		title: '新增技能',
	},
	freeKeySchema: {},
};

// 學校
const schoolName = {
	endpoint: 'school',
	key: 'sid',
	value: 'u_name',
	freeKeyItem: {
		enable: false,
		text: '新增「value」這間學校',
		title: '新增學校',
	},
	freeKeySchema: {},
};

// 科系
const major = {
	endpoint: 'major',
	key: 'mid',
	value: 'eduname',
	freeKeyItem: {
		enable: false,
		text: '新增「value」這間科系',
		title: '新增科系',
	},
	freeKeySchema: {},
};

const setting = {
	companyName,
	jobTitle,
	ability,
	schoolName,
	major,
};

export default setting;
