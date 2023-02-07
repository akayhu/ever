/* eslint-disable */
import reducer, { initState, createProcess } from '../process';
import { List, Map } from 'immutable';
import { processingStart, processingEnd } from '../../actions/process';

describe('非同步處理監控', () => {
	it('初始化', () => {
		expect(reducer(undefined, {})).toBe(initState);
	});
	it('執行層級 level 預設是 global, process key 預設是自動產生的 uuid', () => {
		const nextState = reducer(undefined, processingStart());
		expect(nextState.getIn(['processing', 0, 'level'])).toBe('global');
		expect(nextState.getIn(['processing', 0, 'key'])).toEqual(
			expect.stringMatching(
				/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/
			)
		);
	});
	it('可以指定 process key & 執行層級', () => {
		const nextState = reducer(undefined, processingStart('myKey', 'myLevel'));
		expect(nextState.getIn(['processing', 0, 'key'])).toBe('myKey');
		expect(nextState.getIn(['processing', 0, 'level'])).toBe('myLevel');
	});

	it('當執行層級、key 相同，將舊的移到 process 隊列最後面', () => {
		const process1 = createProcess({ key: 'process1' });
		const process2 = createProcess({ key: 'process2' });
		const myProcess = createProcess({ key: 'myProcess', level: 'test' });
		const oriState = Map({
			processing: List([myProcess, process1, process2]),
			history: List(),
		});
		const nextState = reducer(oriState, processingStart('myProcess', 'test'));

		expect(nextState.get('processing').last()).toEqual(myProcess);
	});
	it('當執行層級、key 有任何不同，視為新增 process 到隊列最後面', () => {
		const process1 = createProcess({ key: 'process1' });
		const process2 = createProcess({ key: 'process2' });
		const myProcess = createProcess({ key: 'myProcess', level: 'test' });
		const oriState = Map({
			processing: List([myProcess, process1, process2]),
			history: List(),
		});
		const nextState = reducer(oriState, processingStart('myProcess', 'hahaha'));

		expect(nextState.get('processing')).toEqual(
			List([
				myProcess,
				process1,
				process2,
				createProcess({ key: 'myProcess', level: 'hahaha' }),
			])
		);
	});
	it('key 和 level 一樣的 process 完成時會移到 history', () => {
		const process1 = createProcess({ key: 'process1' });
		const process2 = createProcess({ key: 'process2' });
		const myProcess = createProcess({ key: 'myProcess', level: 'test' });
		const oriState = Map({
			processing: List([myProcess, process1, process2]),
			history: List(),
		});

		const expState = {
			removeSame: Map({
				processing: List([process1, process2]),
				history: List([myProcess]),
			}),
			noRemove: oriState,
		};

		const nextState = {
			removeSame: reducer(oriState, processingEnd('myProcess', 'test')),
			noRemove: reducer(oriState, processingEnd('myProcess', 'hahaha')),
		};

		expect(nextState.removeSame).toEqual(expState.removeSame);
		expect(nextState.noRemove).toEqual(expState.noRemove);
	});
});
