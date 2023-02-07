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
import {profileModel} from 'src/client/reducers/listModel';

export default function (state, action) {
	switch (action.type) {
		case INITIAL_EMPTY_PROFILE: {
			return {
				...profileModel,
				userInfo: {},
			};
		}
		case INITIAL_ENTITY: {
			const {option: {source}} = action.payload;
			return {
				...profileModel,
				userInfo: source,
				hasLoaded: true,
			};
		}

		case REQUEST_DATA: {
			const {key} = action.payload;
			return {
				...state,
				[key]: {
					...state[key],
					loading: true,
					error: false,
				},
			};
		}
		case RECEIVE_DATA: {
			const {key, dataList, offset} = action.payload;
			let _dataList = dataList ? dataList : [];
			// console.log("/******* Profile RECEIVE_DATA ********/");
			// console.log(key);
			// console.log(state);
			// console.log(state[key]);
			// console.log(dataList);
			
			return {
				...state,
				profileIsEmpty: (state.profileIsEmpty && dataList ? dataList.length === 0 : false),
				[key]: {
					...state[key],
					dataList: [...state[key].dataList, ..._dataList],
					loading: false,
					error: false,
					hasLoaded: true,
					offset,
				},
			};
		}
		case RECEIVE_FAIL: {
			const {key} = action.payload;
			return {
				...state,
				[key]: {
					...state[key],
					loading: false,
					error: true,
				},
			};
		}
		case REACH_END: {
			const {key} = action.payload;
			return {
				...state,
				[key]: {
					...state[key],
					end: true,
				},
			};
		}
		case RESET_LIST: {
			const {key} = action.payload;
			if (key === 'allprofile') {
				return profileModel;
			}
			return {
				...state,
				[key]: profileModel[key],
			};
		}
		case RECEIVE_PROFILE_DATA: {
			const {key, option: {source}} = action.payload;

			switch (key) {
				case 'guest': {
					const {userViewCount, compViewCount} = source;
					return {
						...state,
						[key]: {
							total: userViewCount + compViewCount,
							user: {...state[key].user, count: userViewCount},
							comp: {...state[key].comp, count: compViewCount},
						},
					};
				}
				case 'guest_user': {
					return {
						...state,
						guest: { ...state.guest,
							user: {...state.guest.user,
								dataList: source.viewerInfo,
							},
						},
					};
				}
				case 'guest_comp': {
					return {
						...state,
						guest: { ...state.guest,
							comp: {...state.guest.comp,
								dataList: source.comViewerInfo,
							},
						},
					};
				}
				default: {
					return {
						...state,
						profileIsEmpty: state.profileIsEmpty ? source.length === 0 : false,
						[key]: source,
					};
				}
			}
		}
		default:
			break;
	}
}
