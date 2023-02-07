import { combineReducers } from 'redux';
import { dataList, loading, total, hasNext, offset } from '../../unitReducers';

const channelAdmin = combineReducers({
	dataList: dataList('channelAdmin'),
	loading: loading('channelAdmin'),
	total: total('channelAdmin'),
	hasNext: hasNext('channelAdmin'),
	offset: offset('channelAdmin'),
});


export default channelAdmin;
