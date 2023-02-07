import { combineReducers } from 'redux';

import mediaInfo from './index/mediaInfo';
import channelActivity from './index/channelActivity';

import channelMember from './member/channelMember';
import channelAdmin from './member/channelAdmin';

import searchKeyword from './searchKeyword';

import tab from './tab';

const channelInfo = combineReducers({
	mediaInfo,
	channelActivity,
	searchKeyword,
	channelMember,
	channelAdmin,
	tab
});

export default channelInfo;
