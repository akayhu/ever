import {combineReducers} from 'redux';
import func from './func';
import allFunc from './allFunc';
import byFunc from './byFunc';
import error from './error';

/**
 * 	allFunc: {
			funcList: [<Array of funcName>],
			loading: false,
			error: false,
			hasLoaded: true,
		},
		byFunc: {
			'工程開發': {
				dataList: [<Array of aid>],
				loading: false,
				offset: 10,
				error: false,
				end: false,
				hasLoaded: true,
			},
		},
		error: false,
 */

export default combineReducers({
	// no passMap
	func,
	/**
	 * passMap = {
			domain: ['topic'],
			key: ['initList'],
		};
	 */
	allFunc,
	/**
	 * passMap = {
			domain: ['topic'],
			key: ['initTopicModel', 'hots'],
		};
	 */
	byFunc,
	/**
	 * passMap = {
			domain: ['topic'],
			key: ['initList'],
		};
	 */
	error,
});
