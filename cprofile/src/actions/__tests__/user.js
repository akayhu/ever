/* eslint-disable */
import {
	ACCOUNT_PROCESS_START,
	accountProcessStart,
	ACCOUNT_PROCESS_END,
	accountProcessEnd,
	ACCOUNT_PROCESS_ERROR,
	accountProcessError,
	INITIAL_PROFILE_PROCESS_START,
	initialProfileProcessStart,
	INITIAL_PROFILE_PROCESS_END,
	initialProfileProcessEnd,
	INITIAL_PROFILE_PROCESS_ERROR,
	initialProfileProcessError,
	USER_LOGIN,
	login,
	USER_LOGOUT,
	logout,
	UPDATE_USER_DATA,
	updateUserData,
} from 'actions/user';

describe('user actions', () => {
	it('開始取得使用者帳戶資料流程', () => {
		const expectedAction = {
			type: ACCOUNT_PROCESS_START,
		};
		expect(accountProcessStart()).toEqual(expectedAction);
	});

	it('帳戶流程成功', () => {
		const expectedAction = {
			type: ACCOUNT_PROCESS_END,
		};
		expect(accountProcessEnd()).toEqual(expectedAction);
	});

	it('帳戶流程失敗', () => {
		const error = 'error';
		const expectedAction = {
			type: ACCOUNT_PROCESS_ERROR,
			error,
		};
		expect(accountProcessError(error)).toEqual(expectedAction);
	});

	it('開始啟用服務流程', () => {
		const expectedAction = {
			type: INITIAL_PROFILE_PROCESS_START,
		};
		expect(initialProfileProcessStart()).toEqual(expectedAction);
	});

	it('啟用服務流程成功', () => {
		const expectedAction = {
			type: INITIAL_PROFILE_PROCESS_END,
		};
		expect(initialProfileProcessEnd()).toEqual(expectedAction);
	});

	it('啟用服務流程失敗', () => {
		const error = 'error';
		const expectedAction = {
			type: INITIAL_PROFILE_PROCESS_ERROR,
			error,
		};
		expect(initialProfileProcessError(error)).toEqual(expectedAction);
	});

	it('使用者登入，轉導 AC login 路徑', () => {
		const returnUrl = '/';
		const expectedAction = {
			type: USER_LOGIN,
			returnUrl,
		};
		expect(login()).toEqual(expectedAction);
	});

	it('使用者登出，轉導 AC logout 路徑', () => {
		const returnUrl = '/';
		const expectedAction = {
			type: USER_LOGOUT,
			returnUrl,
		};
		expect(logout()).toEqual(expectedAction);
	});

	it('更新使用者 basic 資訊', () => {
		const payload = {
			id: 108190,
		};
		const expectedAction = {
			type: UPDATE_USER_DATA,
			payload,
		};
		expect(updateUserData(payload)).toEqual(expectedAction);
	});
});
