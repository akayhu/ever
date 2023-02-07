/**
 * 各區塊必填欄位檢查的 schema
 */

// 基本資料
const basic = {
  type: 'object',
  required: ['userName'],
  properties: {
    userName: {
      type: 'string',
      maxLength: 50,
      minLength: 1,
    },
    introduction: {
      type: 'string',
      maxLength: 1500,
      oneOf: [
        {
          type: 'string',
          maxLength: 1500,
        },
        {
          type: 'null',
        },
      ],
    },
    organization: {
      type: 'string',
      maxLength: 100,
      oneOf: [
        {
          type: 'string',
          maxLength: 100,
        },
        {
          type: 'null',
        },
      ],
    },
    title: {
      type: 'string',
      maxLength: 100,
      oneOf: [
        {
          type: 'string',
          maxLength: 100,
        },
        {
          type: 'null',
        },
      ],
    },
    // location: {
    //   type: 'string',
    //   maxLength: 100,
    //   oneOf: [
    //     {
    //       type: 'string',
    //       maxLength: 100,
    //     },
    //     {
    //       type: 'null',
    //     },
    //   ],
    // },
  },
}

/* 經歷 
companyName, jobName 的 
maxLength 公司名稱跟職稱要設定一樣,這樣 ajv error 的提示文字才會一致
*/
const experience = {
  type: 'object',
  required: [
    'companyName',
    'jobName',
    'status',
  ],
  properties: {
    companyName: {
      type: 'string',
      maxLength: 150,
      minLength: 1,
    },
    jobName: {
      type: 'string',
      maxLength: 150,
      minLength:1
    },
    endMonth: {
      oneOf: [
        {
          type: 'integer',
          maximum: 12,
          minimum: 0,
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
          // minimum: 1911,
        },
        {
          type: 'null',
        },
      ],
    },
    startMonth: {
      oneOf: [
        {
          type: 'integer',
          maximum: 12,
          minimum: 0,
        },
        {
          type: 'null',
        },
      ],
    },
    startYear: {
      oneOf: [
        {
          type: 'integer',
          maximum: 9999,
          // minimum: 1911,
        },
        {
          type: 'null',
        },
      ],

    },
    description: {
      type: 'string',
      maxLength: 1000,
      oneOf: [
        {
          type: 'string',
          maxLength: 1000,
        },
        {
          type: 'null',
        },
      ]
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

/* 學歷
majorName, schoolName 的 
maxLength 公司名稱跟職稱要設定一樣,這樣 ajv error 的提示文字才會一致
*/
const education = {
  type: 'object',
  required: ['majorName', 'schoolName', 'degree'],
  properties: {
    majorName: {
      type: 'string',
      maxLength: 100,
      minLength: 1,
    },
    schoolName: {
      type: 'string',
      maxLength: 100,
      minLength: 1,
    },
    degree: {
      type: 'integer',
      minimum: 1,
      maximum: 6,
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
          // minimum: 1911,
        },
        {
          type: 'null',
        },
      ],
    },
    startMonth: {
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
    startYear: {
      oneOf: [
        {
          type: 'integer',
          maximum: 9999,
          // minimum: 1911,
        },
        {
          type: 'null',
        },
      ],
    },
  },
}

// 專案成就
const honor = {
  type: 'object',
  required: ['title','fileId'],
  properties: {
    title: {
      type: 'string',
      // maxLength: 100,
      minLength: 1,
    },
    fileId: {
      type: 'string',
      pattern: '[0-9a-f]{34}',
    },
    description: {
      oneOf: [
        {
          type: 'string',
          // maxLength: 1000,
        },
        {
          type: 'null',
        },
      ],
    }
  },
}

// 技能專長
const talent = {
  type: 'object',
  required: ['tag'],
  properties: {
    tag: {
      type: 'string',
      // maxLength: 50,
      minLength: 1,
    },
    description: {
      oneOf: [
        {
          type: 'string',
          // maxLength: 200,
        },
        {
          type: 'null'
        }
      ]
    },
    grade: {
      enum: [null, 1, 2, 3, 4, 5],
    },
    tagId: {
      type: 'string',
    },
  },
}

// 作品櫥窗
const gallery = {
  type: 'object',
  required: ['title',"fileId"],
  properties: {
    description: {
      oneOf: [
        {
          type: 'string',
          // maxLength: 1000,
        },
        {
          type: 'null',
        },
      ],
    },
    fileId: {
        type: 'string',
        pattern: '[0-9a-f]{34}',
    },
    title: {
      type: 'string',
      // maxLength:50,
      minLength: 1,
    },
    galleryId: {
      type: 'string',
    },
  },
}

// 客製化
const custom = {
  type: 'object',
  required: ['title'],
  properties: {
    customId: {
      type: 'string',
      pattern:
        '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}',
    },
    description: {
      oneOf: [
        {
          type: 'string',
          // maxLength: 2000,
        },
        {
          type: 'null'
        }
      ]
    },
    title: {
      type: 'string',
      // maxLength: 50,
      minLength: 1,
    },
    fileId: {
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
}

/**
 * connector 第三方服務 (github, behance, plus_activity) 不需要此檢查
 */
const github = {}
const behance = {}
const plus_activity = {}

export default {
  basic,
	honor,
	experience,
	education,
	talent,
	gallery,
  custom,
  github,
  behance,
  plus_activity,
};
