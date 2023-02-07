import { combineReducers } from 'redux';
import {
	createCategoryList,
	loading,
	myGroupTitleList,
} from './unitReducers';

const myGroup = combineReducers({
	myGroupTitle: combineReducers({
		loading: loading('myGroupTitle'),
		dataList: myGroupTitleList('myGroupTitle')
	}),
	joined: createCategoryList('joined'),
	waitForJoin: createCategoryList('waitForJoin'),
	managed: createCategoryList('managed'),
	checking: createCategoryList('checking'),
	rejected: createCategoryList('rejected')
});

export default myGroup;
