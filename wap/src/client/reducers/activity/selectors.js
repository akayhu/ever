// selectors
const getDataList = (state, pid) => state[pid] ? state[pid].dataList : [];
const getAids = (state, type, profile) => {
	return getDataList(state.personalStream[type], profile.watchingProfile);
}
const getActivityByAid = (state, aid) => state.activityPool[aid];
const getSortableAids = state => state.personalStream.GROUP.dataList;//sortableList;
export const getActivitiesByType = (state, type, profile) => getAids(state, type, profile).map(aid => state.activityPool[aid]);
export const getSortableActivities = state => getSortableAids(state).map(aid => state.activityPool[aid]);
export const getLightBoxActivity = (state) => {
	const aid = state.lightbox;
	if (typeof aid === 'string')
		return getActivityByAid(state, aid);
	return null;
};

// 拿aid換成activityPool裡面的data
export const getActivitiesByAids = (state, aids) => aids.map(aid => getActivityByAid(state, aid));
