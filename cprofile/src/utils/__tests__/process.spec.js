/* eslint-disable */
import {
	checkProcessIsDone,
	checkProcessIsLoading,
	hasAnyProcessing,
} from '../process';
import { initState, createProcess } from '../../reducers/process';
import { List, Map } from 'immutable';

describe('非同步處理監控 selector', () => {
	describe('checkProcessIsDone', () => {
		it('指定 key 的 process 已完成', () => {
			const state = Map({
				processing: List(),
				history: List([createProcess({ key: 'myProcess' })]),
			});
			expect(checkProcessIsDone(state, 'myProcess')).toBe(true);
		});
		it('指定 key 的 process 尚未完成', () => {
			const state = Map({
				processing: List([createProcess({ key: 'myProcess' })]),
				history: List(),
			});
			expect(checkProcessIsDone(state, 'myProcess')).toBe(false);
		});
		it('不存在的 process key 視同未完成', () => {
			const state = Map({
				processing: List([createProcess({ key: 'myProcess' })]),
				history: List(),
			});
			expect(checkProcessIsDone(state, 'yourProcess')).toBe(false);
		});
		it('一旦相同 process 完成過一次，之後檢查都會是已完成', () => {
			const state = Map({
				processing: List([createProcess({ key: 'myProcess' })]),
				history: List([createProcess({ key: 'myProcess' })]),
			});
			expect(checkProcessIsDone(state, 'myProcess')).toBe(true);
		});
	});

	describe('checkProcessIsLoading', () => {
		it('指定 key 的 process 正在執行中', () => {
			const state = Map({
				processing: List([createProcess({ key: 'myProcess' })]),
				history: List(),
			});
			expect(checkProcessIsLoading(state, 'myProcess')).toBe(true);
		});
		it('已完成的 process 視為未執行中', () => {
			const state = Map({
				processing: List(),
				history: List([createProcess({ key: 'myProcess' })]),
			});
			expect(checkProcessIsLoading(state, 'myProcess')).toBe(false);
		});
		it('不存在的 process 視同未執行中', () => {
			expect(checkProcessIsLoading(initState, 'myProcess')).toBe(false);
		});
	});

	describe('hasAnyProcessing', () => {
		it('沒有執行中的 process 就預期 false', () => {
			expect(hasAnyProcessing(initState)).toBe(false);
		});
		it('有執行中的 process 就預期 true', () => {
			const state = Map({
				processing: List([createProcess({ key: 'myProcess' })]),
				history: List(),
			});
			expect(hasAnyProcessing(state)).toBe(true);
		});
		it('不論完成幾個, 只要沒有執行中的 process 就預期 false', () => {
			const state = Map({
				processing: List(),
				history: List([createProcess(), createProcess(), createProcess()]),
			});
			expect(hasAnyProcessing(state)).toBe(false);
		});
	});
});
