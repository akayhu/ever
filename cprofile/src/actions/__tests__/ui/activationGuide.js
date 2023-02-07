/* eslint-disable */
import {
	changeToNewVisitor,
	CHANGETO_NEW_VISITOR,
	openPreloginService,
	OPEN_PRELOGIN_SERVICE,
	closePreloginService,
	CLOSE_PRELOGIN_SERVICE,
} from 'actions/ui/activationGuide';

describe('activationGuide actions', () => {
	it('全新使用者是否顯示 activation', () => {
		const expectedAction = {
			type: CHANGETO_NEW_VISITOR,
		};
		expect(changeToNewVisitor()).toEqual(expectedAction);
	});

	it('首頁開啟顯示服務轉移頁面', () => {
		const expectedAction = {
			type: OPEN_PRELOGIN_SERVICE,
		};
		expect(openPreloginService()).toEqual(expectedAction);
	});

	it('首頁關閉顯示服務轉移頁面', () => {
		const expectedAction = {
			type: CLOSE_PRELOGIN_SERVICE,
		};
		expect(closePreloginService()).toEqual(expectedAction);
	});
});
