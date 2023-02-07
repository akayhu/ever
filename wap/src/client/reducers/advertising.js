import * as AdvertisingActionType from '../actions/advertising';

export const initialState = {
	onAdList: []
};

export default function advertisingReducer(state = initialState, action) {
	try {
		switch (action.type) {
			case AdvertisingActionType.GET_ON_ADVERTISING:
				if (action.onAdList && action.onAdList.length < 1) return state;
				return Object.assign({}, state, {onAdList: action.onAdList});

			default:
				return state;
		}
	} catch (e) {
		console.log(e);
		return state;
	}
}
