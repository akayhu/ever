/* eslint-disable */
import {
	MENUBAR_OPEN,
	menubarOpen,
	MENUBAR_CLOSE,
	menubarClose,
	PREVIEW_OPEN,
	previewOpen,
	SEARCH_OPEN,
	searchOpen,
	THEME_OPEN,
	themeOpen,
} from 'actions/ui/menubar';

describe('menubar actions', () => {
	it('開啟 menubar', () => {
		const expectedAction = {
			type: MENUBAR_OPEN,
		};
		expect(menubarOpen()).toEqual(expectedAction);
	});

	it('關閉 menubar', () => {
		const expectedAction = {
			type: MENUBAR_CLOSE,
		};
		expect(menubarClose()).toEqual(expectedAction);
	});

	it('開啟 preview', () => {
		const expectedAction = {
			type: PREVIEW_OPEN,
		};
		expect(previewOpen()).toEqual(expectedAction);
	});

	it('開啟 search', () => {
		const expectedAction = {
			type: SEARCH_OPEN,
		};
		expect(searchOpen()).toEqual(expectedAction);
	});

	it('開啟 theme', () => {
		const expectedAction = {
			type: THEME_OPEN,
		};
		expect(themeOpen()).toEqual(expectedAction);
	});
});
