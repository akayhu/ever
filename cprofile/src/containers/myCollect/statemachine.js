import { Machine } from 'xstate';
import { fetchMyCollectionProcess } from 'actions/collection';

const statechart = {
	key: 'collection',
	initial: 'loading',
	states: {
		loading: {
			onEntry: [fetchMyCollectionProcess()],
			on: {
				SHOW_LIST: 'list',
				SHOW_EMPTY: 'empty',
				ERROR: 'error',
			},
		},
		list: {
			on: {
				REFRESH: 'loading',
			},
		},
		empty: {
			on: {
				REFRESH: 'loading',
			},
		},
		error: {
			on: {
				REFRESH: 'loading',
			},
		},
	},
};

export default Machine(statechart);
