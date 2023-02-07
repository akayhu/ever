import {keyBy} from 'lodash/collection';
import {transform} from 'lodash/object';
import {isArray} from 'lodash/lang';
import {getOffset, getTopicFunc} from 'src/client/selectors';
import {activityModel, channelModel, actionMapping} from './config';
import {getKeys, isChineseWord} from 'src/util/tools';
import {channelModel as channelEntityModel} from 'src/client/reducers/listModel';

// 根據domain和key去map出要用的API
export function actionMap({state, domain, key}) {
	let action;

	if (domain === 'group') {
		if (isChineseWord(key)) {
			action = actionMapping[domain].all;
		} else {
			action = actionMapping[domain][key];
		}
	} else if (domain === 'profile' && key === 'appraise') {
		const role = state.profile.viewAs === 'self' ? 'self' : 'others';
		action = actionMapping[domain][key][role];
	} else {
		action = actionMapping[domain][key];
	}

	if (!action) {
		console.error(`actionMap dose not match any switch case! [${domain}-${key}]`);
	}

	return action;
}

// 根據domain和key或是option所帶入的資料，回傳打API時要送的參數
export function parameterMap({state, domain, key, option}) {
	const offset = getOffset({state, domain, key, option});

	switch (domain) {
		case 'main': {
			switch (key) {
				case 'hot':
				case 'latest':
					return {
						limit: 10,
						...offset,
					};
				case 'all':
					return {
						limit: 10,
						ts: offset,
					};
				default:
					console.error(`parameterMap dose not match any switch case! [${domain}-${key}]`);
					return {};
			}
		}
		case 'group': {
			const _key = isChineseWord(key) ? 'all' : key;
			switch (_key) {
				case 'member':
				case 'activity':
					return {channelId: option.channelId, limit: 10, offset};
				case 'all': {
					const	{categoryId} = state.group.all.byGroup[key];
					return {category: categoryId, limit: 10, offset};
				}
				case 'joined':
					return {limit: 10, offset};
				case 'waitForJoin':
					return {limit: 10, offset};
				case 'checking':
					return {limit: 10, offset, status: 0};
				case 'rejected':
					return {limit: 10, offset, status: 2};
				case 'managed':
					return {limit: 10, offset, status: [1, 3]};
				default:
					console.error(`parameterMap dose not match any switch case! [${domain}-${key}]`);
					break;
			}
			break;
		}
		case 'channel': {
			const _key = isChineseWord(key) ? 'all' : key;
			switch (_key) {
				case 'member':
				case 'activity':
					return {channelId: option.channelId, limit: 10, offset};
				case 'all':
				case 'joined':
				case 'recommend':
					return {limit: 10, offset};
				default:
					console.error(`parameterMap dose not match any switch case! [${domain}-${key}]`);
					break;
			}
			break;
		}
		case 'profile': {
			switch (key) {
				case 'activity': {
					return {
						targetPid: option.targetPid,
						limit: 10,
						ts: offset.ts || 0,
					};
				}
				case 'gallery': {
					return {
						targetPid: option.targetPid,
						limit: 10,
						offset,
					};
				}
				case 'colleague':
				case 'appraise': {
					return {
						targetPid: option.targetPid,
						limit: 10,
						timeInMillis: offset.timeInMillis || 0,
					};
				}
				case 'endorse': {
					return {
						targetPid: option.targetPid,
						limit: 10,
						avatarLimit: 2,
					};
				}
				default:
					console.error(`parameterMap dose not match any switch case! [${domain}-${key}]`);
					break;
			}
		}
		case 'topic': {
			switch (key) {
				case 'hots': {
					return {
						limit: 10,
						funcName: getTopicFunc(state),
						topic: '',
						offset: offset.nextFrom || 0,
					};
				}
				default:
					console.error(`parameterMap dose not match any switch case! [${domain}-${key}]`);
					break;
			}
		}
		case 'collection': {
			switch (key) {
				case 'activity': {
					return {
						limit: 10,
						targetPid: option.targetPid,
						ts: offset,
					};
				}
				default:
					console.error(`parameterMap dose not match any switch case! [${domain}-${key}]`);
					break;
			}
		}
		case 'search': {
			switch (key) {
				case 'activity': {
					return {
						keyword: offset.keyword || option.keyword,
						stickey: offset.stickey || '',
						oriQuery: offset.oriQuery || '',
					};
				}
				case 'person': {
					return {
						pid: option.pid || -3,
						condition: JSON.stringify({keyword: option.keyword}),
						offset: option.offset || offset,
						limit: option.limit || 10,
					};
				}
				default:
					console.error(`actionMap dose not match any switch case! [${domain}-${key}]`);
					break;
			}
		}
		case 'notification': {
			switch (key) {
				case 'bc': {
					return {
						pageNo: 1,
						pageRow: 5
					};
				}
				case 'cc': {
					return {
						action: option.action || 0,
						count: 10,
						dateTime: offset === 0 ? getNowTime(): offset
					};
				}
				default:
					console.error(`parameterMap dose not match any switch case! [${domain}-${key}]`);
					break;
			}
		}
		default:
			return {};
	}
}

// 解析後端回來的資料
export function responseParser({domain, key, response}) {
	const modelType = getDataModel(domain, key);
	
	// console.log(modelType);

	if (modelType === 'activity') {
		return parseActivityModel(response);
	} else if (modelType === 'channel') {
		return parseChannelModel(response);
	} else if (modelType === 'notification') {
		return parseNotificationModel(response);
	}
	return parseResForNonEntityModel(response);
}

// 儲存user config
export const SAVE_CONFIG = 'SAVE_CONFIG';
export function saveUserConfig(config, value) {
	return {
		type: 'SAVE_CONFIG',
		config,
		value
	};
}


/* helpers */

// 根據domain和key去解析後端回來的資料
function getDataModel(domain, key) {
	if (activityModel[domain]) {
		if (activityModel[domain][key]) {
			return 'activity';
		}
	}
	if (domain === 'group') {
		// 判斷中文字，如果是中文字代表key為所有社團的類別之一
		if (isChineseWord(key) || channelModel[domain][key]) {
			return 'channel';
		}
	}

	if (domain === 'notification') {
		return 'notification';
	}

	return false;
}

// 用來解析channel的pageModel
function parseChannelModel(response) {
	const toEntity = 'channels';
	const channelidList = [];
	const {hasNext, offset} = response;
	// console.log(dataList);
	const dataList = response.dataList.map((item) => {
		channelidList.push(item.id);
		// console.log(item);
		return {
			...channelEntityModel,
			channelInfo: item,
			id: item.id
		};
	});
	// console.log(dataList);
	const end = !hasNext;
	const byIds = keyBy(dataList, 'id');

	return {
		toEntity,
		byIds,
		dataList: channelidList,
		end,
		offset,
	};
}

// 用來解析activity的pageModel
function parseActivityModel(response) {
	const toEntity = 'activities';
	const activityAidList = [];
	const {activityList, ...rest} = response;
	let byIdsForActivity = {};
	let end = false;
	let byIdsForComment = {}; // 紀錄留言activity用
	let offset = null;
	// console.log(activityList);
	
	if(activityList){
		activityList.map((activity) => {
			activityAidList.push(activity.aid);

			const commentAidList = [];
			const tempByIds = keyBy(activity.commentList, 'aid');

			activity.commentList.map((comment) => {
				commentAidList.push(comment.aid);
			})
			activity.commentList = commentAidList;//getKeys(tempByIds);
			byIdsForComment = Object.assign(byIdsForComment, tempByIds);
		});
		
		end = activityList.length === 0 ? true : (rest.touchEnd === true ? true : false);
		byIdsForActivity = keyBy(activityList, 'aid');
		offset = parseRestToOffset(rest)
	}
	
	const byIds = {...byIdsForComment, ...byIdsForActivity}; // activities + comments
	// const aidListForStore = getKeys(byIdsForActivity); // activities

	return {
		byIds,
		dataList: activityAidList,//aidListForStore,
		end,
		offset,
		toEntity,
	};
}

function parseNotificationModel(response){
	const end = response.length === 0 ? true: false;
	const offset = response.length > 0 ? response[response.length-1].time : 0;
	
	// console.log({dataList:response, end, offset:offset});
	
	return {dataList:response, end, offset:offset};
}

// 用來解析不是channel和activity的pageModel
function parseResForNonEntityModel(response) {
	const keys = getKeys(response);
	let end;

	if (keys.indexOf('hasNext') !== -1) {
		end = !response.hasNext;
		delete response.hasNext;
	}
	let _offset;
	if (keys.indexOf('offset') !== -1) {
		_offset = response.offset;
		delete response.offset;
	}

	const {dataList, offset = _offset} = transform(response, (result, value, key) => {
		if (isArray(value)) {
			result.dataList = value;
		} else if (!_offset) {
			(result.offset || (result.offset = {}))[key] = value;
		}
	}, {});

	const total = (keys.indexOf('total') !== -1) ? response.total : 0;

	if (!end){
		if(dataList){
			end = dataList.length === 0;
		}	else{
			end = false;
		}
	}
	
	return {dataList, end, offset, total};
}

function parseRestToOffset(obj) {
	const keys = getKeys(obj);
	// 若obj內只有一對key-value則回傳value, 否則回傳原本的obj
	return (keys.length === 1) ? obj[keys[0]] : obj;
}

function getNowTime (){
	const date = new Date();
	const	year = date.getFullYear(); // 年
	const	month = date.getMonth() + 1; // 月
	const	day = date.getDate(); // 日
	const	hours = date.getHours(); // 時
	const	minutes = date.getMinutes(); // 分
	const	seconds = date.getSeconds(); // 秒

	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`; // 年-月-日 時:分:秒
};
