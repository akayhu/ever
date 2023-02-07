import {
	INITIAL_ENTITY,
	ADD_TO_ENTITIES,
	RECEIVE_DATA,
	RECEIVE_FAIL,
	REQUEST_DATA,
	REACH_END,
	RESET_LIST,
	RESET_KEY_IN_ENTITY
} from 'src/client/actions/general';
import {isActionForReducer} from 'src/util/checkTools';
import forChannel from './forChannel';

const initialState = {
	0: {
		channelInfo: {},
		activity: {},
		member: {},
		hasLoaded: false,
	},
};

/**
 * 一次加入多筆channel entity的情況才會觸發ADD_TO_ENTITIES
 * 只有 action.payload.toEntity為'channels'才可進入
 */
const passMapForAdd = {
	toEntity: ['channels'],
};

/**
 * 對有對單一筆channel entity做初始或新增、修改時會用到
 * 如INITIAL_ENTITY、RECEIVE_DATA...RESET_LIST
 */
const passMapForOther = {
	domain: ['group', 'channel'],
	key: ['activity', 'member', 'initSingleGroup', 'initSingleChannel', 'resetKeyinEntity'],
};

export default function (state = initialState, action) {
	switch (action.type) {
		case ADD_TO_ENTITIES: {
			if (!isActionForReducer({passMap: passMapForAdd, action})) return state;
			const {byIds} = action.payload;

			return {
				...state,
				...byIds,
			};
		}
		case INITIAL_ENTITY:
		case RECEIVE_DATA:
		case RECEIVE_FAIL:
		case REQUEST_DATA:
		case REACH_END:
		case RESET_KEY_IN_ENTITY: {
			if (!isActionForReducer({passMap: passMapForOther, action})) {
				return state;
			}

			const {option: {channelId}} = action.payload;

			return {
				...state,
				[channelId]: forChannel(state[channelId], action),
			};
		}
		case RESET_LIST: {
			if (!isActionForReducer({passMap: passMapForOther, action})) {
				return state;
			}
			const {key, option: {channelId}} = action.payload;

			if (key === 'allgroups') {
				return {};
			}

			return {
				...state,
				[channelId]: forChannel(state[channelId], action),
			};
		}
		default:
			return state;
	}
}
