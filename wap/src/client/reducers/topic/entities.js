import {GET_DATA} from '../../actions/topic';
import {mapStateKeyToIdtype} from './utils';
import {isArray} from 'lodash/lang';
import {omit} from 'lodash/object';

export const initialState = {
	person: {},
	channel: {},
	honor: {}
};

export default function (state = initialState, action) {
	try {
		switch (action.type) {
			case GET_DATA: {
				const {key, byIds} = action.payload;
				const idtype = mapStateKeyToIdtype(key);

				if (idtype === 'activity')
					return state;

				return {...state,
					[idtype]: {...state[idtype], ...byIds}
				};
			}
			case 'ADD_TO_ENTITIES': {
				const {idType, byIds} = action.payload;
				return {...state,
					[idType]: {...state[idType], ...byIds}
				};
			}
			case 'REMOVE_FROM_ENTITIES': {
				const {idType, ids} = action.payload;
				const _ids = isArray(ids) ? ids : [ids];
				return {...state,
					[idType]: omit(state[idType], _ids)
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
