import config from 'src/configs/client';
import { Base64 } from 'js-base64';

function base64EncodeUrl(str) {
	if (str !== undefined) {
		return Base64.encodeURI(str.toString());
	} else {
		return '';
	}
}

export const topicConfig = {
	title: '職場動態',
	className: 'browser',
	link: '',
	isLogin: true,
	gtmName: '職場動態',
	submenu: [
		// {
		// 	title: '美術設計',
		// 	className: 'browser',
		// 	link: '/m/topic/美術設計'
		// },
		// {
		// 	title: '經營管理主管',
		// 	className: 'browser',
		// 	link: '/m/topic/經營管理主管'
		// },
		// {
		// 	title: '產品企劃開發人員',
		// 	className: 'browser',
		// 	link: '/m/topic/產品企劃開發人員'
		// },
		// {
		// 	title: 'Apple相關開發',
		// 	className: 'browser',
		// 	link: '/m/topic/Apple相關開發'
		// },
		// {
		// 	title: '工程開發',
		// 	className: 'browser',
		// 	link: '/m/topic/工程開發'
		// }
	],
};

export default function createMenu(settings) {
	return [
		{
			title: '104職涯社群',
			isLogin: false,
			submenu: [
				{
					title: '首頁動態',
					className: 'translate',
					link: '/m',
					isLogin: true,
					gtmName: '首頁',
				},
				topicConfig,
				{
					title: '公開社團',
					className: 'users',
					link: '/m/group',
					gtmName: '公開社團',
				},
				{
					title: '活動講座',
					className: 'bullhorn',
					link: config.params.wapUrl + '/event/',
					gtmName: '活動講座',
					target: '_blank',
				},
				{
					title: 'Be A Giver',
					className: 'hand outline up',
					link: '/m/104beagiver',
					gtmName: 'Giver',
				},
				{
					title: '搜尋',
					className: 'search',
					link: '/m/search',
					gtmName: '搜尋',
				},
			],
		},
		{
			title: '我的喜好',
			isLogin: true,
			submenu: [
				{
					title: '我的社團',
					className: 'users',
					link: '/m/myGroup',
					gtmName: '我的社團',
				},
				{
					title: '我的收藏',
					className: 'bookmark',
					link: '/m/myCollect',
					gtmName: '我的收藏',
				},
			],
		},
		{
			title: '使用說明與設定',
			isLogin: false,
			submenu: [
				{
					title: '常見問題',
					className: 'help circle',
					target: '_blank',
					link: config.params.staticWapUrl + '/html/commonProblem/',
					gtmName: '常見問題',
				},
				{
					title: '意見反映',
					className: 'edit',
					target: '_blank',
					link: `https:${config.params.e104Url}/jobs/search/showLogin?return_url=https%3A%2F%2F${config.params.e104Domain}%2Fquestion_admin%2Freaction.cfm%3Ffaq_from%3Dplus`,
					gtmName: '意見反映',
				},
				{
					title: '切換到電腦版',
					className: 'desktop',
					link: '/m/backToPc',
					noSpa: true,
					gtmName: '切換到電腦版',
				},
				{
					title: '登出',
					className: 'sign out',
					id: 'logout_link',
					isLogin: true,
					noSpa: true,
					link: '/sso/saml-logout?r=/m',
					gtmName: '登出',
				},
			],
		},
	];
}
