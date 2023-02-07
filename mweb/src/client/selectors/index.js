import { has } from 'lodash/object';
import { isEmpty } from 'lodash/lang';
import * as fromEntities from 'src/client/reducers/entities';

export function getProfiles({state, targetPid, key}) {
	const profiles = state.entities.profiles;
	return has(profiles, targetPid) && !isEmpty(profiles[targetPid][key]) ?
		profiles[targetPid][key] :
		null;
}

export function getProfileIsEmpty({state, targetPid}) {
	const profiles = state.entities.profiles;
	return has(profiles, targetPid) && has(profiles, 'profileIsEmpty') ?
		state.profile[targetPid].profileIsEmpty :
		false;
}

export function getChannel({state, channelId, key}) {
	const channels = state.entities.channels;
	return has(channels, channelId)/* && !isEmpty(channels[channelId][key]) */?
		channels[channelId][key] :
		null;
}

export function getTopic({state, func, key}) {
	const byFunc = state.topic.byFunc;
	
	return has(byFunc, func)/* && !isEmpty(byFunc[func]['hots'][key])*/ ?
		byFunc[func]['hots'][key] :
		null;
}

export function getEnd({state, domain, key, option}) {
	if (domain === 'main') {
		return state[domain][key].end;
	} else if (domain === 'group') {
		return getInfoAboutGroup({state, domain, key, option, infoType: 'end'});
	} else if (domain === 'channel') {
		return getInfoAboutChannel({state, domain, key, option, infoType: 'end'});
	} else if (domain === 'profile') {
		return state.entities.profiles[option.targetPid][key].end;
	} else if (domain === 'topic') {
		return state.topic.byFunc[option.func].hots.end;
	} else if (domain === 'collection') {
		return state.collection.end;
	} else if (domain === 'search') {
		return state.search[key].end;
	} else if (domain === 'notification') {
		return state.notification[key].end;
	}
	return false;
}

export function getLoading({state, domain, key, option}) {
	if (domain === 'main') {
		return state[domain][key].loading;
	} else if (domain === 'group') {
		return getInfoAboutGroup({state, domain, key, option, infoType: 'loading'});
	} else if (domain === 'channel') {
		return getInfoAboutChannel({state, domain, key, option, infoType: 'loading'});
	} else if (domain === 'profile') {
		return state.entities.profiles[option.targetPid][key].loading;
	} else if (domain === 'topic') {
		return state.topic.byFunc[option.func].hots.loading;
	} else if (domain === 'collection') {
		return state.collection.loading;
	} else if (domain === 'search') {
		return state.search[key].loading;
	} else if (domain === 'notification') {
		return state.notification[key].loading;
	}
	return false;
}

export function getOffset({state, domain, key, option}) {
	if (domain === 'main') {
		return state[domain][key].offset;
	} else if (domain === 'group') {
		return getInfoAboutGroup({state, domain, key, option, infoType: 'offset'});
	} else if (domain === 'channel') {
		return getInfoAboutChannel({state, domain, key, option, infoType: 'offset'});
	}	else if (domain === 'profile') {
		return state.entities.profiles[option.targetPid][key].offset;
	} else if (domain === 'topic') {
		return state.topic.byFunc[option.func].hots.offset;
	} else if (domain === 'collection') {
		return state.collection.offset;
	} else if (domain === 'search') {
		return state.search[key].offset;
	} else if (domain === 'notification') {
		return state.notification[key].offset;
	}
}

export function getHasLoaded({state, domain, key, option}){
	if (domain === 'search') {
		return state.search[key].hasLoaded === true;
	} else if (domain === 'notification') {
		return state.notification[key].hasLoaded === true;
	}
}

export function checkForReset({state, domain, key, option}){
	if (domain === 'search') {
		if(key === 'activity'){
			return state.search[key].offset.keyword !== option.keyword;
		}

		return false;
	}
}

export function getTopicFunc(state){
	return state.topic.func;
}

// entities
export const getGuestCount = (state, targetPid) => fromEntities.getGuestCount(state.entities, targetPid);
export const getGuestDataOfUser = (state, targetPid) => fromEntities.getGuestDataOfUser(state.entities, targetPid);
export const getGuestDataOfComp = (state, targetPid) => fromEntities.getGuestDataOfComp(state.entities, targetPid);


// helpers
function getInfoAboutGroup({state, domain, key, option, infoType}) {
	if (['activity', 'member'].indexOf(key) !== -1) {
		const channelId = option.channelId;
		return state.entities.channels[channelId][key][infoType];
	}

	const selfKeys = ['joined', 'waitForJoin', 'managed', 'checking', 'rejected'];
	const subDomain = selfKeys.indexOf(key) === -1 ? 'all' : 'self';
	return state[domain][subDomain].byGroup[key][infoType];
}

function getInfoAboutChannel({state, domain, key, option, infoType}) {
	if (['activity', 'member'].indexOf(key) !== -1) {
		const channelId = option.channelId;
		return state.entities.channels[channelId][key][infoType];
	}

	const selfKeys = ['all', 'joined', 'recommend'];
	const subDomain = selfKeys.indexOf(key) === -1 ? 'all' : 'self';
	return state[domain][subDomain].byGroup[key][infoType];
}
