/* eslint-disable */
import reducer from 'reducers/ui/activationGuide';
import {
	CHANGETO_NEW_VISITOR,
	OPEN_PRELOGIN_SERVICE,
	CLOSE_PRELOGIN_SERVICE,
} from 'actions/ui/activationGuide';
import Immutable from 'immutable';

describe('Activation Guide 操作', () => {
	test('品牌新訪客', () => {
		const action = {
			type: CHANGETO_NEW_VISITOR,
		};
		expect(reducer(undefined, action)).toEqual(
			Immutable.fromJS({
				brandNewVisitor: true,
				showPreloginService: false,
			})
		);
	});

	test('打開首頁服務公告', () => {
		const action = {
			type: OPEN_PRELOGIN_SERVICE,
		};
		expect(reducer(undefined, action)).toEqual(
			Immutable.fromJS({
				brandNewVisitor: false,
				showPreloginService: true,
			})
		);
	});

	test('關閉首頁服務公告', () => {
		const action = {
			type: CLOSE_PRELOGIN_SERVICE,
		};
		expect(reducer(undefined, action)).toEqual(
			Immutable.fromJS({
				brandNewVisitor: false,
				showPreloginService: false,
			})
		);
	});
});
