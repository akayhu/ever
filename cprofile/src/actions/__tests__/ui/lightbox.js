/* eslint-disable */
import {
	LIGHTBOX_OPEN,
	lightboxOpen,
	lightboxClose,
	LIGHTBOX_CLOSE,
} from 'actions/ui/lightbox';

describe('lightbox actions', () => {
	it('開啟 lightbox', () => {
		const expectedAction = {
			type: LIGHTBOX_OPEN,
		};
		expect(lightboxOpen()).toEqual(expectedAction);
	});

	it('關閉 lightbox', () => {
		const expectedAction = {
			type: LIGHTBOX_CLOSE,
		};
		expect(lightboxClose()).toEqual(expectedAction);
	});
});
