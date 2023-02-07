export default {
	path: '/search/channel/:keyword(/**)',
	getComponent(nextState, cb) {
		require.ensure([], (require) => {
			cb(null, require('src/client/containers/search/searchChannelList/index').default);
		}, 'searchChannelList');
	}
};
