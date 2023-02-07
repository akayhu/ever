export default {
	path: '/prelogin',
	getComponent(nextState, cb) {
		require.ensure([], (require) => {
			cb(null, require('src/client/containers/prelogin/topic/index').default);
		}, 'prelogin-topic');
	}
};
