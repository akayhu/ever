import {
	GET_SUBSCRIBE_LIST,
	TRIGGER_SUBSCRIBE,
	TRIGGER_UNSUBSCRIBE
} from '../../actions/topic';
import {difference} from 'lodash/array';
import {isWrong} from '../../../util/tools';

export const initalState = {
	dataList: [],
	isEmpty: false,
	isLoaded: false
};

export default function (state = initalState, action) {
	try {
		switch (action.type) {
			case GET_SUBSCRIBE_LIST: {
				const {response} = action.response;
				if (isWrong(response)) {
					return state;
				}
				if (!response.length) {
					return {...state,
						isEmpty: true,
					};
				}
				return {...state,
					dataList: response.map(item => item.function),
					isLoaded: true
				};
			}
			case TRIGGER_SUBSCRIBE: {
				const {func} = action.payload;
				const newDataList = [...state.dataList, ...func];
				
				return {...state,
					isEmpty: newDataList.length === 0,
					dataList: newDataList,
				};
			}
			case TRIGGER_UNSUBSCRIBE: {
				const {func} = action.payload;
				const newDataList = difference(state.dataList, func);

				return {...state,
					isEmpty: newDataList.length === 0,
					dataList: newDataList,
				};
			}
			default:
				return state;
		}
	}catch(e){
		console.log(e)
		return state;
	}
}
