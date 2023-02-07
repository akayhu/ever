"use strict";

import clientConfig from '../../configs/client';

export const indexMeta = {
	title: '104 職涯社群',
	description: '在 104 職涯社群，你將可以看到同職類或相關職類專業人才都在關注哪些產業資訊，並可交換名片成為朋友，拓展人脈；也可以藉由你平日在個人頁或社團熱情分享與專業見解、在展示櫥窗上傳影音等作品，讓更多人肯定你的專業，看見你的智慧、經驗及氣度，進而與對你職涯有幫助的貴人不期而遇，發掘更多潛在機會。',
	image: {
		url: `https:${clientConfig.params.staticLogoUrl}/104logo_plus_200x200.png`,
		width: 200,
		height: 200
	},
	url: `https:${clientConfig.params.wapUrl}`
};

export const activityMeta = {
	aid: '',
	author: '104 職涯社群',
	title: '104 職涯社群',
	description: '在 104 職涯社群，你將可以看到同職類或相關職類專業人才都在關注哪些產業資訊，並可交換名片成為朋友，拓展人脈；也可以藉由你平日在個人頁或社團熱情分享與專業見解、在展示櫥窗上傳影音等作品，讓更多人肯定你的專業，看見你的智慧、經驗及氣度，進而與對你職涯有幫助的貴人不期而遇，發掘更多潛在機會。',
	image: {
		url: `https:${clientConfig.params.staticLogoUrl}/104logo_plus_200x200.png`,
		width: 200,
		height: 200
	},
	url: `https:${clientConfig.params.wapUrl}/activity`,
	mUrl: `https:${clientConfig.params.wapUrl}/m/activity/`
};

export const profileMeta = {
	pid: '',
	title: '104 職涯社群',
	description: '查看會員的個人檔案，104 職涯社群能讓你透過完整呈現職涯成就及影音圖文作品集，輕鬆經營個人品牌、拓展人脈。在 104 職涯社群，你將可以看到同職類或相關職類專業人才都在關注哪些產業資訊，並可交換名片成為朋友，拓展人脈；也可以藉由你平日在個人頁或社團熱情分享與專業見解、在展示櫥窗上傳影音等作品，讓更多人肯定你的專業，看見你的智慧、經驗及氣度，進而與對你職涯有幫助的貴人不期而遇，發掘更多潛在機會。',
	image: {
		url: `https:${clientConfig.params.staticLogoUrl}/104logo_plus_200x200.png`,
		width: 200,
		height: 200
	},
	userName: '',
	location: '',
	companyName: '',
	jobTitle: '',
	url: `https:${clientConfig.params.wapUrl}`
};

// 頻道列表用
export const channelMeta = {
	pid: '',
	title: '頻道 - 104 職涯社群',
	name: '',
	description: '彙整職場動態、產業新知、活動講座、好書等泛職場專業資訊，協助你時時刻刻可以線上充電頻道 - 104 職涯社群',
	image: {
		url: `https:${clientConfig.params.staticLogoUrl}/104logo_plus_200x200.png`,
		width: 200,
		height: 200
	},
	url: `https:${clientConfig.params.wapUrl}/channel`,
	mUrl: `https:${clientConfig.params.wapUrl}/m/channel`,
};

// 社團列表用
export const groupMeta = {
	pid: '',
	title: '社團 - 104 職涯社群',
	name: '',
	description: '匯集最多同行的線上社團等你加入，與廿萬用戶一起交流產業資訊、經驗與專業 - 104 職涯社群',
	image: {
		url: `https:${clientConfig.params.staticLogoUrl}/104logo_plus_200x200.png`,
		width: 200,
		height: 200
	},
	url: `https:${clientConfig.params.wapUrl}/group`,
	mUrl: `https:${clientConfig.params.wapUrl}/m/group`,
};

export function strip_tags (input, allowed) {
  allowed = (((allowed || '') + '').toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('')
  var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi
  var commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi
  
  if(!input){
  	return '';
  }
  
  return input.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {
    return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : ''
  }).replace(/\s\s/g,'')
}

export const SET_METADATA = 'SET_METADATA';
export function setMetadata(key, value) {
	/* if(value){
		return {
			type: SET_METADATA,
			key,
			value
		};
	} */
	
	switch(key){
		case 'activity':
			return {
				type: SET_METADATA,
				key,
				value : { 
					...activityMeta,
					...value
				}
			};
		case 'profile':
			return {
				type: SET_METADATA,
				key,
				value : {
					...profileMeta,
					...value
				}
			};
		case 'channel':
			return {
				type: SET_METADATA,
				key,
				value : {
					...channelMeta,
					...value
				}
			};
		case 'group':
			return {
				type: SET_METADATA,
				key,
				value : {
					...groupMeta,
					...value
				}
			};
		default: 
			return {
				type: SET_METADATA,
				key,
				value : {
					...indexMeta,
					...value
				}
			};
	}
}