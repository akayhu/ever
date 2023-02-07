import * as GroupApi from './group_api';
import {
	getIsLoading,
	getCurrentCount,
	getCurrentOffset,
	getNextFrom,
	getIsEnd,
	getSortFieldAndOrder
} from '../../reducers/group/selectors';

const getTypeOf = (obj) => Object.prototype.toString.call(obj).match(/(\w+)/g)[1];

export function actionMap(category) {
	switch (category) {
		case 'knowAndTech':
		case 'lifestyle':
		case 'healthAndLeisure':
		case 'artAndDesign':
			return GroupApi.queryGroupListByCategory;
		case 'recommend':
			return GroupApi.queryRecommendGroupList;
		case 'joined':
			return GroupApi.queryJoinedGroupList;
		case 'waitForJoin':
			return GroupApi.queryWaitForJoinGroupList;
		case 'managed':
		case 'checking':
		case 'rejected':
			return GroupApi.queryManageGroupListByStatus;
		case 'categoryTitles':
			return GroupApi.queryGroupCategoryList;
		case 'applyGroup':
			return GroupApi.applyGroup;
		case 'groupInfo':
			return GroupApi.getGroupInfo;
		case 'myGroupTitle':
			return GroupApi.getMyGroupInitData;
		case 'applyList':
			return GroupApi.queryApplyList;
		// case 'groupActivityForCheck':
		case 'groupActivity':
			return GroupApi.getActivityListByChannel;
		case 'groupMembers':
			return GroupApi.queryGroupMemberList;
		case 'groupAdmins':
			return GroupApi.queryGroupAdminList;
		case 'searchMembers':
			return GroupApi.searchGroupMember;
		default:
			throw Error(`no such category, ${category}`);
	}
}

export function parameterMap(category, getState, options = {}) {
	const state = getState && getState().group;
	switch (category) {
		case 'knowAndTech':
		case 'lifestyle':
		case 'healthAndLeisure':
		case 'artAndDesign':
			return {
				category: categoryToId(category),
				limit: 10,
				offset: getCurrentOffset(state, category)
			};
		case 'recommend':
			return {
				limit: 10,
				offset: getCurrentOffset(state, category),
				func: options.func
			};
		case 'joined':
			return {
				limit: 10,
				offset: getCurrentOffset(state, category)
			};
		case 'waitForJoin':
			return {
				limit: 10,
				offset: getCurrentOffset(state, category)
			};
		case 'checking':
			return {
				limit: 10,
				offset: getCurrentOffset(state, category),
				status: 0
			};
		case 'rejected':
			return {
				limit: 10,
				offset: getCurrentOffset(state, category),
				status: 2
			};
		case 'managed':
			return {
				limit: 10,
				offset: getCurrentOffset(state, category),
				status: [1, 3]
			};
		case 'categoryTitles':
		case 'myGroupTitle':
			return {};
		case 'groupInfo':
			return {
				channelId: options.channelId
			};
		case 'applyList':
			return {
				channelId: options.channelId,
				limit: 10,
				offset: getCurrentOffset(state, category),
			};
		// case 'groupActivityForCheck':
		// 	return {
		// 		channelId: options.channelId,
		// 		limit: 10,
		// 		offset: getNextFrom(state, category),
		// 		...getSortFieldAndOrder(state)
		// 	};
		case 'groupActivity':
			return {
				channelId: options.channelId,
				limit: 10,
				offset: getNextFrom(state, category)
			};
		case 'groupMembers':
		case 'groupAdmins':
			return {
				channelId: options.channelId,
				limit: 10,
				offset: getCurrentOffset(state, category)
			};
		case 'searchMembers':
			return {
				channelId: options.channelId,
				name: options.name,
				limit: 10,
				offset: getCurrentOffset(state, category)
			};
		default:
			throw Error(`no such category, ${category}`);
	}
}
export function isWrong(obj) {
	if (!obj) return true;
	if (Object.prototype.toString.call(obj) !== '[object Object]') {
		return false;
	}
	return obj.hasOwnProperty('error') || obj.hasOwnProperty('warning');
}

export function canNotLoad(state, category) {
	return getIsLoading(state, category) || getIsEnd(state, category);
}

export function shouldReset(state, category) {
	return state.waitForReset.indexOf(category) !== -1;
}

export function categoryToId(category) {
	switch (category) {
		case 'knowAndTech': return 1;
		case 'lifestyle': return 2;
		case 'healthAndLeisure': return 3;
		case 'artAndDesign': return 4;
		default:
			throw Error(`no such category Name, ${category}`);
	}
}

export function idToCategory(id) {
	switch (id) {
		case 1: return 'knowAndTech';
		case 2: return 'lifestyle';
		case 3: return 'healthAndLeisure';
		case 4: return 'artAndDesign';
		default:
			throw Error(`no such category ID, ${id}`);
	}
}

export function isEmpty(obj) {
	if (getTypeOf(obj) === 'Array') {
		return !obj.length;
	}
	if (getTypeOf(obj) === 'Object') {
		return !Object.keys(obj).length;
	}
	return !!obj;
}
