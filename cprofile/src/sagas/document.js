import { delay } from 'redux-saga';
import LogRocket from 'logrocket';
import { takeEvery, put, take, select, call } from 'redux-saga/effects';
import uuid from 'uuid/v4';
import { tagsToGetFileArr } from 'config/document';
import {
	requestDocumentSignature,
	uploadToS3,
	requestDocumentUrl,
	requestDocumentArrayUrl,
	requestDocumentReConvert,
	// RECIEVE_DOCUMENT_URL,
	UPLOAD_CROPPED_IMAGE,
	FETCH_PREVIEW_FILE,
	RECIEVE_DOCUMENT_ARRAY_URL,
} from 'actions/document';
import {
	BLOCK_DATA_UPDATE_PROCESS_END,
	BLOCK_DATA_UPDATE_PROCESS_ERROR,
} from 'actions/blocks';
import { processingStart, processingEnd } from 'actions/process';
import { pushSystemMessage } from 'actions/ui/systemMessage';
import { requestAPI } from './util';

/**
 * Watch Sage
 */
export function* watchUploadProcess() {
	yield takeEvery(UPLOAD_CROPPED_IMAGE, uploadCroppedImage);
}

/**
 * 上傳已裁切圖片 TODO: 調整成檔案上傳共用
 */
export function* uploadCroppedImage(action) {
	const file = action.file;
	const {
		contentType,
		fileId,
		fileName,
		coordinate,
		componentType,
		getFileData,
		onBeforeProcessing,
		onStartProcessing,
		onFinishProcessing,
		convertType,
		mediaType,
	} = action.payload;

	const key = fileId || uuid();
	let newFileId = fileId;

	try {
		yield put(processingStart(key, 'uploadCroppedImage'));
		const pid = yield select(state => state.getIn(['user', 'pid']));

		// 上傳新圖片
		if (!newFileId) {
			const signature = yield call(requestAPI, requestDocumentSignature, {
				pid,
				contentType: contentType || 'image/jpeg',
				convertType: convertType || 'cover',
				fileName: fileName || 'upload.jpg',
				coordinate,
			});
			yield put(uploadToS3(file, signature.payload));

			newFileId = signature.payload.fileId;

			// 調整頭像圖片位置 (只需要更新座標即可)
		} else if (convertType === 'avatar') {
			const result = yield take([
				BLOCK_DATA_UPDATE_PROCESS_END,
				BLOCK_DATA_UPDATE_PROCESS_ERROR,
			]);

			if (result.error) throw Error(result);

			// 調整其他圖片位置
		} else {
			yield call(requestAPI, requestDocumentReConvert, {
				pid,
				fileId,
				coordinate,
				convertType,
			});
		}

		// update fileId & coordinate
		// 檔案上傳是圖擋的話先執行 onStartProcessing 更新 fileId 跟 coordinate(圖片共用)
		if (typeof onStartProcessing === 'function' && mediaType === 'IMAGE') {
			yield call(onStartProcessing, {
				fileId: newFileId,
				coordinate,
				convertType,
			});
		}

		let done = false;
		let passingTime = 0;
		let fileUrlMap = {};
		while (!done) {
			yield put(
				requestDocumentArrayUrl({
					fileId: newFileId,
					convertType: convertType || 'cover',
				})
				// requestDocumentUrl({
				// 	pid,
				// 	getFileArr: tagsToGetFileArr({
				// 		fileId: newFileId,
				// 		mediaType: mediaType || 'IMAGE',
				// 		convertType: convertType || 'cover',
				// 	}),
				// })
			);

			const result = yield take(RECIEVE_DOCUMENT_ARRAY_URL);
			const fileUrls = result.payload;

			// 0: origin, 1: crop, 2: w1920, 3: w960, 4: w600
			if (fileUrls.every(file => file.convertStatus === 'success')) {
				done = true;
				fileUrlMap = fileUrls.reduce(
					(urlsMap, file) =>
						file.tag
							? Object.assign(urlsMap, {
									[file.tag]: file.url,
							  })
							: urlsMap,
					{}
				);
				if (componentType && componentType === 'gallery') {
					yield call(getFileData, { pending: false });
				}
			} else if (
				componentType &&
				componentType === 'gallery' &&
				fileUrls.every(
					file =>
						file.convertStatus === 'pending' ||
						file.convertStatus === 'uploading'
				)
			) {
				yield call(getFileData, { pending: true });
				yield delay(4000);
			} else if (
				fileUrls.some(
					file =>
						file.convertStatus === 'failed' || file.convertStatus === 'stopped'
				)
			) {
				done = true;
				yield put(
					pushSystemMessage(`圖片上傳發生錯誤，請再重新上傳一次!`, 'error')
				);
				throw Error(`轉檔失敗, fileId: ${newFileId}, response: `, result);
			} else if (passingTime > 60000) {
				done = true;
				yield put(
					pushSystemMessage(`圖片上傳逾時，請再重新上傳一次!`, 'error')
				);
				throw Error(`轉檔逾時, fileId: ${newFileId}, response: `, result);
			} else {
				passingTime += 2000;
				yield call(delay, 2000);
			}
		}

		// 作品集新增一筆資料檔案上傳所執行的 onBeforeProcessing ，提供 data URI & 座標(作品集用)
		if (typeof onBeforeProcessing === 'function') {
			yield call(onBeforeProcessing, {
				fileId: newFileId,
				fileUrlMap,
				coordinate,
			});
		}

		// 檔案上傳是非圖擋的話後執行 onStartProcessing 提供 fileId & file URI(作品集用)
		if (typeof onStartProcessing === 'function' && mediaType !== 'IMAGE') {
			yield call(onStartProcessing, {
				fileId: newFileId,
				coordinate,
				convertType,
			});
		}

		if (typeof onFinishProcessing === 'function') {
			yield call(onFinishProcessing, {
				fileId: newFileId,
				fileUrlMap,
				coordinate,
				convertType,
				mediaType,
			});
		}
	} catch (e) {
		console.error(e);
		LogRocket.captureException(e, {
			tags: {
				fileId: newFileId,
			},
		});
	} finally {
		yield put(processingEnd(key, 'uploadCroppedImage'));
	}
}

/**
 * 取得檔案連結 & 預覽圖片
 */
export function* watchFetchPreviewFile() {
	yield takeEvery(FETCH_PREVIEW_FILE, function*(action) {
		const {
			fileId,
			payload: {
				mediaType,
				convertType,
				onSuccess,
				onError,
				actionType,
				page,
				isGallery = false,
			},
		} = action;
		yield put(processingStart(fileId, 'fetchPreviewFile'));

		try {
			let done = false;
			let passingTime = 0;

			while (!done) {
				const result = yield call(
					requestAPI,
					isGallery ? requestDocumentArrayUrl : requestDocumentUrl,
					isGallery
						? {
								fileId,
								convertType,
						  }
						: {
								getFileArr: tagsToGetFileArr({
									fileId,
									mediaType: mediaType || 'IMAGE',
									convertType: convertType || 'cover',
									page,
								}),
						  },
					10000,
					actionType
				);

				const fileUrls = result.payload;

				if (fileUrls.every(file => file.convertStatus === 'success')) {
					done = true;
					const fileUrlMap = fileUrls.reduce(
						(urlsMap, file) =>
							Object.assign(urlsMap, {
								[file.tag || 'origin']: file.url, // array
							}),
						{}
					);

					if (typeof onSuccess === 'function') {
						yield call(onSuccess, fileUrlMap);
					}
				} else if (
					fileUrls.some(
						file =>
							file.convertStatus === 'failed' ||
							file.convertStatus === 'stopped'
					)
				) {
					done = true;
					throw Error('取得檔案連結失敗', result);
				} else if (passingTime > 10000) {
					done = true;
					throw Error('取得檔案連結逾時', result);
				} else {
					passingTime += 1000;
					yield call(delay, 1000);
				}
			}
		} catch (e) {
			console.error(e);
			if (typeof onError === 'function') {
				yield call(onError, e);
			}
		} finally {
			yield put(processingEnd(fileId, 'fetchPreviewFile'));
		}
	});
}
