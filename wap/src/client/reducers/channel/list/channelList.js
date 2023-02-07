import { combineReducers } from 'redux';
import tab from './tab';
import recommend from './recommend';
import all from './all';
import joined from './joined';

const channelList = combineReducers({
	tab,
	recommend,
	all,
	joined
});

export default channelList;
