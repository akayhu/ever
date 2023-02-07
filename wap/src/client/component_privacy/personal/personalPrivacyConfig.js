import { has } from 'lodash/object';

export default function getConfig(privacy, lightboxPackage) {
	return [
		{
			nav: {
				title: '基本資料',
				desc: '是否公開讓他人瀏覽「個人摘要、學經歷、職涯成就」等資料。',
				show: lightboxNavIsShow(lightboxPackage, [
					'introduction',
					'experience',
					'education',
					'honor',
					'gallery',
					'endorse'
				])
			},
			navList: [
				{
					key: 'introduction',
					title: '個人摘要',
					desc: '是否公開讓其他人瀏覽。',
					status:	lightboxPackageDefaultValue(privacy, lightboxPackage, 'introduction'),
					type: 'switch',
					show: lightboxNavListIsShow(lightboxPackage, 'introduction')
				}, {
					key: 'experience',
					title: '經歷',
					desc: '是否公開讓其他人瀏覽你設定公開的「經歷」區塊。',
					status:	lightboxPackageDefaultValue(privacy, lightboxPackage, 'experience'),
					type: 'switch',
					show: lightboxNavListIsShow(lightboxPackage, 'experience')
				}, {
					key: 'education',
					title: '學歷',
					desc: '是否公開讓其他人瀏覽你設定公開的「學歷」區塊。',
					status:	lightboxPackageDefaultValue(privacy, lightboxPackage, 'education'),
					type: 'switch',
					show: lightboxNavListIsShow(lightboxPackage, 'education')
				}, {
					key: 'honor',
					title: '職涯成就',
					desc: '是否公開讓其他人瀏覽你設定公開的「職涯成就」區塊。',
					status:	lightboxPackageDefaultValue(privacy, lightboxPackage, 'honor'),
					type: 'switch',
					show: lightboxNavListIsShow(lightboxPackage, 'honor')
				}, {
					key: 'gallery',
					title: '展示櫥窗',
					desc: '是否讓其他人瀏覽你設定公開的「展示櫥窗」區塊。<br />單筆「展示櫥窗」隱私可以在個人檔案頁中直接設定。',
					status:	lightboxPackageDefaultValue(privacy, lightboxPackage, 'gallery'),
					type: 'switch',
					show: lightboxNavListIsShow(lightboxPackage, 'gallery')
				}, {
					key: 'endorse',
					title: '專長特質與證照',
					desc: '是否公開讓其他人瀏覽你設定公開的「專長特質與證照」區塊。',
					status:	lightboxPackageDefaultValue(privacy, lightboxPackage, 'endorse'),
					type: 'switch',
					show: lightboxNavListIsShow(lightboxPackage, 'endorse')
				}
			]
		}, {
			nav: {
				title: '社群資料',
				desc: '是否公開讓他人瀏覽「朋友、我的關注、讚美、加入的社團」等資料。',
				show: lightboxNavIsShow(lightboxPackage, [
					'recentActivity',
					'mutualFriend',
					'colleague',
					'appraise',
					'group',
					'subscribe',
					'collectActivity'
				])
			},
			navList: [
				{
					key: 'recentActivity',
					title: '最新的文章',
					desc: '是否讓其他人瀏覽你的「最新文章」區塊。',
					status:	lightboxPackageDefaultValue(privacy, lightboxPackage, 'recentActivity'),
					type: 'switch',
					show: lightboxNavListIsShow(lightboxPackage, 'recentActivity')
				}, {
					// 我的朋友對應key值名稱mutualFriend有誤，但後端欄位是沒有錯的。因已關連到太多地方將錯就錯哭
					key: 'mutualFriend',
					title: '我的朋友',
					desc: '是否開放其他人瀏覽你的「朋友名單」。<br />104 會員仍可透過「共同朋友」查看你的部分朋友。',
					status:	lightboxPackageDefaultValue(privacy, lightboxPackage, 'mutualFriend'),
					type: 'droplist',
					show: lightboxNavListIsShow(lightboxPackage, 'mutualFriend')
				}, {
					key: 'colleague',
					title: '共事意願',
					desc: '是否讓其他人瀏覽你的「共事意願」區塊。',
					status:	lightboxPackageDefaultValue(privacy, lightboxPackage, 'colleague'),
					type: 'switch',
					show: lightboxNavListIsShow(lightboxPackage, 'colleague')
				}, {
					key: 'appraise',
					title: '我的讚美',
					desc: '是否讓其他人瀏覽你的「讚美」區塊。',
					status:	lightboxPackageDefaultValue(privacy, lightboxPackage, 'appraise'),
					type: 'switch',
					show: lightboxNavListIsShow(lightboxPackage, 'appraise')
				}, {
					key: 'group',
					title: '參加的社團',
					desc: '是否開放其他人瀏覽你創建的和加入的「社團」區塊。',
					status:	lightboxPackageDefaultValue(privacy, lightboxPackage, 'group'),
					type: 'switch',
					show: lightboxNavListIsShow(lightboxPackage, 'group')
				}, {
					key: 'subscribe',
					title: '我的關注',
					desc: '是否開放瀏覽所有我「關注」的人。',
					status:	lightboxPackageDefaultValue(privacy, lightboxPackage, 'subscribe'),
					type: 'switch',
					show: lightboxNavListIsShow(lightboxPackage, 'subscribe')
				}, {
					key: 'collectActivity',
					title: '收藏的文章',
					desc: '是否開放其他人瀏覽你「收藏的文章」區塊',
					status:	lightboxPackageDefaultValue(privacy, lightboxPackage, 'collectActivity'),
					type: 'switch',
					show: lightboxNavListIsShow(lightboxPackage, 'collectActivity')
				}
			]
		}
		// , {
		// 	nav: {
		// 		title: '外部曝光控制',
		// 		desc: '是否要讓其他人透過搜尋引擎找到或FB、Line等社交分享方式瀏覽你的個人檔案',
		// 		show: lightboxNavIsShow(lightboxPackage, ['offSiteSearch'])
		// 	},
		// 	navList: [
		// 		{
		// 			key: 'offSiteSearch',
		// 			title: '',
		// 			desc: '若選擇關閉，其他人將無法在104以外的地方瀏覽你的個人檔案',
		// 			status:	lightboxPackageDefaultValue(privacy, lightboxPackage, 'offSiteSearch'),
		// 			type: 'switch',
		// 			show: lightboxNavListIsShow(lightboxPackage, 'offSiteSearch')
		// 		}
		// 	]
		// }
	];
}

// 套餐預設的值

// contacts = 迅速拓展人脈 ( 隱私設定頁上方 )
// opportunity = 個人檔案曝光度設定 ( 隱私設定頁上方 )
// notUse = 不想使用社群 ( 隱私設定頁上方)
// connection = 立即迅速拓展人脈 ( 個人頁面Cover上方 )
// elegant = 讓貴人看見你 ( 個人頁面Cover上方)

const defaultValue = {
	introduction: {
		contacts: 1,
		opportunity: 1,
		notUse: 0,
		connection: 1,
		elegant: 1
	},
	experience: {
		contacts: 1,
		opportunity: 1,
		notUse: 0,
		connection: 1,
		elegant: 1
	},
	education: {
		contacts: 1,
		opportunity: 1,
		notUse: 0,
		connection: 1,
		elegant: 1
	},
	honor: {
		opportunity: 1,
		notUse: 0,
		elegant: 1
	},
	gallery: {
		contacts: 1,
		opportunity: 1,
		notUse: 0,
		connection: 1,
		elegant: 1
	},
	endorse: {
		opportunity: 1,
		notUse: 0,
		elegant: 1
	},
	recentActivity: {
		contacts: 1,
		notUse: 0,
		connection: 1,
	},
	mutualFriend: {
		contacts: 1,
		notUse: 0,
		connection: 1
	},
	colleague: {
		notUse: 0,
	},
	appraise: {
		opportunity: 1,
		notUse: 0,
		elegant: 1
	},
	group: {
		contacts: 1,
		notUse: 0,
		connection: 1
	},
	subscribe: {
		contacts: 1,
		notUse: 0,
		connection: 1
	},
	collectActivity: {
		contacts: 1,
		notUse: 0,
	},
	offSiteSearch: {
		contacts: 1,
		opportunity: 1,
		notUse: 0,
	}
};

function lightboxPackageDefaultValue(privacy, lightboxPackage, key) {
	// 不是選擇lighbox套餐的話 (開啟編輯那邊的表單)
	if (!lightboxPackage) {
		return privacy[key];
	}
	// 沒有此套餐不需要顯示這個隱私項目
	if (has(defaultValue[key], lightboxPackage)) {
		return defaultValue[key][lightboxPackage];
	}
	// 套餐沒有顯示的項目，值為使用者設定的值
	return privacy[key];
}

function lightboxNavListIsShow(lightboxPackage, key) {
	// 沒有此套餐不需要顯示這個隱私項目
	if (has(defaultValue[key], lightboxPackage)) {
		return true;
	}
	return false;
}

function lightboxNavIsShow(lightboxPackage, arrayKey) {
	// 判斷nav要不要顯示
	for (const key of arrayKey) {
		if (has(defaultValue[key], lightboxPackage)) {
			return true;
		}
	}
	return false;
}
