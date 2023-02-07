import { generateId } from 'utils/idGenerator';

/**
 * 各區塊範例資料
 */

// 基本資料
const basic = {
	userName: '黃大牛',
	organization: '雅達利公司',
	title: '電子技術與設計工程師',
	location: '台北市信義區基隆路',
	introduction:
		'開發在公司官網上打磚塊的功能，主要負責在每次撞擊磚塊的時候便會冒出蘋果的互動及動畫，在撞擊參數的研究以及互動效能的調校上花了相當多的功夫。運用了相當多現代化web 技術，例如 webGL、HTML5、RxJS…等，過程中學習了很多也獲得相當多的啟發，在之後的手機研發互動上也受益良多。',
};

// 經歷
const experience = {
	companyName: '雅達利公司',
	jobName: '電子技術與設計工程師',
	location: '',
	status: 0,
	description: `主要負責公司官網建置、SEO優化，主要技術使用React + Redux，相較上一代官網:<br />載入時間減少3秒以上主要關鍵字 SEO ranking 平均提昇15個排名<br />用戶體驗大幅提昇，顧客滿意度上升35%<br />期間因為表現優良獲得公司年度優秀員工的肯定`,
	startYear: 2016,
	startMonth: 9,
	endYear: 2018,
	endMonth: 6,
	talentList: ['Javascript'],
	expId: generateId('tmp-new'),
};

// 專案成就
const honor = {
	title: 'New Generation Of 打磚塊',
	description: `開發在公司官網上打磚塊的功能，主要負責在每次撞擊磚塊的時候便會冒出蘋果的互動及動畫，在撞擊參數的研究以及互動效能的調校上花了相當多的功夫。運用了相當多現代化web 技術，例如 webGL、HTML5、RxJS…等，過程中學習了很多也獲得相當多的啟發，在之後的手機研發互動上也受益良多。`,
	startYear: 2016,
	startMonth: 9,
	endYear: 2018,
	endMonth: 6,
	fileId: null,
	fileUrlMap: {
		w600: '',
		w960: '',
	},
	honorId: generateId('tmp-new'),
	talentList: ['webGL'],
};

// 技能專長
const talent = {
	description: `熟悉基礎知識與原理，並且有隨時在 follow 最新的語言標準並運用在工作實務上，對於主流的框架運用上也相當得心應手，能夠依據情況選擇最適合的方案進行開發。`,
	grade: 4,
	tag: 'Javascript',
	tagId: generateId('tmp-new'),
};

// github
const github = {
	createTimestamp: 0,
	githubURL: '',
	pid: -3,
	followersCount: 0,
	publicGistCount: 0,
	publicRepoCount: 0,
	repoList: [
		{
			repoName: '',
			repoDescription: '',
			repoURL: '',
			repoForks: 0,
			repoStargazers: 0,
			repoWatchers: 0,
			repoLanguages: [],
		},
	],
	type: 'GITHUB',
};

// behance
const behance = {
	pid: -3,
	type: 'BEHANCE',
	createTimestamp: 0,
	projectList: [
		{
			projectName: '',
			projectURL: '',
			projectCover_115: '',
			projectCover_202: '',
			projectCover_230: '',
			projectCover_404: '',
			projectCover_original: '',
			projectViews: 0,
			projectAppreciations: 0,
			projectComments: 0,
			projectFields: [],
		},
	],
};

// 作品集
const gallery = {
	title: '紙的創意學 PAPER CREATIVITY',
	description:
		'大量運用田中央的種籽紙、展現石磨特性的蜂巢紙、以機能紙抄技術表現的薄纖紙等各式特殊紙，由鳳嬌催化室打造出《紙林紙海》，參觀者可穿梭從天而降的紙林，暢遊於起伏的紙浪中，深刻地用「身體」感受團隊對紙和纖維的各種想像與實驗精神。',
	fileId: null,
	fileUrlMap: {
		w600: '',
		w960: '',
		w1920: '',
	},
	galleryId: generateId('tmp-new'),
};

// 學歷
const education = {
	schoolName: '里德學院',
	majorName: '人類學',
	degree: 6,
	status: null,
	startYear: 2016,
	startMonth: 9,
	endYear: 2018,
	endMonth: 6,
	eduId: generateId('tmp-new'),
};

// 客製化
const custom = {
	title: '',
	description: '',
	imgUrl: '',
	fileId: null,
	fileUrlMap: {
		w600: '',
		w960: '',
		w1920: '',
	},
	// NOTE: 一新增客製化區塊就有真實 customId ，因此不會有 tmp-new 開頭的假 Id
};

export {
	basic,
	honor,
	experience,
	education,
	talent,
	gallery,
	github,
	behance,
	custom,
};
