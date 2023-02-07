import { combineReducers } from 'redux';
import { dataList, loading, total, hasNext } from '../../unitReducers';

const mediaNewActivity = combineReducers({
	dataList: dataList('mediaNewActivity'),
	loading: loading('mediaNewActivity'),
	total: total('mediaNewActivity'),
	hasNext: hasNext('mediaNewActivity')
});

export default mediaNewActivity;
