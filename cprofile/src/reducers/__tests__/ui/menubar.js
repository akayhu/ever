/* eslint-disable */
import reducer from 'reducers/ui/menubar';
import {
	MENUBAR_OPEN,
	MENUBAR_CLOSE,
	PREVIEW_OPEN,
	SEARCH_OPEN,
	THEME_OPEN,
} from 'actions/ui/menubar';
import Immutable from 'immutable';

describe('menubar 操作', () => {
	test('打開 menubar', () => {
		const action = {
			type: MENUBAR_OPEN,
		};
		expect(reducer(undefined, action)).toEqual(
			Immutable.fromJS({
				visible: true,
				preview: false,
				search: false,
				theme: false,
			})
		);
	});

	test('關閉 menubar', () => {
		const action = {
			type: MENUBAR_CLOSE,
		};
		expect(reducer(undefined, action)).toEqual(
			Immutable.fromJS({
				visible: false,
				preview: false,
				search: false,
				theme: false,
			})
		);
	});

	test('打開 preview', () => {
		const action = {
			type: PREVIEW_OPEN,
		};
		expect(reducer(undefined, action)).toEqual(
			Immutable.fromJS({
				visible: false,
				preview: true,
				search: false,
				theme: false,
			})
		);
	});

	test('打開 search', () => {
		const action = {
			type: SEARCH_OPEN,
		};
		expect(reducer(undefined, action)).toEqual(
			Immutable.fromJS({
				visible: false,
				preview: false,
				search: true,
				theme: false,
			})
		);
	});

	test('打開 theme', () => {
		const action = {
			type: THEME_OPEN,
		};
		expect(reducer(undefined, action)).toEqual(
			Immutable.fromJS({
				visible: false,
				preview: false,
				search: false,
				theme: true,
			})
		);
	});
});
