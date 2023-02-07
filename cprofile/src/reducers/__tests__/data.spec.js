import { fromJS, Map } from 'immutable';
import reducer from '../data';
import * as CardActions from '../../actions/ui/card';

describe('區塊資料', () => {
	beforeEach(() => {
		console.warn = jest.fn();
	});

	it('初始化區塊資料', () => {
		const state = reducer(
			undefined,
			CardActions.initCard('test-block-id', 'honor', 'def', { foo: 'bar' })
		);
		expect(state.size).toBe(1);
		expect(state.has('test-block-id')).toBe(true);
		expect(state.get('test-block-id')).toEqual(Map({ foo: 'bar' }));
	});
	it('更換模板，若該區塊含有任一筆真實 id 的資料，預期不會有任何影響', () => {
		const expData = [
			{
				honorId: 'hhhhhhhh',
			},
			{
				honorId: 'tmp-123123',
			},
		];
		const initState = fromJS({
			test: expData,
		});
		const state = reducer(
			initState,
			CardActions.changeTemplate('test', 'card', 'honor')
		);
		expect(state.get('test').size).toBe(2);
		expect(state.get('test')).toEqual(fromJS(expData));
	});
	it('更換模板，若該區塊所有資料都是假 id，預期會按照模板設定變換假資料數量', () => {
		const initState = fromJS({
			test: [
				{
					honorId: 'tmp-123123',
				},
			],
		});
		const state = reducer(
			initState,
			CardActions.changeTemplate('test', 'card', 'honor')
		);
		expect(state.get('test').size).toBe(3);
	});
	it('更新只有單筆資料的區塊', () => {
		const initState = fromJS({
			test: {
				id: 'tmp-123123',
				title: 'hehehe',
			},
		});
		const state = reducer(
			initState,
			CardActions.updateCard('test', 'yooooo', ['title'])
		);
		expect(state.getIn(['test', 'title'])).toBe('yooooo');
	});
	it('更新多筆資料區塊的某一筆', () => {
		const initState = fromJS({
			test: [
				{
					id: 'tmp-123123',
					title: 'hehehe',
				},
				{
					id: 'tmp-55555',
					title: 'gggggg',
				},
			],
		});
		const state = reducer(
			initState,
			CardActions.updateCard('test', 'yooooo', [1, 'title'])
		);
		expect(state.getIn(['test', 0, 'title'])).toBe('hehehe');
		expect(state.getIn(['test', 1, 'title'])).toBe('yooooo');
	});
	it('更新資料，若該區塊 ID 找不到，預期不會有任何影響', () => {
		const initState = fromJS({
			test: [
				{
					id: 'tmp-123123',
					title: 'hehehe',
				},
				{
					id: 'tmp-55555',
					title: 'gggggg',
				},
			],
		});
		const state = reducer(
			initState,
			CardActions.updateCard('test333', 'yooooo', [1, 'title'])
		);
		expect(state.getIn(['test', 0, 'title'])).toBe('hehehe');
		expect(state.getIn(['test', 1, 'title'])).toBe('gggggg');
	});
	it('更新資料，若資料 ID 找不到，預設新建一個', () => {
		const initState = fromJS({
			test: [
				{
					id: 'tmp-123123',
					title: 'hehehe',
				},
				{
					id: 'tmp-55555',
					title: 'gggggg',
				},
			],
		});
		const state = reducer(
			initState,
			CardActions.updateCard('test', 'yooooo', [2, 'title'])
		);
		expect(state.get('test').size).toBe(3);
		expect(state.getIn(['test', 0, 'title'])).toBe('hehehe');
		expect(state.getIn(['test', 1, 'title'])).toBe('gggggg');
		expect(state.getIn(['test', 2, 'title'])).toBe('yooooo');
	});
	it('新增區塊時，初始化資料', () => {
		const state = reducer(
			undefined,
			CardActions.addCard('honor', 'test', 0, 'def', false)
		);
		expect(state.size).toBe(1);
		expect(state.get('test').size).toBe(3);
	});
	it('隱藏區塊時，資料仍保留不清除', () => {
		const initState = fromJS({
			test: [
				{
					honorId: 'test-honor',
				},
			],
		});
		const state = reducer(
			initState,
			CardActions.archiveCard('test', 'honor', 'def')
		);
		expect(state.has('test')).toBe(true);
	});
	it('若為多筆資料區塊，則新增單筆資料預期在第一筆', () => {
		const initState = fromJS({
			test: [
				{
					honorId: 'test-honor',
				},
			],
		});
		const state = reducer(
			initState,
			CardActions.addBlockElem('honor', 'test', 'new-data')
		);
		expect(state.get('test').first()).toEqual(Map({ honorId: 'new-data' }));
	});
	it('若為單筆資料區塊，則新增單筆資料預期沒有影響', () => {
		const initState = fromJS({
			test: {
				customId: 'test-custom',
			},
		});
		const state = reducer(
			initState,
			CardActions.addBlockElem('custom', 'test', 'new-data')
		);
		expect(state).toEqual(initState);
	});
	it('若為多筆資料區塊，則複製單筆資料預期在被複製的資料後面', () => {
		const initState = fromJS({
			test: [
				{
					honorId: 'test-honor',
					title: 'yeee',
				},
			],
		});
		const state = reducer(
			initState,
			CardActions.copyBlockElem('honor', 'test', 'test-honor', 'new-data')
		);
		expect(state.get('test').size).toBe(2);
		expect(state.getIn(['test', 1])).toEqual(
			Map({
				honorId: 'new-data',
				title: 'yeee',
			})
		);
	});
	it('若為單筆資料區塊，則複製單筆資料預期沒有影響', () => {
		const initState = fromJS({
			test: {
				customId: 'test-custom',
			},
		});
		const state = reducer(
			initState,
			CardActions.copyBlockElem('custom', 'test', 'new-data')
		);
		expect(state).toEqual(initState);
	});

	it('若為多筆資料區塊，則正常移動單筆資料', () => {
		const initState = fromJS({
			test: [
				{
					honorId: 'test-honor',
					title: 'yeee',
				},
				{
					honorId: 'good-honor',
					title: 'lalala',
				},
			],
		});
		const state = reducer(
			initState,
			CardActions.moveBlockElem('honor', 'test', 'good-honor', 1, 0)
		);
		expect(state.get('test')).toEqual(
			fromJS([
				{
					honorId: 'good-honor',
					title: 'lalala',
				},
				{
					honorId: 'test-honor',
					title: 'yeee',
				},
			])
		);
	});
	it('若為單筆資料區塊，則移動單筆資料預期沒有影響', () => {
		const initState = fromJS({
			test: {
				customId: 'test-custom',
			},
		});
		const state = reducer(
			initState,
			CardActions.copyBlockElem('custom', 'test', 'new-data')
		);
		expect(state).toEqual(initState);
	});

	it('若為多筆資料區塊，則正常刪除單筆資料', () => {
		const initState = fromJS({
			test: [
				{
					honorId: 'test-honor',
				},
			],
		});
		const state = reducer(
			initState,
			CardActions.deleteBlockElem('honor', 'test', 'test-honor')
		);
		expect(state.get('test').size).toBe(0);
	});
	it('若為單筆資料區塊，則刪除單筆資料預期沒有影響', () => {
		const initState = fromJS({
			test: {
				customId: 'test-custom',
			},
		});
		const state = reducer(
			initState,
			CardActions.deleteBlockElem('custom', 'test', 'test-custom')
		);
		expect(state).toEqual(initState);
	});
	it('若為多筆資料區塊，更換假資料 ID 為真資料 ID', () => {
		const initState = fromJS({
			test: [
				{
					honorId: 'tmp-honor',
				},
			],
		});
		const state = reducer(
			initState,
			CardActions.transTempIdToUID('honor', 'test', 'tmp-honor', 'real-honor')
		);
		expect(state.getIn(['test', 0, 'honorId'])).toBe('real-honor');
	});
	it('若為單筆資料區塊，更換 ID 預期沒有影響', () => {
		const initState = fromJS({
			test: {
				customId: 'tmp-custom',
			},
		});
		const state = reducer(
			initState,
			CardActions.transTempIdToUID(
				'custom',
				'test',
				'tmp-custom',
				'real-custom'
			)
		);
		expect(state.getIn(['test', 'customId'])).toBe('tmp-custom');
	});
	it('若找不到假資料 ID，預期更換 ID 沒有影響', () => {
		const initState = fromJS({
			test: [
				{
					honorId: 'tmp-honor',
				},
			],
		});
		const state = reducer(
			initState,
			CardActions.transTempIdToUID(
				'honor',
				'test',
				'tmp-honor111',
				'real-honor'
			)
		);
		expect(state.getIn(['test', 0, 'honorId'])).toBe('tmp-honor');
	});
});
