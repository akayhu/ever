import Immutable from 'immutable';
import {
	MENUBAR_OPEN,
	MENUBAR_CLOSE,
	PREVIEW_OPEN,
	SEARCH_OPEN,
	THEME_OPEN,
} from 'actions/ui/menubar';

const initState = Immutable.fromJS({
	visible: true,
	preview: false,
	search: false,
	theme: false,
});

const MenubarReducer = (state = initState, action) => {
	switch (action.type) {
		case MENUBAR_OPEN:
			return state
				.update('visible', value => true)
				.update('preview', value => false)
				.update('search', value => false)
				.update('theme', value => false);

		case MENUBAR_CLOSE:
			return state
				.update('visible', value => false)
				.update('preview', value => false)
				.update('search', value => false)
				.update('theme', value => false);

		case PREVIEW_OPEN:
			return state
				.update('visible', value => false)
				.update('preview', value => true)
				.update('search', value => false)
				.update('theme', value => false);

		case SEARCH_OPEN:
			return state
				.update('visible', value => false)
				.update('preview', value => false)
				.update('search', value => true)
				.update('theme', value => false);

		case THEME_OPEN:
			return state
				.update('visible', value => false)
				.update('preview', value => false)
				.update('search', value => false)
				.update('theme', value => true);

		default:
			return state;
	}
};

export default MenubarReducer;
