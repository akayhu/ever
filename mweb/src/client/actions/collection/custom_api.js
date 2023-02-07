import {loadListDataCenter} from 'src/client/actions/general';

export const initCollectionPage = () => (dispatch, getState) => {
	if (!getState().collection.hasLoaded) {
		const targetPid = getState().user.pid;
		return dispatch(loadListDataCenter({domain: 'collection', key: 'activity', targetPid}));
	}
	return Promise.resolve();
};
