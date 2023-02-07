/* eslint-disable */
import {
	SUBMIT_SEARCH_QUERY,
	submitSearchQuery,
	CLEAR_PREVIOUS_SEARCH,
	clearPreviousSearch,
	CLEAR_PREVIOUS_SIMILAR,
	clearPreviousSimilar,
	SET_PROFILE_PRIVACY,
	setProfilePrivacy,
	FETCH_PRIVACY_PROCESS,
	fetchPrivacyProcess,
	SWITCH_PRIVACY_PROCESS,
	switchPrivacyProcess,
	SET_PRIVACY_PROCESS,
	setPrivacyProcess,
} from 'actions/profile';

describe('profile actions', () => {
	it('改變 store 儲存的關鍵字並送出搜尋', () => {
		const keyword = 'Indust';
		const expectedAction = {
			type: SUBMIT_SEARCH_QUERY,
			keyword,
		};
		expect(submitSearchQuery(keyword)).toEqual(expectedAction);
	});

	it('清除上一次搜尋', () => {
		const expectedAction = {
			type: CLEAR_PREVIOUS_SEARCH,
		};
		expect(clearPreviousSearch()).toEqual(expectedAction);
	});

	it('清除上一次相似的人', () => {
		const expectedAction = {
			type: CLEAR_PREVIOUS_SIMILAR,
		};
		expect(clearPreviousSimilar()).toEqual(expectedAction);
	});

	it('更新分享設定', () => {
		const privacy = '';
		const token = null;
		const expectedAction = {
			type: SET_PROFILE_PRIVACY,
			privacy,
			token,
		};
		expect(setProfilePrivacy(privacy, token)).toEqual(expectedAction);
	});

	it('觸發取得分享設定流程', () => {
		const expectedAction = {
			type: FETCH_PRIVACY_PROCESS,
		};
		expect(fetchPrivacyProcess()).toEqual(expectedAction);
	});

	it('根據 privacy 切換對應顯示', () => {
		const expectedAction = {
			type: SWITCH_PRIVACY_PROCESS,
		};
		expect(switchPrivacyProcess()).toEqual(expectedAction);
	});

	it('觸發更新分享設定流程', () => {
		const expectedAction = {
			type: SET_PRIVACY_PROCESS,
		};
		expect(setPrivacyProcess()).toEqual(expectedAction);
	});
});
