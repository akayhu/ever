export default {
	path: '/search/group/:keyword(/**)',
	getComponent(nextState, cb) {
		require.ensure([], (require) => {
			cb(null, require('src/client/containers/search/searchGroupList/index').default);
		}, 'searchGroupList');
	}
};
