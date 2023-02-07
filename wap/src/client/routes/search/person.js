export default {
	path: '/search/person/:keyword(/**)',
	getComponent(nextState, cb) {
		require.ensure([], (require) => {
			cb(null, require('src/client/containers/search/searchPersonList/index').default);
		}, 'searchPersonList');
	}
};
