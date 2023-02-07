/**
 * 重置用resetList
 * reset某個子項目 resetList({domain: 'profile', key: 'item', targetPid}))
 * reset整個entity resetList({domain: 'profile', key: 'allprofile', targetPid}))
 */
import {
	INITIAL_ENTITY,
	RECEIVE_DATA,
	RECEIVE_FAIL,
	REQUEST_DATA,
	REACH_END,
	RESET_LIST,
} from 'src/client/actions/general';
import {
	RECEIVE_PROFILE_DATA,
	INITIAL_EMPTY_PROFILE,
} from 'src/client/actions/profile';
import {isActionForReducer} from 'src/util/checkTools';
import {profileModel} from 'src/client/reducers/listModel';
import forProfile from './forProfile';

/**
 * 設定此reducer會去回應的action所需帶的參數值
 * 		ex:
 * 			{type:...,
 * 				payload: {
 * 					domain: 'profile',
 * 					key: 'info'
 * 				}
 * 			}
 */
const passMap = {
	domain: ['profile'],
	key: [
		'init',
		'info',
		'activity',
		'guest',
		'guest_user',
		'guest_comp',
		'event',
		'gallery',
		'appraise',
		'endorse',
		'colleague',
	],
};

const initialState = {
	0: profileModel,
};

export default function (state = initialState, action) {
	if (!isActionForReducer({domain: 'profile', passMap, action})) {
		return state;
	}
	switch (action.type) {
		case INITIAL_EMPTY_PROFILE:
		case INITIAL_ENTITY:
		case REQUEST_DATA:
		case RECEIVE_DATA:
		case RECEIVE_FAIL:
		case REACH_END:
		case RESET_LIST:
		case RECEIVE_PROFILE_DATA: {
			const {option: {targetPid}} = action.payload;
			return {
				...state,
				[targetPid]: forProfile(state[targetPid], action),
			};
		}
		default:
			return state;
	}
}
