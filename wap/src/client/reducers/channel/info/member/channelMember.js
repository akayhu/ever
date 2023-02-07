import { combineReducers } from 'redux';
import { dataList, loading, total, hasNext, offset } from '../../unitReducers';

const channelMember = combineReducers({
	dataList: dataList('channelMember'),
	loading: loading('channelMember'),
	total: total('channelMember'),
	hasNext: hasNext('channelMember'),
	offset: offset('channelMember'),
});


export default channelMember;
