/* eslint-disable */
import { List } from 'immutable';
import swap from '../swap';

describe('取得 Immutable sort() 排序判定數字', () => {
	beforeEach(() => {
		console.error = jest.fn();
	});
	it('遞增排序 asc', () => {
		expect(
			List([2, 1, 4]).sort((prev, next) => swap(prev, next, 'asc'))
		).toEqual(List([1, 2, 4]));
	});

	it('遞減排序 desc', () => {
		expect(
			List([5, 2, 3]).sort((prev, next) => swap(prev, next, 'desc'))
		).toEqual(List([5, 3, 2]));
	});

	it('自訂排序：id 包含 tmp- 按照順序往後擺', () => {
		expect(
			List(['tmp-1', 'tmp-2', 'id-1', 'id-2']).sort((prev, next) =>
				swap(prev, next, 'tmp-backward')
			)
		).toEqual(List(['id-1', 'id-2', 'tmp-1', 'tmp-2']));
	});

	it('自訂排序：id 包含 tmp- 按照順序往後擺', () => {
		expect(
			List(['tmp-2', 'tmp-1', 'id-1', 'id-2']).sort((prev, next) =>
				swap(prev, next, 'tmp-backward')
			)
		).toEqual(List(['id-1', 'id-2', 'tmp-2', 'tmp-1']));
	});

	it('自訂排序：id 包含 tmp- 按照順序往後擺', () => {
		expect(
			List(['tmp-1', 'id-1', 'tmp-2', 'id-2']).sort((prev, next) =>
				swap(prev, next, 'tmp-backward')
			)
		).toEqual(List(['id-1', 'id-2', 'tmp-1', 'tmp-2']));
	});

	it('自訂排序：id 包含 tmp- 按照順序往後擺', () => {
		expect(
			List(['id-2', 'id-1', 'tmp-2', 'tmp-1']).sort((prev, next) =>
				swap(prev, next, 'tmp-backward')
			)
		).toEqual(List(['id-2', 'id-1', 'tmp-2', 'tmp-1']));
	});

	it('自訂排序：id 包含 tmp- 按照順序往前擺', () => {
		expect(
			List(['tmp-1', 'tmp-2', 'id-1', 'id-2']).sort((prev, next) =>
				swap(prev, next, 'tmp-forward')
			)
		).toEqual(List(['tmp-1', 'tmp-2', 'id-1', 'id-2']));
	});

	it('自訂排序：id 包含 tmp- 按照順序往前擺', () => {
		expect(
			List(['tmp-2', 'tmp-1', 'id-1', 'id-2']).sort((prev, next) =>
				swap(prev, next, 'tmp-forward')
			)
		).toEqual(List(['tmp-2', 'tmp-1', 'id-1', 'id-2']));
	});

	it('自訂排序：id 包含 tmp- 按照順序往前擺', () => {
		expect(
			List(['tmp-1', 'id-1', 'tmp-2', 'id-2']).sort((prev, next) =>
				swap(prev, next, 'tmp-forward')
			)
		).toEqual(List(['tmp-1', 'tmp-2', 'id-1', 'id-2']));
	});

	it('自訂排序：id 包含 tmp- 按照順序往前擺', () => {
		expect(
			List(['id-2', 'id-1', 'tmp-2', 'tmp-1']).sort((prev, next) =>
				swap(prev, next, 'tmp-forward')
			)
		).toEqual(List(['tmp-2', 'tmp-1', 'id-2', 'id-1']));
	});

	it('沒給排序名，預設為遞增排序 asc', () => {
		expect(List([7, 9, 2]).sort((prev, next) => swap(prev, next))).toEqual(
			List([2, 7, 9])
		);
	});

	it('未定義的排序沒有作用', () => {
		expect(
			List([7, 9, 2]).sort((prev, next) => swap(prev, next, 'fooooooo'))
		).toEqual(List([7, 9, 2]));
	});
});
