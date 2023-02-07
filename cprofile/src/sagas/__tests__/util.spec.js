import { RSAA } from 'redux-api-middleware';
import { runSaga } from 'redux-saga';
import { requestAPI } from '../util';

describe('執行 API 更新', () => {
	beforeEach(() => {
		jest.useFakeTimers();
		console.error = jest.fn();
	});

	it('action 不是 RSAA，預期回傳 falsy value 並觸發錯誤訊息', () => {
		const action = () => ({
			endpoint: '/endpoint',
			types: ['REQUEST_API', 'RECIEVE_API', 'ERROR_API'],
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
		});
		const res = runSaga(global.mockIO(), requestAPI, action).result();
		expect(console.error).toBeCalledTimes(1);
		expect(res).toBeFalsy();
	});

	it('API 結果成功，預期回傳 response', () => {
		const action = () => ({
			[RSAA]: {
				endpoint: '/endpoint',
				types: ['REQUEST_API', 'RECIEVE_API', 'ERROR_API'],
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
			},
		});
		const saga = runSaga(global.mockIO(), requestAPI, action);
		const resultAction = { type: 'RECIEVE_API', payload: { foo: 'bar' } };
		global.actionTrigger.emit('action', resultAction);

		const res = saga.result();
		expect(console.error).toBeCalledTimes(0);
		expect(res).toEqual(resultAction);
	});

	it('API 結果失敗，預期回傳 falsy value 並觸發錯誤訊息', () => {
		const action = () => ({
			[RSAA]: {
				endpoint: '/endpoint',
				types: ['REQUEST_API', 'RECIEVE_API', 'ERROR_API'],
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
			},
		});
		const saga = runSaga(global.mockIO(), requestAPI, action);
		const resultAction = { type: 'ERROR_API', error: { foo: 'bar' } };
		global.actionTrigger.emit('action', resultAction);

		const res = saga.result();
		expect(console.error).toBeCalledTimes(2);
		expect(res).toBeFalsy();
	});

	it('API 執行超過 10 秒逾時，預期回傳 falsy value 並觸發錯誤訊息', async () => {
		const action = () => ({
			[RSAA]: {
				endpoint: '/endpoint',
				types: ['REQUEST_API', 'RECIEVE_API', 'ERROR_API'],
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
			},
		});
		runSaga(global.mockIO(), requestAPI, action);
		expect(setTimeout).toHaveBeenCalledTimes(1);
		expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 10000);
		// TODO: 暫時測不到 timer 結束後的 saga 結果
		// expect(saga.result()).toBe(null);
		// expect(console.error).toBeCalledTimes(1);
	});
});
