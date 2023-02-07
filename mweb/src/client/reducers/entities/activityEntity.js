import {
	ADD_TO_ENTITIES,
	INITIAL_ENTITY,
	RECEIVE_DATA,
	RECEIVE_FAIL,
	REQUEST_DATA,
	REACH_END,
	RESET_LIST,
} from 'src/client/actions/general';
import {
	TRIGGER_LIKE,
	TRIGGER_COLLECT,
	ADD_RELATED_LIST_TO_PARENT_AID,
	ADD_COMMENT_LIST_TO_PARENT_AID,
	STORE_CREATE_COMMENT,
	STORE_ADD_ENDORSE,
} from 'src/client/actions/activity';
import {isActionForReducer} from 'src/util/checkTools';
import forActivity from './forActivity';

const initialState = {};

// 用在ADD_TO_ENTITIES
const passMap = {
	toEntity: ['activities'],
};

const passMapForOther = {
	domain: ['singlePage'],
	key: ['fetchActivity'],
};

/*
// 當action.payload中有toEntity，且其值為'activities'才會進入
*/
export default function (state = initialState, action) {
	switch (action.type) {
		case ADD_TO_ENTITIES: {
			if (!isActionForReducer({passMap, action})) return state;
			const {byIds} = action.payload;

			return {
				...state,
				...byIds,
			};
		}
		case RECEIVE_FAIL: {
			if (!isActionForReducer({passMap: passMapForOther, action})) return state;			
			return {
				...state,
				[action.payload.option.aid]: {
					fail: true,
				},
			};
		}
		case ADD_RELATED_LIST_TO_PARENT_AID: {
			// 將relatedList塞入原本的activityList裡面
			return {
				...state,
				[action.aid]: {
					...state[action.aid],
					relatedList: [...action.dataList],
				},
			};
		}
		case ADD_COMMENT_LIST_TO_PARENT_AID: {
			// 將commentList塞入原本的activityList裡面
			return {
				...state,
				[action.aid]: {
					...state[action.aid],
					commentList: [...action.dataList, ...state[action.aid].commentList],
					ts: action.ts,
				},
			};
		}
		case STORE_CREATE_COMMENT: {
			// 將新增的留言aid塞入原本的activiyList中
			const aidParent = action.response.aidParent;
			return {
				...state,
				[action.response.aid]: action.response,
				[aidParent]: {
					...state[aidParent],
					commentList: [...state[aidParent].commentList, action.response.aid],
					commentCount: state[aidParent].commentCount + 1,
				},
			};
		}
		case STORE_ADD_ENDORSE: {
			const aid = action.aid;
			const tempEndorse = state[aid].endorseHoneyPot.map((data) => {
				if (data.item === action.item) {
					if (action.flag) {
						// 給予肯定
						return {
							...data,
							count: data.count + 1,
							endorseIt: true,
						};
					}
					// 收回肯定
					return {
						...data,
						count: data.count === 0 ? 0 : data.count - 1,
						endorseIt: false,
					};
				}
				return data;
			});
			const activities = {
				...state,
				[aid]: Object.assign(state[aid], {endorseHoneyPot: tempEndorse}),
			};
			return activities;
		}
		case TRIGGER_LIKE:
		case TRIGGER_COLLECT: {
			const {aid} = action.payload;
			return {
				...state,
				[aid]: forActivity(state[aid], action),
			};
		}
		default:
			return state;
	}
}
