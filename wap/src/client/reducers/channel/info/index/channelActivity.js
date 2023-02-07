import { combineReducers } from 'redux';
import { loading, dataList, total, hasNext } from '../../unitReducers';

const channelActivity = combineReducers({
	dataList: dataList('channelActivity'),
	loading: loading('channelActivity'),
	total: total('channelActivity'),
	hasNext: hasNext('channelActivity'),
});

export default channelActivity;
