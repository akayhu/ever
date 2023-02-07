import configureStore from 'redux-mock-store';
import middlewares, { API_LEVEL } from '../process';
import { processingStart, processingEnd } from '../../actions/process';

const initState = {};
const mockStore = configureStore([middlewares]);
const store = mockStore(initState);

describe('非同步處理監控 middleware', () => {
	beforeEach(() => {
		store.clearActions();
	});

	test.each([
		[
			'REQUEST_ 前綴',
			'會註冊一個 key 不帶有前綴的 process',
			{ type: 'REQUEST_MY_API' },
			[{ type: 'REQUEST_MY_API' }, processingStart('MY_API', API_LEVEL)],
		],
		[
			'RECIEVE_ 前綴',
			'會結束一個 key 不帶有前綴的 process',
			{ type: 'RECIEVE_MY_API' },
			[{ type: 'RECIEVE_MY_API' }, processingEnd('MY_API', API_LEVEL)],
		],
		[
			'FAILURE_ 前綴',
			'會結束一個 key 不帶有前綴的 process',
			{ type: 'FAILURE_MY_API' },
			[{ type: 'FAILURE_MY_API' }, processingEnd('MY_API', API_LEVEL)],
		],
		[
			'PROCESSING 相關',
			'不會影響結果',
			processingStart('hehe'),
			[processingStart('hehe')],
		],
		[
			'PROCESSING 相關',
			'不會影響結果',
			processingEnd('hehe'),
			[processingEnd('hehe')],
		],
		[
			'不符合上述條件',
			'不會影響結果',
			{ type: 'MY_ACTION' },
			[{ type: 'MY_ACTION' }],
		],
	])('%s的 action %s', (prefix, expText, action, expActionSeq) => {
		store.dispatch(action);
		expect(store.getActions()).toEqual(expActionSeq);
	});
});
