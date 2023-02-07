/* eslint-disable */
import {
	UPLOAD_CROPPED_IMAGE,
	uploadCroppedImage,
	FETCH_PREVIEW_FILE,
	fetchPreviewFile,
} from 'actions/document';

describe('document actions', () => {
	it('upload Cropped Image', () => {
		const file = 'Indust';
		const payload = {
			id: 7533967,
		};
		const expectedAction = {
			type: UPLOAD_CROPPED_IMAGE,
			file,
			payload,
		};
		expect(uploadCroppedImage(file, payload)).toEqual(expectedAction);
	});

	it('fetch Preview File', () => {
		const fileId = '75187c4ccff64ec48ef4ce17f8edbe6f14';
		const payload = {
			id: 7533967,
		};
		const expectedAction = {
			type: FETCH_PREVIEW_FILE,
			fileId,
			payload,
		};
		expect(fetchPreviewFile(fileId, payload)).toEqual(expectedAction);
	});
});
