export default {
	path: '/search/:mode/:keyword(/**)',
	getComponent(nextState, cb) {
		require.ensure([], (require) => {
			cb(null, require('src/client/containers/search/searchActivityList/index').default);
		}, 'searchActivityList');
	}
};
