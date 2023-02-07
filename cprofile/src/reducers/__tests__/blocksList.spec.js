/* eslint-disable */
import reducer from '../blocksList';
import { RECIEVE_FETCH_BLOCK_LIST } from '../../actions/blocks';
import {
	addCard,
	deleteCard,
	archiveCard,
	moveCard,
	updateCardOrder,
	removeExtraUniKey,
} from '../../actions/ui/card';
import { List } from 'immutable';

beforeEach(() => {
	console.log = jest.fn();
	console.warn = jest.fn();
	console.error = jest.fn();
});
describe('區塊排序', () => {
	it('初始化', () => {
		expect(reducer(undefined, {})).toBe(List());
	});

	describe('Block API Response', () => {
		it('按順序只保存 blockId (不包含 basic 區塊)', () => {
			const action = {
				type: RECIEVE_FETCH_BLOCK_LIST,
				payload: [
					{
						blockId: 'b487bf37-5b79-4f5b-a9e6-87bc889d2aef',
						type: 'basic',
						template: 'new',
						visibility: true,
					},
					{
						blockId: 'e230da09-1a3c-4a12-ac91-9c87e1e0d271',
						type: 'honor',
						template: 'new',
						visibility: true,
					},
				],
			};
			expect(reducer(undefined, action)).toEqual(
				List(['e230da09-1a3c-4a12-ac91-9c87e1e0d271'])
			);
		});
		it('隱藏的區塊不儲存 blockId', () => {
			const action = {
				type: RECIEVE_FETCH_BLOCK_LIST,
				payload: [
					{
						blockId: 'b487bf37-5b79-4f5b-a9e6-87bc889d2aef',
						type: 'basic',
						template: 'new',
						visibility: true,
					},
					{
						blockId: 'e230da09-1a3c-4a12-ac91-9c87e1e0d271',
						type: 'honor',
						template: 'new',
						visibility: false,
					},
				],
			};
			expect(reducer(undefined, action)).toEqual(List([]));
		});
		it('重複呼叫，應保持最新的順序', () => {
			const action = {
				type: RECIEVE_FETCH_BLOCK_LIST,
				payload: [
					{
						blockId: 'b487bf37-5b79-4f5b-a9e6-87bc889d2aef',
						type: 'basic',
						template: 'new',
						visibility: true,
					},
					{
						blockId: 'e230da09-1a3c-4a12-ac91-9c87e1e0d271',
						type: 'honor',
						template: 'new',
						visibility: true,
					},
				],
			};
			expect(reducer(undefined, action)).toEqual(
				List(['e230da09-1a3c-4a12-ac91-9c87e1e0d271'])
			);
		});
	});

	describe('區塊操作', () => {
		it('新增區塊，在尾端 append 一個新區塊', () => {
			expect(
				reducer(
					List(['prev', 'next']),
					addCard('demoType', 'b487bf37-5b79-4f5b-a9e6-87bc889d2aef', 1)
				)
			).toEqual(List(['prev', 'b487bf37-5b79-4f5b-a9e6-87bc889d2aef', 'next']));
		});
		it('刪除區塊，從列表移除一個區塊', () => {
			expect(reducer(List(['prev', 'next']), deleteCard('next'))).toEqual(
				List(['prev'])
			);
		});
		it('隱藏區塊，視同從列表移除一個區塊', () => {
			expect(
				reducer(List(['prev', 'next']), archiveCard('prev', 'demoType'))
			).toEqual(List(['next']));
		});
		it('移動區塊到指定位置', () => {
			expect(reducer(List(['prev', 'next']), moveCard('prev', 1))).toEqual(
				List(['next', 'prev'])
			);
		});
		it('一次性更新區塊順序', () => {
			const prevList = List([
				'c076854e-b2b6-4d61-8012-5205320d0d17',
				'f85a5445-8448-4432-973a-9690e95eb1f3',
				'586f7765-f09c-4da1-aa87-16b90192c326',
			]);
			const nextList = [
				'586f7765-f09c-4da1-aa87-16b90192c326',
				'f85a5445-8448-4432-973a-9690e95eb1f3',
				'c076854e-b2b6-4d61-8012-5205320d0d17',
			];

			expect(reducer(prevList, updateCardOrder(nextList))).toEqual(
				List(nextList)
			);
		});
		it('一次性更新順序，若新的區塊順序數量比原本少，忽略不處理', () => {
			const prevList = List([
				'c076854e-b2b6-4d61-8012-5205320d0d17',
				'f85a5445-8448-4432-973a-9690e95eb1f3',
				'586f7765-f09c-4da1-aa87-16b90192c326',
			]);
			const nextList = [
				'586f7765-f09c-4da1-aa87-16b90192c326',
				'c076854e-b2b6-4d61-8012-5205320d0d17',
			];

			expect(reducer(prevList, updateCardOrder(nextList))).toEqual(prevList);
		});
		it('一次性更新順序，新的區塊順序只接受 uuid array，其餘忽略不處理', () => {
			const prevList = List([
				'c076854e-b2b6-4d61-8012-5205320d0d17',
				'f85a5445-8448-4432-973a-9690e95eb1f3',
			]);
			const nextList = ['block1', 'block2'];

			expect(reducer(prevList, updateCardOrder(nextList))).toEqual(prevList);
		});
		it('若有 block 設定卻沒有資料，移除該區塊 id', () => {
			expect(
				reducer(List(['prev', 'next']), removeExtraUniKey('prev'))
			).toEqual(List(['next']));
		});
	});
});
